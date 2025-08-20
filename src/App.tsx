import React, { useState } from 'react';
import { Upload, Search, Shield, FileText, AlertTriangle, CheckCircle, Scale, BookOpen, MessageSquare, ArrowRight, Info, Users, Target, Zap, Send, Bot } from 'lucide-react';

interface Contract {
  id: string;
  name: string;
  type: string;
  riskScore: number;
  uploadDate: string;
  status: 'analyzing' | 'completed';
  clauses?: ClauseAnalysis[];
}

interface ClauseAnalysis {
  id: string;
  title: string;
  content: string;
  riskLevel: 'low' | 'medium' | 'high';
  explanation: string;
  recommendation: string;
}

interface RiskCategory {
  name: string;
  score: number;
  issues: string[];
  color: string;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

function App() {
  const [activeTab, setActiveTab] = useState<'upload' | 'dashboard' | 'search'>('dashboard');
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // Mock clause analysis data
  const sampleClauses: ClauseAnalysis[] = [
    {
      id: '1',
      title: 'Payment Schedule Clause',
      content: 'The buyer shall pay 20% advance, 70% during construction, and 10% on possession.',
      riskLevel: 'high',
      explanation: 'This payment structure heavily favors the developer with 90% payment before possession. This creates significant risk if the project faces delays or cancellation.',
      recommendation: 'Negotiate for a more balanced payment schedule with maximum 80% payment before possession. Include penalty clauses for construction delays.'
    },
    {
      id: '2',
      title: 'Possession Clause',
      content: 'Possession shall be given within 36 months from the date of agreement, subject to force majeure conditions.',
      riskLevel: 'medium',
      explanation: 'The timeline is reasonable, but the force majeure clause is too broad and could be misused to justify delays.',
      recommendation: 'Define specific force majeure events and include compensation for delays beyond the grace period (typically 6 months).'
    },
    {
      id: '3',
      title: 'Cancellation Policy',
      content: 'In case of cancellation by buyer, 10% of total amount shall be forfeited as cancellation charges.',
      riskLevel: 'medium',
      explanation: 'The forfeiture amount is within reasonable limits as per RERA guidelines, but lacks clarity on refund timeline.',
      recommendation: 'Ensure refund timeline is specified (RERA mandates 45 days) and include interest on delayed refunds.'
    },
    {
      id: '4',
      title: 'RERA Registration',
      content: 'The project is registered under RERA with registration number PR/GJ/AHMEDABAD/AHMEDABAD CITY/AUDA/RAA08745/020220.',
      riskLevel: 'low',
      explanation: 'Proper RERA registration provides legal protection and ensures compliance with regulatory requirements.',
      recommendation: 'Verify the RERA registration status online before signing. This is a positive aspect of the agreement.'
    },
    {
      id: '5',
      title: 'Quality Standards',
      content: 'Construction shall be as per approved plans and specifications mentioned in Schedule II.',
      riskLevel: 'medium',
      explanation: 'The clause references external specifications but lacks detail about quality standards and remedies for defects.',
      recommendation: 'Include specific quality standards, defect liability period (minimum 5 years), and clear remedies for construction defects.'
    }
  ];

  // Mock data for demonstration
  const sampleContract: Contract = {
    id: '1',
    name: 'Property Purchase Agreement - Mumbai.pdf',
    type: 'Real Estate',
    riskScore: 65,
    uploadDate: '2025-01-27',
    status: 'completed',
    clauses: sampleClauses
  };

  const riskCategories: RiskCategory[] = [
    {
      name: 'Payment Terms',
      score: 85,
      issues: ['No penalty clause for delayed payments', 'Advance payment percentage is high'],
      color: 'text-red-600'
    },
    {
      name: 'Legal Compliance',
      score: 45,
      issues: ['RERA registration not mentioned', 'Missing NOC requirements'],
      color: 'text-yellow-600'
    },
    {
      name: 'Property Rights',
      score: 25,
      issues: ['Clear title verification required'],
      color: 'text-green-600'
    },
    {
      name: 'Exit Clauses',
      score: 70,
      issues: ['Limited cancellation options', 'High penalty for buyer withdrawal'],
      color: 'text-red-600'
    }
  ];

  const handleFileUpload = (files: FileList) => {
    const file = files[0];
    if (file) {
      const newContract: Contract = {
        id: Date.now().toString(),
        name: file.name,
        type: file.name.toLowerCase().includes('property') ? 'Real Estate' : 'General Contract',
        riskScore: Math.floor(Math.random() * 40) + 30,
        uploadDate: new Date().toISOString().split('T')[0],
        status: 'analyzing'
      };
      
      setContracts([newContract, ...contracts]);
      
      // Simulate analysis completion
      setTimeout(() => {
        setContracts(prev => prev.map(c => 
          c.id === newContract.id ? { ...c, status: 'completed', clauses: sampleClauses } : c
        ));
      }, 4000);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files);
    }
  };

  const handleSendMessage = () => {
    if (!searchQuery.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: searchQuery,
      timestamp: new Date().toLocaleTimeString()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setSearchQuery('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = {
        'penalty': 'Under the Indian Contract Act, 1872, penalty clauses must be reasonable and not punitive. RERA guidelines suggest that possession delay penalties should be equivalent to the interest rate charged by the developer. For your contract, I recommend negotiating a penalty clause of 2-3% per annum for delays beyond the grace period.',
        'rera': 'RERA (Real Estate Regulation and Development Act) 2016 provides comprehensive protection to homebuyers. Key benefits include: mandatory project registration, standardized agreements, timely possession with penalty provisions, and a dedicated grievance redressal mechanism. All projects above 500 sq meters must be RERA registered.',
        'cancellation': 'Under RERA Section 18, buyers have the right to withdraw from the project and claim refund with interest. The developer must refund the amount within 45 days. However, if cancellation is due to buyer\'s default, reasonable cancellation charges (typically 10-15%) may apply as per the agreement terms.',
        'stamp duty': 'Stamp duty in India varies by state and ranges from 3-10% of the property value. Registration charges are typically 1% of the property value. These are mandatory legal requirements for property transfer. Some states offer reduced rates for women buyers or first-time buyers.',
        'default': 'Based on Indian legal frameworks and contract analysis, here are the key considerations for your query. For specific legal advice, please consult with a qualified legal professional. RERA provides comprehensive protection for real estate transactions, while the Indian Contract Act governs general contractual obligations.'
      };

      let response = responses.default;
      const query = searchQuery.toLowerCase();
      
      if (query.includes('penalty') || query.includes('delay')) response = responses.penalty;
      else if (query.includes('rera')) response = responses.rera;
      else if (query.includes('cancel')) response = responses.cancellation;
      else if (query.includes('stamp') || query.includes('registration')) response = responses['stamp duty'];

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response,
        timestamp: new Date().toLocaleTimeString()
      };

      setIsTyping(false);
      setChatMessages(prev => [...prev, assistantMessage]);
    }, 2000);
  };

  const getRiskColor = (score: number) => {
    if (score >= 70) return 'text-red-600 bg-red-50';
    if (score >= 40) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  const getRiskLabel = (score: number) => {
    if (score >= 70) return 'High Risk';
    if (score >= 40) return 'Medium Risk';
    return 'Low Risk';
  };

  const getClauseRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'border-red-200 bg-red-50';
      case 'medium': return 'border-yellow-200 bg-yellow-50';
      case 'low': return 'border-green-200 bg-green-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getClauseRiskIcon = (level: string) => {
    switch (level) {
      case 'high': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'medium': return <Info className="w-5 h-5 text-yellow-600" />;
      case 'low': return <CheckCircle className="w-5 h-5 text-green-600" />;
      default: return <Info className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center shadow-lg">
                <Scale className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent">
                  LegalLens
                </h1>
                <p className="text-sm text-gray-600">Smart Contract Analysis</p>
              </div>
            </div>
            
            <nav className="flex space-x-2">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: FileText },
                { id: 'upload', label: 'Upload', icon: Upload },
                { id: 'search', label: 'Legal Q&A', icon: Search }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as any)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                    activeTab === id
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Welcome Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Scale className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Welcome to LegalLens</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  Your AI-powered legal contract analysis platform designed to protect your interests and ensure compliance with Indian legal frameworks
                </p>
              </div>

              {/* Features Grid */}
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-6 rounded-xl bg-blue-50 border border-blue-100">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Risk Analysis</h3>
                  <p className="text-gray-600 text-sm">
                    Advanced AI analyzes every clause to identify potential risks and legal vulnerabilities
                  </p>
                </div>
                
                <div className="text-center p-6 rounded-xl bg-emerald-50 border border-emerald-100">
                  <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Legal Compliance</h3>
                  <p className="text-gray-600 text-sm">
                    Ensures your contracts comply with RERA, Consumer Protection Act, and Indian Contract Act
                  </p>
                </div>
                
                <div className="text-center p-6 rounded-xl bg-purple-50 border border-purple-100">
                  <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Expert Guidance</h3>
                  <p className="text-gray-600 text-sm">
                    Get instant answers to legal questions and contract-specific queries from our AI assistant
                  </p>
                </div>
              </div>

              {/* How to Use */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  <span>How to Use LegalLens</span>
                </h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Upload Contract</h4>
                      <p className="text-sm text-gray-600">Upload your legal document (PDF, DOC, DOCX) using the Upload tab</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Review Analysis</h4>
                      <p className="text-sm text-gray-600">Get detailed clause-by-clause analysis with risk scores and recommendations</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Ask Questions</h4>
                      <p className="text-sm text-gray-600">Use Legal Q&A for specific questions about your contract or Indian laws</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contract Analysis Section */}
            {selectedContract && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{selectedContract.name}</h3>
                      <p className="text-gray-600">{selectedContract.type} • Uploaded {selectedContract.uploadDate}</p>
                    </div>
                    <div className={`px-4 py-2 rounded-full text-sm font-medium ${getRiskColor(selectedContract.riskScore)}`}>
                      {getRiskLabel(selectedContract.riskScore)} ({selectedContract.riskScore}%)
                    </div>
                  </div>

                  {/* Risk Categories */}
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {riskCategories.map((category, index) => (
                      <div key={index} className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900 text-sm">{category.name}</h4>
                          <span className={`text-xs font-medium ${category.color}`}>
                            {category.score}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-1000 ${
                              category.score >= 70 ? 'bg-red-500' :
                              category.score >= 40 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${category.score}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Clause Analysis */}
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-6">Detailed Clause Analysis</h4>
                    <div className="space-y-4">
                      {selectedContract.clauses?.map((clause) => (
                        <div
                          key={clause.id}
                          className={`rounded-xl border-2 p-6 transition-all duration-200 hover:shadow-md ${getClauseRiskColor(clause.riskLevel)}`}
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              {getClauseRiskIcon(clause.riskLevel)}
                              <h5 className="text-lg font-semibold text-gray-900">{clause.title}</h5>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide ${
                              clause.riskLevel === 'high' ? 'bg-red-100 text-red-800' :
                              clause.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {clause.riskLevel} risk
                            </span>
                          </div>
                          
                          <div className="space-y-4">
                            <div>
                              <h6 className="font-medium text-gray-900 mb-2">Clause Content:</h6>
                              <p className="text-gray-700 bg-white p-3 rounded-lg border border-gray-200 italic">
                                "{clause.content}"
                              </p>
                            </div>
                            
                            <div>
                              <h6 className="font-medium text-gray-900 mb-2">Risk Explanation:</h6>
                              <p className="text-gray-700">{clause.explanation}</p>
                            </div>
                            
                            <div>
                              <h6 className="font-medium text-gray-900 mb-2">Recommendation:</h6>
                              <p className="text-gray-700 bg-white p-3 rounded-lg border border-gray-200">
                                {clause.recommendation}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Sample Analysis CTA */}
            {!selectedContract && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Contracts Analyzed Yet</h3>
                <p className="text-gray-600 mb-6">Upload your first contract to see detailed analysis and risk assessment</p>
                <button
                  onClick={() => {
                    setSelectedContract(sampleContract);
                  }}
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  View Sample Analysis
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'upload' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Upload Your Legal Contract</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Upload any legal document and get instant AI-powered risk analysis with actionable insights
              </p>
            </div>

            {/* Upload Area */}
            <div className="max-w-2xl mx-auto">
              <div
                className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
                  isDragging
                    ? 'border-blue-400 bg-blue-50 scale-105'
                    : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Upload className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                  Drop your contract here
                </h3>
                <p className="text-gray-600 mb-8 text-lg">
                  Supports PDF, DOC, DOCX files up to 10MB
                </p>
                <label className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 cursor-pointer shadow-lg shadow-blue-200">
                  <Upload className="w-5 h-5 mr-3" />
                  Choose File
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                  />
                </label>
              </div>
            </div>

            {/* Security Notice */}
            <div className="max-w-2xl mx-auto bg-green-50 border border-green-200 rounded-xl p-6">
              <div className="flex items-start space-x-3">
                <Shield className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-green-900 mb-2">Your Data is Secure</h4>
                  <p className="text-green-800 text-sm">
                    All documents are processed with enterprise-grade encryption. Your contracts are analyzed locally and never stored permanently on our servers.
                  </p>
                </div>
              </div>
            </div>

            {/* Recent Uploads */}
            {contracts.length > 0 && (
              <div className="mt-12">
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">Recent Uploads</h3>
                <div className="grid gap-4">
                  {contracts.map((contract) => (
                    <div
                      key={contract.id}
                      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 cursor-pointer group"
                      onClick={() => {
                        setSelectedContract(contract);
                        setActiveTab('dashboard');
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            <FileText className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                              {contract.name}
                            </h4>
                            <p className="text-sm text-gray-600">{contract.type} • {contract.uploadDate}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          {contract.status === 'analyzing' ? (
                            <div className="flex items-center space-x-2 text-blue-600">
                              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                              <span className="text-sm font-medium">Analyzing...</span>
                            </div>
                          ) : (
                            <div className={`px-4 py-2 rounded-full text-xs font-medium ${getRiskColor(contract.riskScore)}`}>
                              {getRiskLabel(contract.riskScore)} ({contract.riskScore}%)
                            </div>
                          )}
                          <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'search' && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Legal Q&A Assistant</h2>
              <p className="text-xl text-gray-600">
                Ask questions about your contract or Indian legal regulations and get expert guidance
              </p>
            </div>

            {/* Chat Interface */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Chat Messages */}
              <div className="h-96 overflow-y-auto p-6 space-y-4">
                {chatMessages.length === 0 ? (
                  <div className="text-center py-12">
                    <Bot className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Start a Conversation</h3>
                    <p className="text-gray-600">Ask any question about contracts, Indian laws, or legal regulations</p>
                  </div>
                ) : (
                  <>
                    {chatMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-3xl ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                          <div className={`flex items-start space-x-3 ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                              message.type === 'user' ? 'bg-blue-600' : 'bg-gray-600'
                            }`}>
                              {message.type === 'user' ? (
                                <Users className="w-4 h-4 text-white" />
                              ) : (
                                <Bot className="w-4 h-4 text-white" />
                              )}
                            </div>
                            <div className={`rounded-2xl px-4 py-3 ${
                              message.type === 'user' 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-gray-100 text-gray-900'
                            }`}>
                              <p className="text-sm leading-relaxed">{message.content}</p>
                              <p className={`text-xs mt-2 ${
                                message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                              }`}>
                                {message.timestamp}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <Bot className="w-4 h-4 text-white" />
                          </div>
                          <div className="bg-gray-100 rounded-2xl px-4 py-3">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Chat Input */}
              <div className="border-t border-gray-200 p-4">
                <div className="flex space-x-4">
                  <input
                    type="text"
                    placeholder="Ask about contract clauses, RERA regulations, Indian property laws..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!searchQuery.trim() || isTyping}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Sample Questions */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                  <span>Contract Questions</span>
                </h3>
                {[
                  'What are the penalty clauses in my agreement?',
                  'Is the possession date clause fair?',
                  'What are my cancellation rights?',
                  'Are there any hidden charges?'
                ].map((question, index) => (
                  <button
                    key={index}
                    onClick={() => setSearchQuery(question)}
                    className="text-left w-full p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-gray-700 border border-gray-200 hover:border-gray-300"
                  >
                    {question}
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                  <BookOpen className="w-5 h-5 text-emerald-600" />
                  <span>Legal Regulations</span>
                </h3>
                {[
                  'What is RERA and how does it protect buyers?',
                  'Indian Contract Act provisions for property deals',
                  'Stamp duty and registration requirements',
                  'Consumer protection laws for real estate'
                ].map((question, index) => (
                  <button
                    key={index}
                    onClick={() => setSearchQuery(question)}
                    className="text-left w-full p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-gray-700 border border-gray-200 hover:border-gray-300"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;