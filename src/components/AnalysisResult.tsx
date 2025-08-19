import React from 'react';
import { TrendingUp, AlertTriangle, Zap, BarChart3, Table } from 'lucide-react';
import { Platform } from '../types';
import Chart from './Chart';
import DataTable from './DataTable';

interface AnalysisResultProps {
  analysis: any;
  platform: Platform;
  onTakeAction: (action: any) => void;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ analysis, platform, onTakeAction }) => {
  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'ROAS',
        data: [2.3, 2.8, 3.1, 2.9, 3.4, 3.8, 4.2],
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)'
      }
    ]
  };

  const tableData = [
    { campaign: 'Summer Sale 2024', spend: '$1,250', roas: '4.2x', ctr: '3.4%', status: 'Active' },
    { campaign: 'Brand Awareness', spend: '$890', roas: '2.1x', ctr: '2.8%', status: 'Active' },
    { campaign: 'Product Launch', spend: '$2,100', roas: '5.8x', ctr: '4.1%', status: 'Active' }
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 max-w-4xl shadow-sm">
      {/* Key Takeaways */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 text-blue-600 mr-2" />
          Key Takeaways
        </h3>
        <div className="space-y-3">
          {analysis.keyTakeaways.map((takeaway: string, index: number) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <p className="text-gray-700 flex-1">{takeaway}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Charts */}
      {analysis.charts && (
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
            <BarChart3 className="w-4 h-4 text-green-600 mr-2" />
            Performance Trends
          </h4>
          <Chart data={chartData} />
        </div>
      )}

      {/* Data Table */}
      {analysis.tables && (
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
            <Table className="w-4 h-4 text-purple-600 mr-2" />
            Campaign Performance
          </h4>
          <DataTable data={tableData} />
        </div>
      )}

      {/* Recommendations */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Zap className="w-5 h-5 text-orange-600 mr-2" />
          Recommendations & Actions
        </h3>
        <div className="space-y-4">
          {analysis.recommendations.map((rec: any, index: number) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-semibold text-gray-900">{rec.title}</h4>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      rec.priority === 'high' 
                        ? 'bg-red-100 text-red-800' 
                        : rec.priority === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {rec.priority.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-2">{rec.description}</p>
                  <p className="text-sm text-green-600 font-medium">{rec.impact}</p>
                </div>
                <button
                  onClick={() => onTakeAction(rec)}
                  className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Zap className="w-4 h-4" />
                  <span>Take Action</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalysisResult;