interface ActionBlockProps {
  title?: string;
  items: Array<{ id: string; label: string }>;
}

export const ActionBlock: React.FC<ActionBlockProps> = ({ title, items }) => {
  const handleAction = (actionId: string) => {
    // Handle different actions
    switch (actionId) {
      case 'connect_accounts':
        console.log('Connecting accounts...');
        break;
      case 'create_campaign':
        console.log('Creating campaign...');
        break;
      default:
        console.log('Action:', actionId);
    }
  };

  return (
    <div className="bg-white rounded-lg border p-4">
      {title && (
        <h3 className="font-semibold text-gray-800 mb-3">{title}</h3>
      )}
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => handleAction(item.id)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};
