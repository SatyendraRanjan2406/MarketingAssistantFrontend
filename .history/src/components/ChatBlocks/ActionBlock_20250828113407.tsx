interface ActionBlockProps {
  title?: string;
  items: Array<{ id: string; label: string }>;
}

export const ActionBlock: React.FC<ActionBlockProps> = ({ title, items }) => {
  // Ensure items is always an array
  const safeItems = Array.isArray(items) ? items : [];
  
  const handleAction = (actionId: string) => {
    // Handle different actions
    switch (actionId) {
      case 'connect_accounts':
        console.log('Connecting accounts...');
        break;
      case 'create_campaign':
        console.log('Creating campaign...');
        break;
      case 'optimize_campaign':
        console.log('Optimizing campaign...');
        break;
      case 'check_campaign_consistency':
        console.log('Checking campaign consistency...');
        break;
      case 'check_sitelinks':
        console.log('Checking sitelinks...');
        break;
      case 'check_landing_page_url':
        console.log('Checking landing page URL...');
        break;
      case 'check_duplicate_keywords':
        console.log('Checking duplicate keywords...');
        break;
      case 'analyze_keyword_trends':
        console.log('Analyzing keyword trends...');
        break;
      case 'analyze_auction_insights':
        console.log('Analyzing auction insights...');
        break;
      case 'analyze_search_terms':
        console.log('Analyzing search terms...');
        break;
      case 'analyze_ads_showing_time':
        console.log('Analyzing ads showing time...');
        break;
      case 'analyze_device_performance_detailed':
        console.log('Analyzing device performance...');
        break;
      case 'analyze_location_performance':
        console.log('Analyzing location performance...');
        break;
      case 'analyze_landing_page_mobile':
        console.log('Analyzing mobile landing page...');
        break;
      case 'optimize_tcpa':
        console.log('Optimizing TCPA...');
        break;
      case 'optimize_budget_allocation':
        console.log('Optimizing budget allocation...');
        break;
      case 'suggest_negative_keywords':
        console.log('Suggesting negative keywords...');
        break;
      case 'action1':
        console.log('Create New Campaigns action...');
        break;
      case 'action2':
        console.log('Optimize Ad Creatives action...');
        break;
      case 'action3':
        console.log('Set Up Conversion Tracking action...');
        break;
      default:
        console.log('Action:', actionId);
    }
  };

  return (
    <div className="bg-white rounded-lg border p-4">
      {title && (
        <h3 className="font-semibold text-gray-800 mb-3">{title}</h3>
      )}
      {safeItems.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {safeItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleAction(item.id)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {item.label}
            </button>
          ))}
        </div>
      ) : (
        <div className="text-gray-500 text-sm">No actions available</div>
      )}
    </div>
  );
};
