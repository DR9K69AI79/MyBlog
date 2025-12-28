/**
 * DnD 提供者组件
 * 包装整个应用以支持拖拽功能
 */

import { ReactNode } from 'react';
import {
    DndContext,
    DragEndEvent,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import toast from 'react-hot-toast';
import { useImageManager } from '../store/useImageManager';

interface DndProviderProps {
    children: ReactNode;
}

export function DndProvider({ children }: DndProviderProps) {
    const { assignImage } = useImageManager();

    const mouseSensor = useSensor(MouseSensor, {
        activationConstraint: {
            distance: 10,
        },
    });

    const touchSensor = useSensor(TouchSensor, {
        activationConstraint: {
            delay: 250,
            tolerance: 5,
        },
    });

    const sensors = useSensors(mouseSensor, touchSensor);

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over) return;

        const dragData = active.data.current;
        const dropData = over.data.current;

        if (dragData?.type === 'pending' && dropData?.projectId && dropData?.slot) {
            const { projectId, slot } = dropData;
            const filename = active.id as string;

            try {
                await assignImage(filename, projectId, slot);
                toast.success(
                    slot === 'cover'
                        ? `已设为 ${projectId} 的封面`
                        : `已添加到 ${projectId} 的 Gallery`
                );
            } catch {
                toast.error('分配失败');
            }
        }
    };

    return (
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            {children}
        </DndContext>
    );
}
