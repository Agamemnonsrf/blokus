import { useDroppable } from "@dnd-kit/core";
import { ReactNode } from "react";

interface DroppableProps {
    id: string;
    children: ReactNode;
}

function Droppable({ id, children }: DroppableProps) {
    const { setNodeRef } = useDroppable({
        id: id,
    });

    return (
        <div ref={setNodeRef}>
            {children}
        </div>
    );
}

export default Droppable;