import { useEffect, useState, useRef } from 'react';
import Pagination from './Pagination';

const ResponsivePaginationHandler = ({
  currentPage,
  totalPages,
  size,
  totalElements,
  onPageChange,
  onMobilePageChange,
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const loadingRef = useRef(false);
  const sentinelRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!isMobile || !sentinelRef.current) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (
          entry.isIntersecting &&
          !loadingRef.current &&
          size < totalElements
        ) {
          loadingRef.current = true;
          onMobilePageChange(size + 10);
        }
      });
    });

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [isMobile, size, totalElements, onMobilePageChange]);

  useEffect(() => {
    loadingRef.current = false;
  }, [size]);

  return (
    <>
      {isMobile ? (
        <div
          ref={sentinelRef}
          className="h-10 w-full flex justify-center items-center"
        >
          {size < totalElements ? (
            <span className="text-gray-400 text-sm">
              Scroll to load more...
            </span>
          ) : (
            <span className="text-gray-400 text-sm">No more results</span>
          )}
        </div>
      ) : (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </>
  );
};

export default ResponsivePaginationHandler;
