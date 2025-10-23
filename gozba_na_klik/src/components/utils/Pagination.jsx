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
          {"<"}
        </button>

        <span>
          {page + 1} / {pageCount} ({totalCount} hits)
        </span>

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNextPage}
        >
          {">"}
        </button>

        <select
          value={pageSize}
          onChange={(e) => {
            onPageSizeChange(Number(e.target.value))
          }}
        >
          {[5, 10, 20, 50].map((size) => (
            <option key={size} value={size} defaultValue={5}>
              {size} po strani
            </option>
          ))}
        </select>
      </div>
    </nav>
  );
};

export default Pagination;
