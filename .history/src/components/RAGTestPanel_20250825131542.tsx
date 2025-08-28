import React, { useState } from 'react';

interface RAGTestPanelProps {
  className?: string;
}

const RAGTestPanel: React.FC<RAGTestPanelProps> = ({ className = '' }) => {
  const [testQuery, setTestQuery] = useState('');
  const [testResults, setTestResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const testQueries = [
    "What are Google Ads best practices for campaign optimization?",
    "How should I structure my ad groups for better performance?",
    "What bidding strategies work best for e-commerce campaigns?",
    "How can I improve my Quality Score?",
    "What are the latest Google Ads features and updates?"
  ];

  const handleTestQuery = async (query: string) => {
    setTestQuery(query);
    setIsLoading(true);
    
    // Simulate RAG response for testing
    setTimeout(() => {
      const mockRAGResponse = {
        response_type: 'rag',
        blocks: [
          {
            type: 'text',
            content: `RAG-enhanced response for: "${query}"`,
            style: 'heading'
          },
          {
            type: 'text',
            content: 'This response was generated using our knowledge base combined with AI analysis.',
            style: 'paragraph'
          }
        ],
        rag_metadata: {
          context_used: true,
          context_sources: ['google_ads_best_practices.md', 'campaign_optimization_guide.md'],
          selection_reason: 'Query matched knowledge base content for Google Ads optimization'
        }
      };
      
      setTestResults(mockRAGResponse);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">RAG Testing Panel</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="font-medium text-gray-700 mb-2">Test Queries</h3>
          <div className="space-y-2">
            {testQueries.map((query, index) => (
              <button
                key={index}
                onClick={() => handleTestQuery(query)}
                className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-700 transition-colors"
              >
                {query}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-medium text-gray-700 mb-2">Current Query</h3>
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              {testQuery || 'No query selected'}
            </p>
          </div>
        </div>

        <div>
          <h3 className="font-medium text-gray-700 mb-2">RAG Response</h3>
          {isLoading ? (
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm text-gray-600">Generating RAG response...</span>
              </div>
            </div>
          ) : testResults ? (
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="mb-3">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  RAG Enhanced
                </span>
                <span className="ml-2 text-sm text-purple-600">
                  {testResults.response_type === 'rag' ? 'Knowledge Base + AI' : 'Direct AI'}
                </span>
              </div>
              
              <div className="space-y-2">
                {testResults.blocks?.map((block: any, index: number) => (
                  <div key={index} className="text-sm text-gray-700">
                    <strong>{block.style === 'heading' ? 'Heading: ' : ''}</strong>
                    {block.content}
                  </div>
                ))}
              </div>
              
              {testResults.rag_metadata && (
                <div className="mt-3 p-2 bg-gray-100 rounded text-xs">
                  <strong>Context Used:</strong> {testResults.rag_metadata.context_used ? 'Yes' : 'No'}
                  <br />
                  <strong>Selection Reason:</strong> {testResults.rag_metadata.selection_reason}
                  {testResults.rag_metadata.context_sources && (
                    <>
                      <br />
                      <strong>Sources:</strong> {testResults.rag_metadata.context_sources.join(', ')}
                    </>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 bg-gray-50 rounded-lg text-sm text-gray-500">
              Select a test query to see RAG response
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-gray-200">
          <h3 className="font-medium text-gray-700 mb-2">RAG Features</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Knowledge base integration</li>
            <li>• Context-aware responses</li>
            <li>• Source attribution</li>
            <li>• Selection reasoning</li>
            <li>• Enhanced accuracy</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RAGTestPanel;
