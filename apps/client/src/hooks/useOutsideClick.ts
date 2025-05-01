import React from 'react';

export const useOutsideClick = <T extends HTMLElement | null>(
  ref: React.RefObject<T>,
  cb: () => void,
) => {
  React.useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        ref.current &&
        event.target &&
        !ref.current.contains(event.target as Node)
      ) {
        cb();
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [ref, cb]);
};
