import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CreateCampaignModal } from '@/components/CreateCampaignModal';
import { CreateEventModal } from '@/components/CreateEventModal';
import { StartDiscussionModal } from '@/components/StartDiscussionModal';
import { 
  Upload, 
  FileText, 
  Volume2, 
  MessageSquare,
  Highlighter,
  Languages,
  Search,
  Flag,
  MessageCircle,
  Users,
  Loader2,
  CheckCircle,
  HelpCircle,
  Download,
  Share2,
  Bookmark,
  Eye,
  Calendar,
  MapPin,
  Send,
  X
} from 'lucide-react';

const JiJiDocs = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedDoc, setUploadedDoc] = useState<string | null>(null);
  const [language, setLanguage] = useState<'english' | 'kiswahili'>('english');
  const [showSummary, setShowSummary] = useState(false);
  const [questionText, setQuestionText] = useState('');
  const [showFAQs, setShowFAQs] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  
  // Modal states
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showDiscussionModal, setShowDiscussionModal] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsProcessing(true);
      // Simulate processing
      setTimeout(() => {
        setUploadedDoc(file.name);
        setShowSummary(true);
        setIsProcessing(false);
      }, 2000);
    }
  };

  const sampleQuestions = [
    "How will this policy affect informal traders in the area?",
    "What are the timelines for implementation?",
    "Who can I contact for more information about this document?",
    "How does this impact local businesses?"
  ];

  const faqs = [
    {
      question: "How does JiJi Docs help me understand civic documents?",
      answer: "JiJi Docs uses AI to break down complex government documents into simple summaries, highlight key points, and generate relevant questions to help you better understand policies that affect your community."
    },
    {
      question: "Can I submit my own questions about documents?",
      answer: "Yes! You can ask specific questions about any document. Our system will simulate AI responses to help clarify complex policies and procedures."
    },
    {
      question: "How do I take action on issues I care about?",
      answer: "After reviewing a document, you can start petitions, join discussions, organize community meetings, or ask questions to government officials directly through the platform."
    },
    {
      question: "Is this available in local languages?",
      answer: "Currently we support English and Kiswahili translations. We're working to add more local languages to make civic information accessible to everyone."
    },
    {
      question: "How often are new documents added?",
      answer: "We continuously monitor and add new civic documents from various government departments. You'll be notified when new relevant documents are available."
    }
  ];

  const handleSubmitQuestion = () => {
    if (questionText.trim()) {
      // Simulate processing
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        setQuestionText('');
        // Could show a success message or simulated response
      }, 1500);
    }
  };

  const mockDocument = {
    title: "Kilimani Ward Development Plan 2024-2029",
    type: "Policy Document",
    datePublished: "January 15, 2024",
    summary: {
      english: "This comprehensive development plan outlines strategic initiatives for infrastructure improvement, economic development, and community services in Kilimani Ward. Key focus areas include road construction, waste management systems, and support for local businesses.",
      kiswahili: "Mpango huu wa ukuzaji wa msimbo wa Kilimani unafafanua mipango ya kimkakati ya uboreshaji wa miundombinu, ukuzaji wa uchumi, na huduma za jamii katika Wadi ya Kilimani. Maeneo makuu ya lengo ni pamoja na ujenzi wa barabara, mifumo ya usimamizi wa taka, na msaada kwa biashara za mtaani."
    },
    keyHighlights: [
      "Budget Allocation: KES 2.5 billion over 5 years",
      "Infrastructure Projects: 15 road improvements planned",
      "Business Support: New micro-finance program launching",
      "Community Centers: 3 new facilities to be built"
    ]
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-primary">JiJi Docs</h1>
        <p className="text-muted-foreground">
          Simplifying complex civic documents for better community understanding
        </p>
      </div>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Document Upload & Analysis
          </CardTitle>
          <CardDescription>
            Upload civic documents to get AI-powered summaries and insights
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
            {isProcessing ? (
              <div className="space-y-4">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                <p className="text-muted-foreground">Processing document...</p>
              </div>
            ) : uploadedDoc ? (
              <div className="space-y-4">
                <CheckCircle className="w-8 h-8 mx-auto text-green-500" />
                <p className="font-medium">Document processed: {uploadedDoc}</p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setUploadedDoc(null);
                    setShowSummary(false);
                  }}
                >
                  Upload Another Document
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <FileText className="w-12 h-12 mx-auto text-muted-foreground" />
                <div>
                  <p className="font-medium">Drop your document here or click to browse</p>
                  <p className="text-sm text-muted-foreground">Supports PDF, DOCX, and TXT files</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  id="file-upload"
                  accept=".pdf,.docx,.txt"
                  onChange={handleFileUpload}
                />
                <label htmlFor="file-upload">
                  <Button variant="outline" className="cursor-pointer">
                    Browse Files
                  </Button>
                </label>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Sample Document Demo */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Sample Document Analysis</CardTitle>
              <CardDescription>
                Explore features with this sample civic document
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={language === 'english' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setLanguage('english')}
              >
                English
              </Button>
              <Button
                variant={language === 'kiswahili' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setLanguage('kiswahili')}
              >
                Kiswahili
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="summary" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="summary">AI Summary</TabsTrigger>
              <TabsTrigger value="questions">Key Questions</TabsTrigger>
              <TabsTrigger value="highlights">Highlights</TabsTrigger>
              <TabsTrigger value="actions">Take Action</TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{mockDocument.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Badge variant="secondary">{mockDocument.type}</Badge>
                    <span>Published: {mockDocument.datePublished}</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4" />
                  🔊 Play Audio Summary
                  <Badge variant="secondary" className="ml-1">Beta</Badge>
                </Button>
              </div>
              
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Highlighter className="w-4 h-4" />
                  AI Generated Summary
                </h4>
                <p className="text-sm leading-relaxed">
                  {mockDocument.summary[language]}
                </p>
              </div>
            </TabsContent>

            <TabsContent value="questions" className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="w-5 h-5" />
                <h4 className="font-medium">Frequently Asked Questions</h4>
              </div>
              <div className="space-y-3">
                {sampleQuestions.map((question, index) => (
                  <Card key={index} className="p-3 hover:bg-muted/50 cursor-pointer transition-colors">
                    <p className="text-sm font-medium">{question}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Click to explore this question
                    </p>
                  </Card>
                ))}
              </div>
              <div className="mt-4 p-4 border-2 border-dashed border-muted-foreground/25 rounded-lg">
                <p className="text-sm font-medium mb-2">Ask Your Own Question</p>
                <Textarea 
                  placeholder="What would you like to know about this document?"
                  className="min-h-[80px]"
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                />
                <div className="flex items-center gap-2 mt-2">
                  <Button 
                    size="sm" 
                    onClick={handleSubmitQuestion}
                    disabled={!questionText.trim() || isProcessing}
                    className="flex items-center gap-2"
                  >
                    {isProcessing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                    Submit Question
                  </Button>
                  {questionText.trim() && (
                    <p className="text-xs text-muted-foreground">
                      AI will analyze and respond within 24 hours
                    </p>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="highlights" className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Highlighter className="w-5 h-5" />
                <h4 className="font-medium">Key Highlights</h4>
              </div>
              <div className="space-y-3">
                {mockDocument.keyHighlights.map((highlight, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                    <p className="text-sm font-medium">{highlight}</p>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="actions" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  className="flex items-center gap-2 h-auto p-4 justify-start"
                  onClick={() => setShowCampaignModal(true)}
                >
                  <Flag className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-medium">Start Petition</div>
                    <div className="text-xs opacity-70">Rally community support</div>
                  </div>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2 h-auto p-4 justify-start"
                  onClick={() => setShowQuestionModal(true)}
                >
                  <MessageSquare className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-medium">Ask Question</div>
                    <div className="text-xs opacity-70">Get clarification</div>
                  </div>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2 h-auto p-4 justify-start"
                  onClick={() => setShowDiscussionModal(true)}
                >
                  <MessageCircle className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-medium">Join Discussion</div>
                    <div className="text-xs opacity-70">Community forum</div>
                  </div>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2 h-auto p-4 justify-start"
                  onClick={() => setShowEventModal(true)}
                >
                  <Users className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-medium">Organize Meeting</div>
                    <div className="text-xs opacity-70">Plan community action</div>
                  </div>
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Document Archive */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Document Archive
          </CardTitle>
          <CardDescription>
            Browse past civic documents and ongoing issues
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: "Budget Allocation 2024", type: "Financial", status: "Active" },
              { title: "Zoning Changes Proposal", type: "Planning", status: "Under Review" },
              { title: "Traffic Management Plan", type: "Infrastructure", status: "Approved" },
              { title: "Waste Collection Policy", type: "Environmental", status: "Active" },
              { title: "Community Center Plans", type: "Development", status: "Proposed" },
              { title: "Market Vendor Guidelines", type: "Commercial", status: "Active" }
            ].map((doc, index) => (
              <Card 
                key={index} 
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedDocument(doc.title)}
              >
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-xs">
                        {doc.type}
                      </Badge>
                      <Badge 
                        variant={doc.status === 'Active' ? 'default' : 'outline'}
                        className="text-xs"
                      >
                        {doc.status}
                      </Badge>
                    </div>
                    <h4 className="font-medium text-sm">{doc.title}</h4>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {Math.floor(Math.random() * 500) + 50} views
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {Math.floor(Math.random() * 30) + 1} days ago
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mt-2">
                      <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                        <Download className="w-3 h-3 mr-1" />
                        PDF
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                        <Share2 className="w-3 h-3 mr-1" />
                        Share
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                        <Bookmark className="w-3 h-3 mr-1" />
                        Save
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* FAQs Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5" />
            Frequently Asked Questions
          </CardTitle>
          <CardDescription>
            Common questions about using JiJi Docs and understanding civic documents
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Contact & Support */}
      <Card>
        <CardHeader>
          <CardTitle>Need More Help?</CardTitle>
          <CardDescription>
            Get in touch with our civic engagement team
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium">Contact Information</h4>
              <div className="space-y-2 text-sm">
                <p className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Email: docs@jijisauti.org
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Office: Kilimani Ward Office, 1st Floor
                </p>
                <p className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Hours: Mon-Fri 8:00 AM - 5:00 PM
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium">Quick Contact</h4>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="contact-email">Your Email</Label>
                  <Input id="contact-email" type="email" placeholder="your.email@example.com" />
                </div>
                <div>
                  <Label htmlFor="contact-message">Message</Label>
                  <Textarea 
                    id="contact-message"
                    placeholder="How can we help you understand civic documents better?"
                    className="min-h-[80px]"
                  />
                </div>
                <Button className="w-full">Send Message</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Document Selection Modal-like Effect */}
      {selectedDocument && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{selectedDocument}</CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSelectedDocument(null)}
                >
                  ✕
                </Button>
              </div>
              <CardDescription>
                Document analysis and summary
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">AI Summary</h4>
                <p className="text-sm text-muted-foreground">
                  This document outlines important changes that will affect the local community. 
                  Key areas of focus include infrastructure development, budget allocation, 
                  and community engagement initiatives planned for the next fiscal year.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Button className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Download PDF
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Flag className="w-4 h-4" />
                  Start Petition
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modals */}
      <CreateCampaignModal 
        isOpen={showCampaignModal} 
        onClose={() => setShowCampaignModal(false)} 
      />
      <CreateEventModal 
        isOpen={showEventModal} 
        onClose={() => setShowEventModal(false)} 
      />
      <StartDiscussionModal 
        isOpen={showDiscussionModal} 
        onClose={() => setShowDiscussionModal(false)} 
      />
      <QuestionModal 
        isOpen={showQuestionModal} 
        onClose={() => setShowQuestionModal(false)} 
      />
    </div>
  );
};

// Question Modal Component
const QuestionModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [question, setQuestion] = useState('');
  const [category, setCategory] = useState('general');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { id: 'general', label: 'General Question' },
    { id: 'policy', label: 'Policy Clarification' },
    { id: 'procedure', label: 'Procedure Inquiry' },
    { id: 'implementation', label: 'Implementation Details' },
    { id: 'timeline', label: 'Timeline Questions' },
    { id: 'contact', label: 'Contact Information' }
  ];

  const handleSubmit = () => {
    if (!question.trim()) return;
    
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      console.log('Question submitted:', { question, category });
      setQuestion('');
      setCategory('general');
      setIsSubmitting(false);
      onClose();
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <HelpCircle className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-bold text-gray-900">Ask a Question</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <Label htmlFor="question-category">Question Category</Label>
            <select
              id="question-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full mt-1 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.label}</option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="question-text">Your Question *</Label>
            <Textarea
              id="question-text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="What would you like to know about this document?"
              className="mt-1"
              rows={4}
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-blue-800 text-sm">
              <strong>💡 Tip:</strong> Be specific about which part of the document you're asking about. 
              Our team will respond within 24 hours with detailed answers.
            </p>
          </div>
        </div>

        <div className="px-6 py-4 border-t bg-gray-50 rounded-b-xl">
          <div className="flex space-x-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              className="flex-1 bg-primary hover:bg-primary/90"
              disabled={!question.trim() || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Question'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JiJiDocs;