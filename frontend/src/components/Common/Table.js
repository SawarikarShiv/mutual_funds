import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import './Table.css';

const Table = ({
  columns,
  data,
  onSort,
  sortField,
  sortDirection,
  loading = false,
  emptyMessage = 'No data found',
  onRowClick,
  className = '',
}) => {
  const handleSort = (field) => {
    if (onSort && field.sortable) {
      onSort(field.key);
    }
  };

  if (loading) {
    return (
      <div className="table-loading">
        <div className="spinner"></div>
        <p>Loading data...</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="table-empty">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`table-container ${className}`}>
      <table className="table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={`table-header ${column.sortable ? 'sortable' : ''}`}
                onClick={() => handleSort(column)}
                style={{ width: column.width }}
              >
                <div className="header-content">
                  {column.title}
                  {column.sortable && sortField === column.key && (
                    <span className="sort-icon">
                      {sortDirection === 'asc' ? (
                        <ChevronUp size={14} />
                      ) : (
                        <ChevronDown size={14} />
                      )}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr
              key={row.id || index}
              className={`table-row ${onRowClick ? 'clickable' : ''}`}
              onClick={() => onRowClick && onRowClick(row)}
            >
              {columns.map((column) => (
                <td key={column.key} className="table-cell">
                  {column.render
                    ? column.render(row[column.key], row)
                    : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;