import React, { useState } from 'react';
import { Building2, AlertTriangle, Eye, Camera, MapPin, Calendar, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ViolationReportModal } from '@/components/ViolationReportModal';
import { ViolationDetailsModal } from '@/components/ViolationDetailsModal';
import { AddEvidenceModal } from '@/components/AddEvidenceModal';

const ZoningWatch = () => {
  const [activeTab, setActiveTab] = useState('violations');
  const [violationModalOpen, setViolationModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [evidenceModalOpen, setEvidenceModalOpen] = useState(false);
  const [selectedViolation, setSelectedViolation] = useState<any>(null);

  const violations = [
    {
      id: 1,
      title: "Unauthorized High-Rise Construction",
      location: "Plot 123, Kindaruma Road",
      developer: "Urban Heights Ltd",
      violationType: "Height Limit Exceeded",
      reportedDate: "2024-03-10",
      status: "Under Investigation",
      severity: "High",
      evidence: 8,
      witnesses: 15,
      description: "Building exceeds 8-story zoning limit by 4 floors",
      assignedOfficer: "James Mwangi - Senior Planning Officer",
      officerContact: "j.mwangi@nairobi.go.ke | +254-20-2757000",
      responseTimeHours: 18,
      expectedResolution: "2024-04-15"
    },
    {
      id: 2,
      title: "Commercial Use in Residential Zone",
      location: "Argwings Kodhek Road",
      developer: "Metro Business Center",
      violationType: "Zoning Misuse",
      reportedDate: "2024-03-08",
      status: "Confirmed Violation",
      severity: "Medium",
      evidence: 12,
      witnesses: 23,
      description: "Operating nightclub in designated residential area",
      assignedOfficer: "Grace Wanjiku - Zoning Enforcement",
      officerContact: "g.wanjiku@nairobi.go.ke | +254-20-2757001",
      responseTimeHours: 6,
      expectedResolution: "2024-03-25"
    },
    {
      id: 3,
      title: "Inadequate Parking Provision",
      location: "Wood Avenue Plaza",
      developer: "Prime Properties",
      violationType: "Parking Standards",
      reportedDate: "2024-03-05",
      status: "Pending Review",
      severity: "Low",
      evidence: 5,
      witnesses: 8,
      description: "Provided 50 spaces instead of required 100 spaces",
      responseTimeHours: 72
    }
  ];

  const zoningInfo = [
    {
      zone: "R1 - Low Density Residential",
      maxHeight: "3 Stories",
      plotRatio: "0.3",
      coverage: "30%",
      area: "45% of Kilimani"
    },
    {
      zone: "R2 - Medium Density Residential", 
      maxHeight: "6 Stories",
      plotRatio: "1.0",
      coverage: "40%",
      area: "30% of Kilimani"
    },
    {
      zone: "Mixed Use Commercial",
      maxHeight: "8 Stories",
      plotRatio: "2.0", 
      coverage: "60%",
      area: "20% of Kilimani"
    },
    {
      zone: "Open Space/Recreation",
      maxHeight: "N/A",
      plotRatio: "0.1",
      coverage: "10%",
      area: "5% of Kilimani"
    }
  ];

  const complianceStats = {
    totalDevelopments: 342,
    compliant: 298,
    violations: 44,
    underReview: 18,
    resolved: 26
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High': return 'bg-red-100 text-red-700';
      case 'Medium': return 'bg-yellow-100 text-yellow-700';
      case 'Low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Under Investigation': return 'bg-blue-100 text-blue-700';
      case 'Confirmed Violation': return 'bg-red-100 text-red-700';
      case 'Pending Review': return 'bg-yellow-100 text-yellow-700';
      case 'Resolved': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleViewDetails = (violation: any) => {
    setSelectedViolation(violation);
    setDetailsModalOpen(true);
  };

  const handleAddEvidence = (violation: any) => {
    setSelectedViolation(violation);
    setEvidenceModalOpen(true);
  };

  const handleTrackProgress = (violation: any) => {
    alert(`Now tracking progress for: ${violation.title}`);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-poppins font-bold text-gray-900 mb-2">Zoning Watch</h1>
        <p className="text-muted-foreground">Monitor zoning compliance and building violations in your area</p>
      </div>

      {/* Compliance Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-blue-500" />
            <span className="text-2xl font-bold">{complianceStats.totalDevelopments}</span>
          </div>
          <p className="text-sm text-muted-foreground">Total Projects</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center space-x-2">
            <Eye className="w-5 h-5 text-green-500" />
            <span className="text-2xl font-bold">{complianceStats.compliant}</span>
          </div>
          <p className="text-sm text-muted-foreground">Compliant</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <span className="text-2xl font-bold">{complianceStats.violations}</span>
          </div>
          <p className="text-sm text-muted-foreground">Violations</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-yellow-500" />
            <span className="text-2xl font-bold">{complianceStats.underReview}</span>
          </div>
          <p className="text-sm text-muted-foreground">Under Review</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-primary" />
            <span className="text-2xl font-bold">{complianceStats.resolved}</span>
          </div>
          <p className="text-sm text-muted-foreground">Resolved</p>
        </div>
      </div>

      {/* Report Violation Button */}
      <div className="mb-6">
        <Button 
          onClick={() => setViolationModalOpen(true)}
          className="bg-red-500 hover:bg-red-600 text-white" 
          size="lg"
        >
          <Camera className="w-5 h-5 mr-2" />
          Report Zoning Violation
        </Button>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
        {[
          { id: 'violations', label: 'Active Violations' },
          { id: 'zoning', label: 'Zoning Info' },
          { id: 'tracker', label: 'Gov Response Tracker' },
          { id: 'compliance', label: 'Compliance Map' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'violations' && (
        <div className="space-y-4">
          {violations.map(violation => (
            <div key={violation.id} className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{violation.title}</h3>
                  <p className="text-muted-foreground mb-3">{violation.description}</p>
                  
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span><strong>Location:</strong> {violation.location}</span>
                      </div>
                      <div className="flex items-center space-x-2 mb-2">
                        <Building2 className="w-4 h-4 text-gray-400" />
                        <span><strong>Developer:</strong> {violation.developer}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span><strong>Reported:</strong> {violation.reportedDate}</span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <Camera className="w-4 h-4 text-gray-400" />
                        <span><strong>Evidence:</strong> {violation.evidence} photos/videos</span>
                      </div>
                      <div className="flex items-center space-x-2 mb-2">
                        <Eye className="w-4 h-4 text-gray-400" />
                        <span><strong>Witnesses:</strong> {violation.witnesses} community reports</span>
                      </div>
                      <div>
                        <strong>Type:</strong> {violation.violationType}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-2 items-end">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(violation.severity)}`}>
                    {violation.severity} Risk
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(violation.status)}`}>
                    {violation.status}
                  </span>
                </div>
              </div>
              
              <div className="flex space-x-3 pt-4 border-t">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleViewDetails(violation)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleAddEvidence(violation)}
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Add Evidence
                </Button>
                <Button 
                  size="sm" 
                  className="bg-primary hover:bg-primary/90"
                  onClick={() => handleTrackProgress(violation)}
                >
                  Track Progress
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'zoning' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Kilimani Zoning Classifications</h3>
            <div className="grid gap-4">
              {zoningInfo.map((zone, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h4 className="font-semibold text-primary mb-3">{zone.zone}</h4>
                  <div className="grid md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Max Height:</span>
                      <p className="text-muted-foreground">{zone.maxHeight}</p>
                    </div>
                    <div>
                      <span className="font-medium">Plot Ratio:</span>
                      <p className="text-muted-foreground">{zone.plotRatio}</p>
                    </div>
                    <div>
                      <span className="font-medium">Site Coverage:</span>
                      <p className="text-muted-foreground">{zone.coverage}</p>
                    </div>
                    <div>
                      <span className="font-medium">Area Coverage:</span>
                      <p className="text-muted-foreground">{zone.area}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">🏛️ Planning Guidelines</h4>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>• All developments must comply with Nairobi City County zoning regulations</li>
              <li>• Environmental Impact Assessments required for projects above 6 stories</li>
              <li>• Minimum 30% green space required for all residential developments</li>
              <li>• Parking ratio: 1 space per 100m² for commercial, 1 per unit for residential</li>
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'tracker' && (
        <div className="space-y-6">
          {/* Header Stats */}
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              Government Response Tracker
            </h3>
            <p className="text-muted-foreground mb-6">
              Monitor county action on community reports and zoning violations
            </p>
            
            {/* Response Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <div className="text-2xl font-bold text-green-700 mb-1">41%</div>
                <div className="text-sm text-green-600">Acknowledged by County</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="text-2xl font-bold text-blue-700 mb-1">2.4</div>
                <div className="text-sm text-blue-600">Avg Response Days</div>
              </div>
              <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                <div className="text-2xl font-bold text-orange-700 mb-1">18%</div>
                <div className="text-sm text-orange-600">Resolution Rate</div>
              </div>
              <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                <div className="text-2xl font-bold text-red-700 mb-1">3</div>
                <div className="text-sm text-red-600">Critical Pending</div>
              </div>
            </div>

            {/* Responsiveness Score */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 border border-yellow-200">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Government Responsiveness Score</h4>
                  <p className="text-sm text-muted-foreground">Based on acknowledgment and resolution rates</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-yellow-600">59%</div>
                  <div className="text-sm text-yellow-700 font-medium">Needs Attention</div>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Reports with Response Tracking */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Recent Reports with Response Status</h4>
            {violations.map(violation => (
              <div key={violation.id} className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h5 className="text-lg font-semibold text-gray-900 mb-2">{violation.title}</h5>
                    <div className="flex items-center space-x-2 mb-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-muted-foreground">{violation.location}</span>
                    </div>
                    
                    {/* Response Timeline */}
                    <div className="mt-4">
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${
                            violation.status === 'Pending Review' ? 'bg-yellow-400' : 'bg-green-400'
                          }`}></div>
                          <span>Submitted</span>
                        </div>
                        <div className="flex-1 h-px bg-gray-200"></div>
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${
                            violation.status === 'Under Investigation' || violation.status === 'Confirmed Violation' 
                              ? 'bg-green-400' : 'bg-gray-300'
                          }`}></div>
                          <span>Acknowledged</span>
                        </div>
                        <div className="flex-1 h-px bg-gray-200"></div>
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${
                            violation.assignedOfficer ? 'bg-green-400' : 'bg-gray-300'
                          }`}></div>
                          <span>Assigned</span>
                        </div>
                        <div className="flex-1 h-px bg-gray-200"></div>
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${
                            violation.status === 'Resolved' ? 'bg-green-400' : 'bg-gray-300'
                          }`}></div>
                          <span>Resolved</span>
                        </div>
                      </div>
                    </div>

                    {/* Officer Assignment */}
                    {violation.assignedOfficer && (
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="text-sm">
                          <div className="font-medium text-blue-900">Assigned Officer</div>
                          <div className="text-blue-700">{violation.assignedOfficer}</div>
                          <div className="text-blue-600 text-xs">{violation.officerContact}</div>
                        </div>
                      </div>
                    )}

                    {/* Response Time */}
                    {violation.responseTimeHours && (
                      <div className="mt-3 text-sm">
                        <span className="font-medium">Response Time: </span>
                        <span className={`${
                          violation.responseTimeHours <= 24 ? 'text-green-600' :
                          violation.responseTimeHours <= 72 ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {violation.responseTimeHours} hours
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col space-y-2 items-end">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(violation.severity)}`}>
                      {violation.severity} Priority
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(violation.status)}`}>
                      {violation.status}
                    </span>
                  </div>
                </div>
                
                <div className="flex space-x-3 pt-4 border-t">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewDetails(violation)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                  {violation.status !== 'Resolved' && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleAddEvidence(violation)}
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      Add Evidence
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-6 border border-primary/20">
            <h4 className="font-semibold text-primary mb-2">📢 Demand Better Accountability</h4>
            <p className="text-sm text-muted-foreground mb-4">
              When government response is slow, your voice matters. Share this data with local representatives and media.
            </p>
            <div className="flex space-x-3">
              <Button size="sm" variant="outline">
                Export Report
              </Button>
              <Button size="sm" variant="outline">
                Share on Social
              </Button>
              <Button size="sm" className="bg-primary hover:bg-primary/90">
                Contact Officials
              </Button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'compliance' && (
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Interactive Compliance Map</h3>
          <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-semibold mb-2">Interactive Map Coming Soon</h4>
              <p className="text-muted-foreground mb-4">
                View real-time zoning violations and compliance status on an interactive map
              </p>
              <Button className="bg-primary hover:bg-primary/90">
                Enable Map View
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <ViolationReportModal 
        isOpen={violationModalOpen}
        onClose={() => setViolationModalOpen(false)}
      />
      
      <ViolationDetailsModal
        isOpen={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        violation={selectedViolation}
      />
      
      <AddEvidenceModal
        isOpen={evidenceModalOpen}
        onClose={() => setEvidenceModalOpen(false)}
        violationId={selectedViolation?.id}
      />
    </div>
  );
};

export default ZoningWatch;
