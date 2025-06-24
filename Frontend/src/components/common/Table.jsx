import React from "react";
import { useLanguage } from "../../contexts/LanguageContext";

const Table = ({ columns, data, actions, onEdit, onDelete, onView }) => {
  const { isRTL, t } = useLanguage();

  return (
    <div
      className='bg-white rounded-lg shadow overflow-hidden'
      dir={isRTL ? 'rtl' : 'ltr'}
      style={{ direction: isRTL ? 'rtl' : 'ltr' }}
    >
      <div className='overflow-x-auto'>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-gray-50'>
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className={`px-6 py-3 ${isRTL ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 uppercase tracking-wider`}
                  style={{ textAlign: isRTL ? 'right' : 'left' }}
                >
                  {column.header}
                </th>
              ))}
              {actions && (
                <th
                  className={`px-6 py-3 ${isRTL ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 uppercase tracking-wider`}
                  style={{ textAlign: isRTL ? 'right' : 'left' }}
                >
                  {t ? t("actions") : "Actions"}
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
                    className={`px-6 py-4 whitespace-nowrap text-sm text-gray-500 ${isRTL ? 'text-right' : 'text-left'}`}
                    style={{ textAlign: isRTL ? 'right' : 'left' }}
                  >
                    {column.render ? column.render(row) : row[column.accessor]}
                  </td>
                ))}
                {actions && (
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm text-gray-500 ${isRTL ? 'text-right' : 'text-left'}`}
                    style={{ textAlign: isRTL ? 'right' : 'left' }}
                  >
                    <div className={`flex ${isRTL ? 'space-x-reverse space-x-2 flex-row-reverse' : 'space-x-2'}`}>
                      {onView && (
                        <button
                          className='text-blue-600 hover:text-blue-900 px-2 py-1 rounded transition-colors'
                          onClick={() => onView(row)}
                        >
                          {t ? t("view") : "View"}
                        </button>
                      )}
                      {onEdit && (
                        <button
                          className='text-green-600 hover:text-green-900 px-2 py-1 rounded transition-colors'
                          onClick={() => onEdit(row)}
                        >
                          {t ? t("edit") : "Edit"}
                        </button>
                      )}
                      {onDelete && (
                        <button
                          className='text-red-600 hover:text-red-900 px-2 py-1 rounded transition-colors'
                          onClick={() => onDelete(row)}
                        >
                          {t ? t("delete") : "Delete"}
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
