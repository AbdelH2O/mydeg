import React from "react";
import { useDroppable } from "@dnd-kit/core";

const Droppable = ({
    id,
    children,
    className,
    style,
}: {
    id: string;
    children?: JSX.Element | JSX.Element[];
    className?: string;
    style?: React.CSSProperties;
}) => {
    const { isOver, setNodeRef } = useDroppable({
        id: id,
    });

    return (
        <div
            key={id}
            ref={setNodeRef}
            className={className}
            style={style}
        >
            {children}
        </div>
    );
};

export default Droppable;
