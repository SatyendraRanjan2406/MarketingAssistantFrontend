interface ChartBlockProps {
  chart_type: 'pie' | 'bar' | 'line';
  title: string;
  labels: string[];
  datasets: Array<{ label: string; data: number[]; backgroundColor?: string[] }>;
  options?: any;
}

export const ChartBlock: React.FC<ChartBlockProps> = ({ chart_type, title, labels, datasets, options }) => {
  // Ensure we have valid data
  const safeLabels = Array.isArray(labels) ? labels : [];
  const safeDatasets = Array.isArray(datasets) && datasets.length > 0 ? datasets : [{ label: 'Data', data: [] }];
  const data = safeDatasets[0]?.data || [];
  
  // For now, we'll create a simple chart representation
  // In a real implementation, you'd use Chart.js or similar library
  
  const renderSimpleChart = () => {
    switch (chart_type) {
      case 'pie':
        return (
          <div className="flex items-center justify-center space-x-4 flex-wrap">
            {safeLabels.map((label, index) => (
              <div key={index} className="text-center m-2">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold"
                  style={{ 
                    backgroundColor: safeDatasets[0]?.backgroundColor?.[index] || '#3b82f6',
                    minWidth: '64px'
                  }}
                >
                  {data[index] || 0}
                </div>
                <div className="text-sm text-gray-600 mt-2 max-w-20 text-center">{label}</div>
              </div>
            ))}
          </div>
        );
      case 'bar':
        return (
          <div className="space-y-3">
            {safeLabels.map((label, index) => {
              const value = data[index] || 0;
              const maxValue = Math.max(...data, 1); // Prevent division by zero
              const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
              
              return (
                <div key={index} className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600 w-24 flex-shrink-0">{label}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-6">
                    <div 
                      className="bg-blue-500 h-6 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium w-16 text-right">{value}</span>
                </div>
              );
            })}
          </div>
        );
      case 'line':
        return (
          <div className="text-center py-8">
            <div className="text-gray-500">Line chart visualization</div>
            <div className="text-sm text-gray-400 mt-2">
              {safeLabels.join(' → ')}: {data.join(', ')}
            </div>
          </div>
        );
      default:
        return <div>Unsupported chart type: {chart_type}</div>;
    }
  };

  return (
    <div className="bg-white rounded-lg border p-4">
      <h3 className="font-semibold text-gray-800 mb-4 text-center">{title}</h3>
      <div className="w-full">
        {safeLabels.length > 0 && data.length > 0 ? (
          renderSimpleChart()
        ) : (
          <div className="text-center py-8 text-gray-500">
            No data available for chart
          </div>
        )}
      </div>
    </div>
  );
};

