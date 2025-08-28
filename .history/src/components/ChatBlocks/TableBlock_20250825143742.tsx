interface TableBlockProps {
  title: string;
  columns: string[];
  rows: any[][];
  sortable: boolean;
}

export const TableBlock: React.FC<TableBlockProps> = ({ title, columns, rows, sortable }) => {
  // Helper function to check if content is HTML
  const isHtmlContent = (content: any): boolean => {
    if (typeof content === 'string') {
      return content.includes('<') && content.includes('>');
    }
    return false;
  };

  // Helper function to safely render cell content
  const renderCellContent = (cell: any) => {
    if (isHtmlContent(cell)) {
      // For HTML content (like images), render it safely
      return <div dangerouslySetInnerHTML={{ __html: cell }} />;
    }
    // For regular text content, render as is
    return cell;
  };

  return (
    <div className="bg-white rounded-lg border overflow-hidden">
      {title && (
        <div className="bg-gray-50 px-4 py-3 border-b">
          <h3 className="font-semibold text-gray-800">{title}</h3>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50">
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {renderCellContent(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

