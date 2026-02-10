'use client';

import { useMemo } from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pages = useMemo(() => {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }, [totalPages]);

  function goToPage(page: number) {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  }

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-center gap-1 mt-6">
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-2 text-sm rounded-lg border border-border transition-colors
          ${currentPage === 1 ? 'text-text-light cursor-not-allowed bg-bg' : 'text-text hover:bg-primary hover:text-white hover:border-primary'}`}
      >
        이전
      </button>

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => goToPage(p)}
          className={`w-9 h-9 text-sm rounded-lg border transition-colors
            ${p === currentPage ? 'bg-primary text-white border-primary' : 'border-border text-text hover:bg-primary hover:text-white hover:border-primary'}`}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-3 py-2 text-sm rounded-lg border border-border transition-colors
          ${currentPage === totalPages ? 'text-text-light cursor-not-allowed bg-bg' : 'text-text hover:bg-primary hover:text-white hover:border-primary'}`}
      >
        다음
      </button>
    </div>
  );
}
