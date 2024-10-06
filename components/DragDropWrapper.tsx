import React, { useEffect } from 'react';
import { DragDropContext, DragDropContextProps } from '@hello-pangea/dnd';

const DragDropWrapper: React.FC<DragDropContextProps> = (props) => {
  useEffect(() => {
    // Suppress the specific warning
    const originalError = console.error;
    console.error = (...args: any[]) => {
      if (typeof args[0] === 'string' && args[0].includes('Support for defaultProps will be removed from memo components')) {
        return;
      }
      originalError.apply(console, args);
    };

    return () => {
      console.error = originalError;
    };
  }, []);

  return <DragDropContext {...props} />;
};

export default DragDropWrapper;