import React from 'react';

interface ChartProps {
  data: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
    }>;
  };
}

const Chart: React.FC<ChartProps> = ({ data }) => {
  const maxValue = Math.max(...data.datasets[0].data);
  const minValue = Math.min(...data.datasets[0].data);
  const range = maxValue - minValue;

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="h-64 flex items-end justify-between space-x-2">
        {data.labels.map((label, index) => {
          const value = data.datasets[0].data[index];
          const height = ((value - minValue) / range) * 200 + 20;
          
          return (
            <div key={index} className="flex flex-col items-center flex-1">
              <div className="relative group">
                <div
                  className="bg-blue-600 rounded-t-md transition-all duration-300 hover:bg-blue-700 w-full"
                  style={{ height: `${height}px` }}
                ></div>
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  {value}
                </div>
              </div>
              <span className="text-xs text-gray-600 mt-2">{label}</span>
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-600 rounded"></div>
          <span className="text-sm text-gray-700">{data.datasets[0].label}</span>
        </div>
      </div>
    </div>
  );
};

export default Chart;