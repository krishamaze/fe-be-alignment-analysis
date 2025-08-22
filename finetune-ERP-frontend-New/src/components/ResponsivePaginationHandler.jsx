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

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const isAtBottom = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const fullHeight = document.documentElement.scrollHeight;
    return scrollTop + windowHeight >= fullHeight - 2; // small offset
  };

  useEffect(() => {
    if (!isMobile) return;

    const onScroll = () => {
      if (
        isAtBottom() &&
        !loadingRef.current &&
        size < totalElements
      ) {
        loadingRef.current = true;
        onMobilePageChange(size + 10);
      }
    };

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [isMobile, size, totalElements, onMobilePageChange]);

  useEffect(() => {
    loadingRef.current = false;

    const timeout = setTimeout(() => {
      if (isMobile && isAtBottom() && size < totalElements) {
        loadingRef.current = true;
        onMobilePageChange(size + 10);
      }
    }, 200); // delay after render

    return () => clearTimeout(timeout);
  }, [size, isMobile, totalElements, onMobilePageChange]);

  return (
    <>
      {isMobile ? (
        <div className="h-10 w-full flex justify-center items-center">
          {size < totalElements ? (
            <span className="text-gray-400 text-sm">Scroll to load more...</span>
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
