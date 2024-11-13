import React, { ReactNode, useState } from 'react';
import { useDraggable } from '@dnd-kit/core';

interface DraggableProps {
    id: string;
    children: ReactNode;
}

function Draggable({ id, children }: DraggableProps) {
    const [isClicked, setIsClicked] = useState(false);
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: id,
    });
    const style: React.CSSProperties | undefined = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;

    const boxStyle: React.CSSProperties = {
        position: "absolute",
        top: 0,
        left: 0,
        width: isClicked ? `${20 * 5}px` : `${20 * 4}px`,
        height: isClicked ? `${20 * 5}px` : `${20 * 4}px`,
        transition: "all 0.3s ease-in-out",
        backgroundColor: isClicked ? "tomato" : "transparent",
        zIndex: -1,
    };

    return (
        <>
            {isClicked && <div className='edit-shape-window' style={boxStyle}>

            </div>
            }
            <div onClick={() => {
                console.log('clicked');
                setIsClicked(prev => !prev);
            }} ref={setNodeRef} style={style} {...listeners} {...attributes}>
                {children}
            </div>
        </>
    );
}

export default Draggable;