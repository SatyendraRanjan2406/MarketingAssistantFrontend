interface TextBlockProps {
  content: string;
  style: 'paragraph' | 'heading' | 'highlight';
}

export const TextBlock: React.FC<TextBlockProps> = ({ content, style }) => {
  const getStyleClasses = () => {
    switch (style) {
      case 'heading':
        return 'text-xl font-bold text-gray-800 mb-3';
      case 'highlight':
        return 'text-sm bg-yellow-100 p-3 rounded-lg border-l-4 border-yellow-400 my-3 font-medium';
      default:
        return 'text-gray-700 leading-relaxed mb-2';
    }
  };

  return (
    <div className={`${getStyleClasses()} ${style === 'heading' ? 'bg-white rounded-lg p-3 border border-gray-200' : ''}`}>
      {content}
    </div>
  );
};

