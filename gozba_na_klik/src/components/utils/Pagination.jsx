import React from 'react'


const Pagination = ({
  page,
  pageCount,
  totalCount,
  hasPreviousPage,
  hasNextPage,
  pageSize,
  onPageChange,
  onPageSizeChange
}) => {
  return (
    <nav className="pagination">
      <div className="pagination__controls">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={!hasPreviousPage}
        >
          ← Prethodna
        </button>

        <span>
          Strana {page + 1} od {pageCount} ({totalCount} ukupno)
        </span>

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNextPage}
        >
          Sledeća →
        </button>

        <select
          value={pageSize}
          onChange={(e) => {
            onPageSizeChange(Number(e.target.value))
          }}
        >
          {[5, 10, 20, 50].map((size) => (
            <option key={size} value={size}>
              {size} po strani
            </option>
          ))}
        </select>
      </div>
    </nav>
  );
};

export default Pagination;
