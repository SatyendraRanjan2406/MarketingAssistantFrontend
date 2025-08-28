interface TableBlockProps {
  title: string;
  columns: string[];
  rows: any[][];
  sortable: boolean;
}

export const TableBlock: React.FC<TableBlockProps> = ({ title, columns, rows, sortable }) => {
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
                    {cell}
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
