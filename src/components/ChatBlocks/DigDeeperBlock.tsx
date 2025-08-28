import React from 'react';

interface DigDeeperBlockProps {
  title: string;
  description: string;
  action_id: string;
  current_depth: number;
  max_depth: number;
  onDigDeeper: (actionId: string, currentDepth: number) => void;
}

export const DigDeeperBlock: React.FC<DigDeeperBlockProps> = ({
  title,
  description,
  action_id,
  current_depth,
  max_depth,
  onDigDeeper
}) => {
  const isMaxDepthReached = current_depth >= max_depth;
  const remainingDepth = max_depth - current_depth;

  return (
    <div className="dig-deeper-block bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 mb-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="text-lg font-semibold text-blue-900 mb-2">{title}</h4>
          <p className="text-blue-700 mb-4">{description}</p>
          
          {/* Depth indicator */}
          <div className="flex items-center space-x-2 mb-4">
            <div className="flex space-x-1">
              {Array.from({ length: max_depth }, (_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    index < current_depth 
                      ? 'bg-blue-500' 
                      : 'bg-blue-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-blue-600 font-medium">
              Level {current_depth} of {max_depth}
            </span>
          </div>
        </div>
        
        <div className="ml-4">
          <button
            onClick={() => onDigDeeper(action_id, current_depth)}
            disabled={isMaxDepthReached}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              isMaxDepthReached
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg transform hover:scale-105'
            }`}
          >
            {isMaxDepthReached ? (
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Max Depth Reached
              </span>
            ) : (
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd" />
                </svg>
                Dig Deeper
                {remainingDepth > 1 && (
                  <span className="ml-2 text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded-full">
                    +{remainingDepth} levels available
                  </span>
                )}
              </span>
            )}
          </button>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="mt-4">
        <div className="w-full bg-blue-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(current_depth / max_depth) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};
