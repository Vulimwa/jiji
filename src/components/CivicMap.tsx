import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import { Button } from '@/components/ui/button';
import { Filter, Plus, MapPin, ZoomIn, ZoomOut, Layers } from 'lucide-react';
import { ViolationDetailsModal } from './ViolationDetailsModal';
import { AddEvidenceModal } from './AddEvidenceModal';

interface Issue {
  id: string;
  title: string;
  category: string;
  location: [number, number];
  status: 'reported' | 'acknowledged' | 'in-progress' | 'resolved';
  priority_votes: number;
}

interface CivicMapProps {
  onReportIssue: () => void;
}

export const CivicMap: React.FC<CivicMapProps> = ({ onReportIssue }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [mapStyle, setMapStyle] = useState<'osm' | 'satellite' | 'hybrid'>('osm');
  const [selectedViolation, setSelectedViolation] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEvidenceModal, setShowEvidenceModal] = useState(false);

  const categories = [
    { id: 'sewage', label: 'Sewage', color: '#8B4513' },
    { id: 'noise', label: 'Noise', color: '#FF6B35' },
    { id: 'construction', label: 'Illegal Construction', color: '#F44336' },
    { id: 'power', label: 'Power Cuts', color: '#FFC107' },
    { id: 'roads', label: 'Road Issues', color: '#9C27B0' },
    { id: 'waste', label: 'Waste Management', color: '#4CAF50' },
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

  // Sample issues data (in real app, this would come from Supabase)
  const sampleIssues: Issue[] = [
    {
      id: '1',
      title: 'Broken sewage pipe',
      category: 'sewage',
      location: [36.8219, -1.2921],
      status: 'reported',
      priority_votes: 15
    },
    {
      id: '2',
      title: 'Loud construction at night',
      category: 'noise',
      location: [36.8250, -1.2900],
      status: 'acknowledged',
      priority_votes: 8
    },
    {
      id: '3',
      title: 'Frequent power outages',
      category: 'power',
      location: [36.8180, -1.2940],
      status: 'in-progress',
      priority_votes: 23
    }
  ];

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

    // Add issue markers
    sampleIssues.forEach(issue => {
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
          </div>
        `);

      new maplibregl.Marker(el)
        .setLngLat(issue.location)
        .setPopup(popup)
        .addTo(map.current!);
    });

    return () => {
      map.current?.remove();
    };
  }, [userLocation, mapStyle]);

  const handleZoomIn = () => {
    if (map.current) {
      map.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (map.current) {
      map.current.zoomOut();
    }
  };

  const switchMapStyle = (style: 'osm' | 'satellite' | 'hybrid') => {
    setMapStyle(style);
  };

  const toggleFilter = (categoryId: string) => {
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
            <span className="text-sm font-medium">Filter Issues</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Button
                key={category.id}
                variant={selectedFilters.includes(category.id) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleFilter(category.id)}
                className="text-xs"
                style={{
                  backgroundColor: selectedFilters.includes(category.id) ? category.color : undefined,
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
              onChange={(e) => switchMapStyle(e.target.value as 'osm' | 'satellite' | 'hybrid')}
              className="text-xs border-none bg-transparent focus:outline-none"
            >
              <option value="osm">Street Map</option>
              <option value="satellite">Satellite</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>
        </div>
      </div>

      {/* Custom Zoom Controls */}
      <div className="absolute bottom-32 right-4 z-10 flex flex-col space-y-2">
        <Button
          size="icon"
          onClick={handleZoomIn}
          className="bg-white text-gray-700 hover:bg-gray-50 shadow-lg"
          variant="outline"
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Button
          size="icon"
          onClick={handleZoomOut}
          className="bg-white text-gray-700 hover:bg-gray-50 shadow-lg"
          variant="outline"
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
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

      {/* Floating Action Button */}
      <button
        onClick={onReportIssue}
        className="jiji-fab"
        aria-label="Report Issue"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Modals */}
      <ViolationDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        violation={selectedViolation}
      />

      <AddEvidenceModal
        isOpen={showEvidenceModal}
        onClose={() => setShowEvidenceModal(false)}
        violationId={selectedViolation?.id}
      />
    </div>
  );
};
