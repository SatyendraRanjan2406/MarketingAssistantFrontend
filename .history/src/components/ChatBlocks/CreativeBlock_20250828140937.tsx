import React from 'react';

interface CreativeBlockProps {
  title: string;
  description: string;
  template_type: string;
  features: string[];
  advantages: string[];
  cta_suggestions: string[];
  color_scheme: string;
  target_audience: string;
  image_url?: string;
}

export const CreativeBlock: React.FC<CreativeBlockProps> = ({
  title,
  description,
  template_type,
  features,
  advantages,
  cta_suggestions,
  color_scheme,
  target_audience,
  image_url
}) => {
  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6 mb-4">
      <div className="flex items-start space-x-6">
        {/* Left side - Content */}
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-purple-100 p-2 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-purple-900">{title}</h3>
              <p className="text-purple-700 text-sm">{description}</p>
            </div>
          </div>

          {/* Template Type Badge */}
          <div className="mb-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
              {template_type} Template
            </span>
          </div>

          {/* Features */}
          <div className="mb-4">
            <h4 className="font-semibold text-purple-900 mb-2">Visual Elements</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span className="text-sm text-purple-800">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Advantages */}
          <div className="mb-4">
            <h4 className="font-semibold text-purple-900 mb-2">Color Schemes</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {advantages.map((advantage, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-sm text-purple-800">{advantage}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Suggestions */}
          <div className="mb-4">
            <h4 className="font-semibold text-purple-900 mb-2">Call-to-Action Suggestions</h4>
            <div className="flex flex-wrap gap-2">
              {cta_suggestions.map((cta, index) => (
                <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
                  {cta}
                </span>
              ))}
            </div>
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-purple-900">Color Scheme:</span>
              <span className="ml-2 text-purple-700">{color_scheme}</span>
            </div>
            <div>
              <span className="font-medium text-purple-900">Target Audience:</span>
              <span className="ml-2 text-purple-700">{target_audience}</span>
            </div>
          </div>
        </div>

        {/* Right side - Image */}
        {image_url && (
          <div className="flex-shrink-0">
            <div className="w-48 h-48 rounded-lg overflow-hidden border-2 border-purple-200 shadow-lg">
              <img 
                src={image_url} 
                alt="Creative suggestion" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.parentElement!.innerHTML = '<div class="w-full h-full bg-purple-100 flex items-center justify-center text-purple-600 text-sm">Image not available</div>';
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
