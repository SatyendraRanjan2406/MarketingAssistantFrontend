import React from 'react';

interface WorkflowStep {
  step: string;
  action: string;
}

interface WorkflowBlockProps {
  title: string;
  steps: WorkflowStep[];
  tools: string[];
  tips: string[];
}

export const WorkflowBlock: React.FC<WorkflowBlockProps> = ({
  title,
  steps,
  tools,
  tips
}) => {
  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6 mb-4">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-green-100 p-2 rounded-lg">
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-green-900">{title}</h3>
      </div>

      {/* Implementation Steps */}
      <div className="mb-6">
        <h4 className="font-semibold text-green-900 mb-3 text-lg">Implementation Steps</h4>
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={index} className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  {step.step}
                </div>
              </div>
              <div className="flex-1">
                <p className="text-green-800">{step.action}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tools and Tips in a grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tools */}
        <div>
          <h4 className="font-semibold text-green-900 mb-3">Required Tools</h4>
          <div className="space-y-2">
            {tools.map((tool, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-green-800">{tool}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div>
          <h4 className="font-semibold text-green-900 mb-3">Pro Tips</h4>
          <div className="space-y-2">
            {tips.map((tip, index) => (
              <div key={index} className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-green-800 text-sm">{tip}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="mt-6 pt-4 border-t border-green-200">
        <div className="flex items-center justify-between text-sm text-green-700">
          <span>Ready to implement?</span>
          <div className="flex space-x-1">
            {steps.map((_, index) => (
              <div
                key={index}
                className="w-2 h-2 bg-green-300 rounded-full"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
