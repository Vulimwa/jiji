import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import { Button } from '@/components/ui/button';
import { Filter, Plus, MapPin, ZoomIn, ZoomOut, Layers } from 'lucide-react';
import { useCivicIssues } from '@/hooks/useSupabaseData';
import { useZoningViolations } from '@/hooks/useZoningViolations';

interface EnhancedCivicMapProps {
  onReportIssue: () => void;
  onReportViolation: () => void;
}

export const EnhancedCivicMap: React.FC<EnhancedCivicMapProps> = ({ 
  onReportIssue, 
  onReportViolation 
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [mapStyle, setMapStyle] = useState<'osm' | 'satellite' | 'hybrid'>('osm');
  const [showZoningViolations, setShowZoningViolations] = useState(true);

  const { data: issues } = useCivicIssues();
  const { data: violations } = useZoningViolations();

  const categories = [
    { id: 'sewage', label: 'Sewage', color: '#8B4513' },
    { id: 'noise', label: 'Noise', color: '#FF6B35' },
    { id: 'construction', label: 'Illegal Construction', color: '#F44336' },
    { id: 'power', label: 'Power Cuts', color: '#FFC107' },
    { id: 'roads', label: 'Road Issues', color: '#9C27B0' },
    { id: 'waste', label: 'Waste Management', color: '#4CAF50' },
    { id: 'violations', label: 'Zoning Violations', color: '#E91E63' },
  ];

  const mapStyles = {
    osm: 'https://demotiles.maplibre.org/style.json',
    satellite: {
      version: 8 as const,
      sources: {
        'satellite': {
          type: 'raster' as const,
          tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
          tileSize: 256
        }
      },
      layers: [{
        id: 'satellite',
        type: 'raster' as const,
        source: 'satellite'
      }]
    },
    hybrid: {
      version: 8 as const,
      sources: {
        'satellite': {
          type: 'raster' as const,
          tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
          tileSize: 256
        },
        'labels': {
          type: 'raster' as const,
          tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}'],
          tileSize: 256
        }
      },
      layers: [
        {
          id: 'satellite',
          type: 'raster' as const,
          source: 'satellite'
        },
        {
          id: 'labels',
          type: 'raster' as const,
          source: 'labels'
        }
      ]
    }
  };

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.longitude, position.coords.latitude]);
        },
        (error) => {
          console.error('Error getting location:', error);
          // Default to Kilimani center
          setUserLocation([36.8219, -1.2921]);
        },
        { enableHighAccuracy: true }
      );
    } else {
      setUserLocation([36.8219, -1.2921]);
    }
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || !userLocation) return;

    const currentStyle = mapStyle === 'osm' ? mapStyles.osm : mapStyles[mapStyle];

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: currentStyle,
      center: userLocation,
      zoom: 14,
      attributionControl: false
    });

    // Add zoom controls
    const zoomControl = new maplibregl.NavigationControl({
      showCompass: false,
      showZoom: true
    });
    map.current.addControl(zoomControl, 'bottom-right');

    // Add user location marker
    new maplibregl.Marker({ color: '#FF6B35' })
      .setLngLat(userLocation)
      .setPopup(new maplibregl.Popup().setHTML('<p>Your Location</p>'))
      .addTo(map.current);

    return () => {
      map.current?.remove();
    };
  }, [userLocation, mapStyle]);

  // Add issue markers
  useEffect(() => {
    if (!map.current || !issues) return;

    // Clear existing markers (you'd want to track them properly in production)
    
    issues.forEach((issue: any) => {
      if (!issue.latitude || !issue.longitude) return;
      
      const category = categories.find(c => c.id === issue.category);
      const markerColor = category?.color || '#FF6B35';

      const el = document.createElement('div');
      el.className = 'marker';
      el.style.backgroundColor = markerColor;
      el.style.width = '24px';
      el.style.height = '24px';
      el.style.borderRadius = '50%';
      el.style.border = '3px solid white';
      el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
      el.style.cursor = 'pointer';

      const popup = new maplibregl.Popup({ offset: 25 })
        .setHTML(`
          <div class="p-3">
            <h3 class="font-semibold text-sm">${issue.title}</h3>
            <p class="text-xs text-gray-600 mt-1">Category: ${category?.label}</p>
            <div class="flex items-center justify-between mt-2">
              <span class="jiji-status-badge jiji-status-${issue.status}">${issue.status}</span>
              <span class="text-xs text-gray-500">${issue.priority_votes} votes</span>
            </div>
            ${issue.is_anonymous ? '<p class="text-xs text-gray-500 mt-1">Anonymous Report</p>' : ''}
          </div>
        `);

      new maplibregl.Marker(el)
        .setLngLat([issue.longitude, issue.latitude])
        .setPopup(popup)
        .addTo(map.current!);
    });
  }, [issues, selectedFilters]);

  // Add zoning violation markers
  useEffect(() => {
    if (!map.current || !violations || !showZoningViolations) return;

    violations.forEach((violation: any) => {
      if (!violation.latitude || !violation.longitude) return;
      
      const el = document.createElement('div');
      el.className = 'violation-marker';
      el.style.backgroundColor = '#E91E63';
      el.style.width = '28px';
      el.style.height = '28px';
      el.style.borderRadius = '4px';
      el.style.border = '3px solid white';
      el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
      el.style.cursor = 'pointer';
      el.innerHTML = '⚠️';
      el.style.display = 'flex';
      el.style.alignItems = 'center';
      el.style.justifyContent = 'center';
      el.style.fontSize = '12px';

      const popup = new maplibregl.Popup({ offset: 25 })
        .setHTML(`
          <div class="p-3">
            <h3 class="font-semibold text-sm">${violation.title}</h3>
            <p class="text-xs text-gray-600 mt-1">Type: ${violation.violation_type}</p>
            <div class="flex items-center justify-between mt-2">
              <span class="jiji-status-badge jiji-status-${violation.status}">${violation.status}</span>
              <span class="text-xs px-2 py-1 rounded bg-${violation.severity === 'high' ? 'red' : violation.severity === 'medium' ? 'yellow' : 'green'}-100 text-${violation.severity === 'high' ? 'red' : violation.severity === 'medium' ? 'yellow' : 'green'}-700">
                ${violation.severity.toUpperCase()}
              </span>
            </div>
            ${violation.is_anonymous ? '<p class="text-xs text-gray-500 mt-1">Anonymous Report</p>' : ''}
          </div>
        `);

      new maplibregl.Marker(el)
        .setLngLat([violation.longitude, violation.latitude])
        .setPopup(popup)
        .addTo(map.current!);
    });
  }, [violations, showZoningViolations]);

  const toggleFilter = (categoryId: string) => {
    if (categoryId === 'violations') {
      setShowZoningViolations(!showZoningViolations);
      return;
    }
    
    setSelectedFilters(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  return (
    <div className="relative h-screen w-full">
      {/* Map Container */}
      <div ref={mapContainer} className="absolute inset-0" />

      {/* Filter Controls */}
      <div className="absolute top-4 left-4 right-4 z-10">
        <div className="bg-white rounded-lg shadow-lg p-4">
          <div className="flex items-center space-x-2 mb-3">
            <Filter className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Filter Issues & Violations</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Button
                key={category.id}
                variant={
                  category.id === 'violations' 
                    ? (showZoningViolations ? "default" : "outline")
                    : (selectedFilters.includes(category.id) ? "default" : "outline")
                }
                size="sm"
                onClick={() => toggleFilter(category.id)}
                className="text-xs"
                style={{
                  backgroundColor: 
                    category.id === 'violations' 
                      ? (showZoningViolations ? category.color : undefined)
                      : (selectedFilters.includes(category.id) ? category.color : undefined),
                  borderColor: category.color
                }}
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Map Style Switcher */}
      <div className="absolute top-4 right-4 z-10">
        <div className="bg-white rounded-lg shadow-lg p-2">
          <div className="flex items-center space-x-1">
            <Layers className="w-4 h-4 text-primary" />
            <select 
              value={mapStyle} 
              onChange={(e) => setMapStyle(e.target.value as 'osm' | 'satellite' | 'hybrid')}
              className="text-xs border-none bg-transparent focus:outline-none"
            >
              <option value="osm">Street Map</option>
              <option value="satellite">Satellite</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>
        </div>
      </div>

      {/* Location Info */}
      {userLocation && (
        <div className="absolute bottom-20 left-4 bg-white rounded-lg shadow-lg p-3 z-10">
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-primary" />
            <div>
              <p className="text-sm font-medium">Kilimani, Nairobi</p>
              <p className="text-xs text-muted-foreground">
                {userLocation[1].toFixed(4)}, {userLocation[0].toFixed(4)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Buttons */}
      <div className="absolute bottom-4 right-4 flex flex-col space-y-3 z-10">
        <button
          onClick={onReportViolation}
          className="bg-red-500 hover:bg-red-600 text-white rounded-full p-4 shadow-lg transition-colors"
          aria-label="Report Zoning Violation"
        >
          ⚠️
        </button>
        <button
          onClick={onReportIssue}
          className="jiji-fab"
          aria-label="Report Issue"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};