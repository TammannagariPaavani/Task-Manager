export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="pagination card">
      <button className="ghost-button" onClick={() => onPageChange(page - 1)} disabled={page <= 1}>
        Previous
      </button>
      <span>
        Page {page} of {totalPages}
      </span>
      <button
        className="ghost-button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
      >
        Next
      </button>
    </div>
  );
}

