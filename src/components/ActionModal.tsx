import React, { useState } from 'react';
import { X, AlertTriangle, CheckCircle, Clock, DollarSign } from 'lucide-react';
import { Platform } from '../types';

interface ActionModalProps {
  action: any;
  platform: Platform;
  onClose: () => void;
  onConfirm: () => void;
}

const ActionModal: React.FC<ActionModalProps> = ({ action, platform, onClose, onConfirm }) => {
  const [isConfirming, setIsConfirming] = useState(false);

  const handleConfirm = async () => {
    setIsConfirming(true);
    // Simulate API call
    setTimeout(() => {
      setIsConfirming(false);
      onConfirm();
    }, 2000);
  };

  const changes = [
    {
      entity: 'Summer Sale Campaign',
      current: '$1,000/day',
      proposed: '$1,500/day',
      impact: '+25% reach',
      risk: 'Low'
    },
    {
      entity: 'Brand Awareness Ad Set',
      current: '$500/day',
      proposed: '$200/day',
      impact: '-60% spend',
      risk: 'Medium'
    },
    {
      entity: 'Product Launch Campaign',
      current: '$800/day',
      proposed: '$1,300/day',
      impact: '+40% conversions',
      risk: 'Low'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Action Implementation</h2>
            <p className="text-gray-600">{action?.title}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Summary */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Change Summary</h3>
            <p className="text-blue-800">{action?.description}</p>
            <div className="mt-3 flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span className="text-green-800 font-medium">{action?.impact}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4 text-gray-600" />
                <span className="text-gray-700">Implements immediately</span>
              </div>
            </div>
          </div>

          {/* Changes Table */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Detailed Changes</h3>
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Entity</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Current</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Proposed</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Expected Impact</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Risk Level</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {changes.map((change, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{change.entity}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{change.current}</td>
                      <td className="px-4 py-3 text-sm font-medium text-blue-600">{change.proposed}</td>
                      <td className="px-4 py-3 text-sm text-green-600">{change.impact}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          change.risk === 'Low' 
                            ? 'bg-green-100 text-green-800'
                            : change.risk === 'Medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {change.risk}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Warnings */}
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-yellow-900">Important Notes</h4>
                <ul className="mt-2 text-sm text-yellow-800 space-y-1">
                  <li>• Changes will be implemented immediately and cannot be undone automatically</li>
                  <li>• Budget changes may affect daily spend limits</li>
                  <li>• Performance data will be available within 2-4 hours</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Rollback Options */}
          <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-gray-900">Rollback Available</h4>
                <p className="mt-1 text-sm text-gray-700">
                  You can revert these changes within 24 hours using the implementation history dashboard.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isConfirming}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center space-x-2"
          >
            {isConfirming && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
            <span>{isConfirming ? 'Implementing...' : 'Confirm & Publish Changes'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActionModal;