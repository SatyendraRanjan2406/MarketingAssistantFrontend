interface ListBlockProps {
  style: 'dotted' | 'numbered' | 'bulleted';
  title?: string;
  items: string[];
}

export const ListBlock: React.FC<ListBlockProps> = ({ style, title, items }) => {
  const renderList = () => {
    switch (style) {
      case 'numbered':
        return (
          <ol className="list-decimal list-inside space-y-1">
            {items.map((item, index) => (
              <li key={index} className="text-gray-700">{item}</li>
            ))}
          </ol>
        );
      case 'bulleted':
        return (
          <ul className="list-disc list-inside space-y-1">
            {items.map((item, index) => (
              <li key={index} className="text-gray-700">{item}</li>
            ))}
          </ul>
        );
      default: // dotted
        return (
          <div className="space-y-2">
            {items.map((item, index) => (
              <div key={index} className="flex items-start">
                <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-lg border p-4">
      {title && (
        <h3 className="font-semibold text-gray-800 mb-3">{title}</h3>
      )}
      {renderList()}
    </div>
  );
};
