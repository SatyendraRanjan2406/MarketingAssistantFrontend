interface ChartBlockProps {
  chart_type: 'pie' | 'bar' | 'line';
  title: string;
  labels: string[];
  datasets: Array<{ label: string; data: number[]; backgroundColor?: string[] }>;
  options?: any;
}

export const ChartBlock: React.FC<ChartBlockProps> = ({ chart_type, title, labels, datasets, options }) => {
  // For now, we'll create a simple chart representation
  // In a real implementation, you'd use Chart.js or similar library
  
  const renderSimpleChart = () => {
    switch (chart_type) {
      case 'pie':
        return (
          <div className="flex items-center justify-center space-x-4">
            {labels.map((label, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                  {datasets[0]?.data[index] || 0}
                </div>
                <div className="text-sm text-gray-600 mt-2">{label}</div>
              </div>
            ))}
          </div>
        );
      case 'bar':
        return (
          <div className="space-y-2">
            {labels.map((label, index) => (
              <div key={index} className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 w-20">{label}</span>
                <div className="flex-1 bg-gray-200 rounded-full h-4">
                  <div 
                    className="bg-blue-500 h-4 rounded-full"
                    style={{ width: `${(datasets[0]?.data[index] || 0)}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{datasets[0]?.data[index] || 0}</span>
              </div>
            ))}
          </div>
        );
      case 'line':
        return (
          <div className="text-center py-8">
            <div className="text-gray-500">Line chart visualization</div>
            <div className="text-sm text-gray-400 mt-2">
              {labels.join(' → ')}: {datasets[0]?.data.join(', ')}
            </div>
          </div>
        );
      default:
        return <div>Unsupported chart type</div>;
    }
  };

  return (
    <div className="bg-white rounded-lg border p-4">
      <h3 className="font-semibold text-gray-800 mb-4 text-center">{title}</h3>
      <div className="w-full">
        {renderSimpleChart()}
      </div>
    </div>
  );
};
