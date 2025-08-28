import React from 'react';
import { 
  TextBlock, 
  TableBlock, 
  ListBlock, 
  ActionBlock, 
  ChartBlock, 
  MetricBlock 
} from './ChatBlocks';

interface AnalysisBlockProps {
  type: string;
  content: any;
  metadata?: any;
  title?: string;
  account?: any;
  timestamp?: string;
}

const AnalysisBlock: React.FC<AnalysisBlockProps> = ({ 
  type, 
  content, 
  metadata, 
  title, 
  account, 
  timestamp 
}) => {
  const renderUIBlock = (uiBlock: any) => {
    switch (uiBlock.type) {
      case 'text':
        return <TextBlock {...uiBlock} />;
      case 'table':
        return <TableBlock {...uiBlock} />;
      case 'list':
        return <ListBlock {...uiBlock} />;
      case 'actions':
        return <ActionBlock {...uiBlock} />;
      case 'chart':
        return <ChartBlock {...uiBlock} />;
      case 'metric':
        return <MetricBlock {...uiBlock} />;
      default:
        return <div>Unsupported UI block type: {uiBlock.type}</div>;
    }
  };

  switch (type) {
    case 'rag_enhanced':
      return (
        <div className="rag-content">
          {content.blocks?.map((uiBlock: any, index: number) => (
            <div key={index} className="mb-4">
              {renderUIBlock(uiBlock)}
            </div>
          ))}
          {metadata && (
            <div className="rag-metadata mt-3 p-2 bg-gray-100 rounded text-xs">
              <strong>Context Used:</strong> {metadata.context_used ? 'Yes' : 'No'}
              <br />
              <strong>Selection Reason:</strong> {metadata.selection_reason}
              {metadata.context_sources && (
                <>
                  <br />
                  <strong>Sources:</strong> {metadata.context_sources.join(', ')}
                </>
              )}
            </div>
          )}
        </div>
      );
    
    case 'budget_optimizations':
      return (
        <div className="bg-white rounded-lg border p-4">
          <h3 className="font-semibold text-gray-800 mb-3">Budget Optimization Recommendations</h3>
          <div className="text-gray-700">{content.content || 'Budget optimization analysis will appear here.'}</div>
        </div>
      );
    
    case 'campaign_consistency_analysis':
      return (
        <div className="bg-white rounded-lg border p-4">
          <h3 className="font-semibold text-gray-800 mb-3">Campaign Consistency Analysis</h3>
          <div className="text-gray-700">{content.content || 'Campaign consistency analysis will appear here.'}</div>
        </div>
      );
    
    case 'sitelink_analysis':
      return (
        <div className="bg-white rounded-lg border p-4">
          <h3 className="font-semibold text-gray-800 mb-3">Sitelink Analysis</h3>
          <div className="text-gray-700">{content.content || 'Sitelink analysis will appear here.'}</div>
        </div>
      );
    
    case 'landing_page_analysis':
      return (
        <div className="bg-white rounded-lg border p-4">
          <h3 className="font-semibold text-gray-800 mb-3">Landing Page Analysis</h3>
          <div className="text-gray-700">{content.content || 'Landing page analysis will appear here.'}</div>
        </div>
      );
    
    case 'duplicate_keyword_analysis':
      return (
        <div className="bg-white rounded-lg border p-4">
          <h3 className="font-semibold text-gray-800 mb-3">Duplicate Keyword Analysis</h3>
          <div className="text-gray-700">{content.content || 'Duplicate keyword analysis will appear here.'}</div>
        </div>
      );
    
    case 'keyword_trends_analysis':
      return (
        <div className="bg-white rounded-lg border p-4">
          <h3 className="font-semibold text-gray-800 mb-3">Keyword Trends Analysis</h3>
          <div className="text-gray-700">{content.content || 'Keyword trends analysis will appear here.'}</div>
        </div>
      );
    
    case 'auction_insights_analysis':
      return (
        <div className="bg-white rounded-lg border p-4">
          <h3 className="font-semibold text-gray-800 mb-3">Auction Insights Analysis</h3>
          <div className="text-gray-700">{content.content || 'Auction insights analysis will appear here.'}</div>
        </div>
      );
    
    case 'search_term_analysis':
      return (
        <div className="bg-white rounded-lg border p-4">
          <h3 className="font-semibold text-gray-800 mb-3">Search Term Analysis</h3>
          <div className="text-gray-700">{content.content || 'Search term analysis will appear here.'}</div>
        </div>
      );
    
    case 'ads_showing_time_analysis':
      return (
        <div className="bg-white rounded-lg border p-4">
          <h3 className="font-semibold text-gray-800 mb-3">Ads Showing Time Analysis</h3>
          <div className="text-gray-700">{content.content || 'Ads showing time analysis will appear here.'}</div>
        </div>
      );
    
    case 'device_performance_detailed_analysis':
      return (
        <div className="bg-white rounded-lg border p-4">
          <h3 className="font-semibold text-gray-800 mb-3">Device Performance Analysis</h3>
          <div className="text-gray-700">{content.content || 'Device performance analysis will appear here.'}</div>
        </div>
      );
    
    case 'location_performance_analysis':
      return (
        <div className="bg-white rounded-lg border p-4">
          <h3 className="font-semibold text-gray-800 mb-3">Location Performance Analysis</h3>
          <div className="text-gray-700">{content.content || 'Location performance analysis will appear here.'}</div>
        </div>
      );
    
    case 'landing_page_mobile_analysis':
      return (
        <div className="bg-white rounded-lg border p-4">
          <h3 className="font-semibold text-gray-800 mb-3">Mobile Landing Page Analysis</h3>
          <div className="text-gray-700">{content.content || 'Mobile landing page analysis will appear here.'}</div>
        </div>
      );
    
    case 'tcpa_optimizations':
      return (
        <div className="bg-white rounded-lg border p-4">
          <h3 className="font-semibold text-gray-800 mb-3">TCPA Optimization Recommendations</h3>
          <div className="text-gray-700">{content.content || 'TCPA optimization recommendations will appear here.'}</div>
        </div>
      );
    
    case 'budget_allocation_optimizations':
      return (
        <div className="bg-white rounded-lg border p-4">
          <h3 className="font-semibold text-gray-800 mb-3">Budget Allocation Optimization</h3>
          <div className="text-gray-700">{content.content || 'Budget allocation optimization will appear here.'}</div>
        </div>
      );
    
    case 'negative_keyword_suggestions':
      return (
        <div className="bg-white rounded-lg border p-4">
          <h3 className="font-semibold text-gray-800 mb-3">Negative Keyword Suggestions</h3>
          <div className="text-gray-700">{content.content || 'Negative keyword suggestions will appear here.'}</div>
        </div>
      );
    
    default:
      return (
        <div className="bg-white rounded-lg border p-4">
          <h3 className="font-semibold text-gray-800 mb-3">{title || 'Analysis'}</h3>
          <div className="text-gray-700">{content.content || 'Analysis content will appear here.'}</div>
        </div>
      );
  }
};

export default AnalysisBlock;

