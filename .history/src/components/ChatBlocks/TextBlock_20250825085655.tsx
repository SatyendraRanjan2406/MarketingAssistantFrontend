interface TextBlockProps {
  content: string;
  style: 'paragraph' | 'heading' | 'highlight';
}

export const TextBlock: React.FC<TextBlockProps> = ({ content, style }) => {
  const getStyleClasses = () => {
    switch (style) {
      case 'heading':
        return 'text-xl font-bold text-gray-800';
      case 'highlight':
        return 'text-sm bg-yellow-100 p-2 rounded border-l-4 border-yellow-400';
      default:
        return 'text-gray-700 leading-relaxed';
    }
  };

  return (
    <div className={getStyleClasses()}>
      {content}
    </div>
  );
};
