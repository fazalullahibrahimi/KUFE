import React from "react";

const Table = ({ columns, data, actions, onEdit, onDelete, onView }) => {
  return (
    <div className='bg-white rounded-lg shadow overflow-hidden'>
      <div className='overflow-x-auto'>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-gray-50'>
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                >
                  {column.header}
                </th>
              ))}
              {actions && (
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className='hover:bg-gray-50'>
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'
                  >
                    {column.render ? column.render(row) : row[column.accessor]}
                  </td>
                ))}
                {actions && (
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    <div className='flex space-x-2'>
                      {onView && (
                        <button
                          className='text-blue-600 hover:text-blue-900'
                          onClick={() => onView(row)}
                        >
                          View
                        </button>
                      )}
                      {onEdit && (
                        <button
                          className='text-green-600 hover:text-green-900'
                          onClick={() => onEdit(row)}
                        >
                          Edit
                        </button>
                      )}
                      {onDelete && (
                        <button
                          className='text-red-600 hover:text-red-900'
                          onClick={() => onDelete(row)}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
