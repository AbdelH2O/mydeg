import React from 'react';
import {useDroppable} from '@dnd-kit/core';
import { useCourses } from '../hooks/useCourses';

const Droppable = ({ id, index, children }: { id: string, index: number, children: JSX.Element | JSX.Element[] }) => {
  const {isOver, setNodeRef} = useDroppable({
    id: id,
  });  
  
  const { activeId } = useCourses();
  console.log(activeId);
  
  const style = {
    backgroundColor: isOver && index === 0 ? '#22d3ee' : (activeId !== '' && index === 0 ? '#cffafe' : undefined),
  };
  
  
  return (
    <div key={id} ref={setNodeRef} style={style} className="border border-dashed border-gray-300 rounded flex justify-center items-center bg-gray-100">
      {children}
    </div>
  );
}

export default Droppable;