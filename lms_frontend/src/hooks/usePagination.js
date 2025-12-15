// src/hooks/usePagination.js
import { useState } from 'react';

export const usePagination = (initialPage = 0, initialSize = 10) => {
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialSize);
  const [totalPages, setTotalPages] = useState(1);

  const nextPage = () => setPage(prev => Math.min(prev + 1, totalPages - 1));
  const prevPage = () => setPage(prev => Math.max(prev - 1, 0));
  const goToPage = (pageNum) => setPage(Math.min(Math.max(pageNum, 0), totalPages - 1));
  const resetPagination = () => {
    setPage(initialPage);
    setPageSize(initialSize);
    setTotalPages(1);
  };

  const hasNext = page < totalPages - 1;
  const hasPrev = page > 0;

  return {
    page,
    setPage,
    pageSize,
    setPageSize,
    totalPages,
    setTotalPages,
    nextPage,
    prevPage,
    goToPage,
    resetPagination,
    hasNext,
    hasPrev,
  };
};