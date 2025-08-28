interface MetricBlockProps {
  title: string;
  value: string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
}

export const MetricBlock: React.FC<MetricBlockProps> = ({ title, value, change, trend }) => {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return '↗️';
      case 'down':
        return '↘️';
      case 'neutral':
        return '→';
      default:
        return null;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      case 'neutral':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-lg border p-4">
      <div className="text-center">
        <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
        <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
        {change && (
          <div className={`text-sm ${getTrendColor()}`}>
            {getTrendIcon()} {change}
          </div>
        )}
      </div>
    </div>
  );
};
