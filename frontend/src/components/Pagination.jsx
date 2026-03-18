import React, { useState } from 'react';

const Pagination = ({
  currentPage = 0,
  totalPages = 1,
  pageSize = 10,
  totalElements = 0,
  onPageChange,
  onPageSizeChange
}) => {
  const [jumpPage, setJumpPage] = useState(currentPage.toString());

  const handlePreviousClick = () => {
    if (currentPage > 0 && onPageChange) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    if (currentPage < totalPages - 1 && onPageChange) {
      onPageChange(currentPage + 1);
    }
  };

  const handleJumpToPage = (e) => {
    e.preventDefault();
    const pageNum = parseInt(jumpPage, 10);
    if (!isNaN(pageNum) && pageNum >= 0 && pageNum < totalPages && onPageChange) {
      onPageChange(pageNum);
    } else {
      setJumpPage(currentPage.toString());
    }
  };

  const handlePageSizeChange = (e) => {
    const newSize = parseInt(e.target.value, 10);
    if (onPageSizeChange) {
      onPageSizeChange(newSize);
    }
  };

  const startRecord = currentPage * pageSize + 1;
  const endRecord = Math.min((currentPage + 1) * pageSize, totalElements);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        marginTop: '20px',
        flexWrap: 'wrap',
        gap: '15px'
      }}
    >
      {/* Left Section: Summary */}
      <div
        style={{
          fontSize: '14px',
          color: '#666',
          fontWeight: '500'
        }}
      >
        {totalElements > 0 ? (
          <>Showing {startRecord} - {endRecord} of {totalElements} records</>
        ) : (
          <>No records found</>
        )}
      </div>

      {/* Middle Section: Navigation & Page Size */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '15px',
          flexWrap: 'wrap'
        }}
      >
        {/* Previous Button */}
        <button
          onClick={handlePreviousClick}
          disabled={currentPage === 0}
          style={{
            padding: '8px 12px',
            backgroundColor: currentPage === 0 ? '#e0e0e0' : '#007bff',
            color: currentPage === 0 ? '#999' : '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => {
            if (currentPage > 0) e.currentTarget.style.backgroundColor = '#0056b3';
          }}
          onMouseLeave={(e) => {
            if (currentPage > 0) e.currentTarget.style.backgroundColor = '#007bff';
          }}
        >
          ← Previous
        </button>

        {/* Page Info */}
        <div
          style={{
            fontSize: '14px',
            fontWeight: '500',
            color: '#333',
            minWidth: '120px',
            textAlign: 'center'
          }}
        >
          Page {currentPage + 1} of {totalPages}
        </div>

        {/* Next Button */}
        <button
          onClick={handleNextClick}
          disabled={currentPage >= totalPages - 1}
          style={{
            padding: '8px 12px',
            backgroundColor: currentPage >= totalPages - 1 ? '#e0e0e0' : '#007bff',
            color: currentPage >= totalPages - 1 ? '#999' : '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: currentPage >= totalPages - 1 ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => {
            if (currentPage < totalPages - 1) e.currentTarget.style.backgroundColor = '#0056b3';
          }}
          onMouseLeave={(e) => {
            if (currentPage < totalPages - 1) e.currentTarget.style.backgroundColor = '#007bff';
          }}
        >
          Next →
        </button>

        {/* Page Size Selector */}
        <select
          value={pageSize}
          onChange={handlePageSizeChange}
          style={{
            padding: '8px 12px',
            backgroundColor: '#fff',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '14px',
            fontWeight: '500',
            color: '#333',
            cursor: 'pointer',
            transition: 'border-color 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#007bff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#ddd';
          }}
        >
          <option value={10}>10 per page</option>
          <option value={25}>25 per page</option>
          <option value={50}>50 per page</option>
          <option value={100}>100 per page</option>
        </select>
      </div>

      {/* Right Section: Jump to Page */}
      <form
        onSubmit={handleJumpToPage}
        style={{
          display: 'flex',
          gap: '8px',
          alignItems: 'center'
        }}
      >
        <label
          style={{
            fontSize: '13px',
            fontWeight: '500',
            color: '#666'
          }}
        >
          Go to:
        </label>
        <input
          type="number"
          min="1"
          max={totalPages}
          value={jumpPage}
          onChange={(e) => setJumpPage(e.target.value)}
          onBlur={() => setJumpPage(currentPage.toString())}
          style={{
            padding: '6px 8px',
            width: '60px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '14px',
            textAlign: 'center'
          }}
          placeholder="1"
        />
        <button
          type="submit"
          style={{
            padding: '6px 10px',
            backgroundColor: '#28a745',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: '500',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#218838';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#28a745';
          }}
        >
          Go
        </button>
      </form>
    </div>
  );
};

export default Pagination;
