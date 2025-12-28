/**
 * 项目卡片组件
 * 支持 Gallery 拖拽排序和标注编辑
 */

import { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import toast from 'react-hot-toast';
import { useImageManager } from '../store/useImageManager';
import { Project, ImageInfo } from '../api/client';
import './ProjectCard.css';

interface ProjectCardProps {
    project: Project;
}

function ProjectCard({ project }: ProjectCardProps) {
    const { unassignImage, openCropModal, openCaptionModal, reorderGallery } = useImageManager();
    const { rawImages } = project;
    const [isSorting, setIsSorting] = useState(false);

    // 封面槽位
    const coverDroppable = useDroppable({
        id: `${project.id}-cover`,
        data: { projectId: project.id, slot: 'cover' },
    });

    // Gallery 槽位（用于添加新图片）
    const galleryDroppable = useDroppable({
        id: `${project.id}-gallery`,
        data: { projectId: project.id, slot: 'gallery' },
    });

    const handleUnassign = async (filename: string, type: string) => {
        try {
            await unassignImage(filename);
            toast.success(`已取消分配${type === 'cover' ? '封面' : 'Gallery 图片'}`);
        } catch {
            toast.error('操作失败');
        }
    };

    // Gallery 排序相关
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleSortEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = rawImages.gallery.findIndex(img => img.filename === active.id);
        const newIndex = rawImages.gallery.findIndex(img => img.filename === over.id);

        if (oldIndex !== -1 && newIndex !== -1) {
            // 计算新顺序
            const reordered = arrayMove(rawImages.gallery, oldIndex, newIndex);
            const newOrder = reordered.map((img, idx) => ({
                filename: img.filename,
                newIndex: idx + 1,
            }));

            setIsSorting(true);
            try {
                await reorderGallery(project.id, newOrder);
                toast.success('排序已更新');
            } catch {
                toast.error('排序失败');
            } finally {
                setIsSorting(false);
            }
        }
    };

    const hasCover = rawImages.cover !== null;
    const hasPublished = project.hasPublishedAssets;

    return (
        <div className={`project-card ${hasPublished ? 'published' : ''} ${isSorting ? 'sorting' : ''}`}>
            <div className="project-card-header">
                <span className={`status-dot ${hasCover ? 'has-cover' : ''}`}></span>
                <h3 className="project-name" title={project.displayName}>
                    {project.id}
                </h3>
                {hasPublished && <span className="published-badge">已发布</span>}
            </div>

            {/* 封面槽位 */}
            <div
                ref={coverDroppable.setNodeRef}
                className={`cover-slot ${hasCover ? 'has-image' : ''} ${coverDroppable.isOver ? 'dragover' : ''}`}
            >
                {rawImages.cover ? (
                    <>
                        <img src={rawImages.cover.url} alt="cover" />
                        <div className="slot-actions">
                            <button
                                className="slot-btn edit"
                                onClick={() => openCropModal(rawImages.cover!, project.id, 'cover')}
                                title="裁剪"
                            >
                                ✂️
                            </button>
                            <button
                                className="slot-btn remove"
                                onClick={() => handleUnassign(rawImages.cover!.filename, 'cover')}
                                title="取消分配"
                            >
                                ×
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="slot-placeholder">
                        <span>📷</span>
                        <span>拖拽封面到此处</span>
                    </div>
                )}
            </div>

            {/* Gallery 区域 - 支持拖拽排序 */}
            <div className="gallery-section">
                <div className="gallery-label">
                    Gallery ({rawImages.gallery.length})
                    {rawImages.gallery.length > 1 && (
                        <span className="gallery-hint">拖拽排序</span>
                    )}
                </div>
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleSortEnd}
                >
                    <SortableContext
                        items={rawImages.gallery.map(img => img.filename)}
                        strategy={horizontalListSortingStrategy}
                    >
                        <div className="gallery-slots">
                            {rawImages.gallery.map((img, idx) => (
                                <SortableGallerySlot
                                    key={img.filename}
                                    image={img}
                                    index={idx}
                                    projectId={project.id}
                                    onUnassign={handleUnassign}
                                    onCrop={() => openCropModal(img, project.id, 'gallery')}
                                    onEditCaption={() => openCaptionModal(img, project.id)}
                                />
                            ))}
                            <div
                                ref={galleryDroppable.setNodeRef}
                                className={`gallery-slot add-slot ${galleryDroppable.isOver ? 'dragover' : ''}`}
                            >
                                <span>+</span>
                            </div>
                        </div>
                    </SortableContext>
                </DndContext>
            </div>
        </div>
    );
}

// 可排序的 Gallery 图片槽位
function SortableGallerySlot({
    image,
    index,
    projectId,
    onUnassign,
    onCrop,
    onEditCaption,
}: {
    image: ImageInfo;
    index: number;
    projectId: string;
    onUnassign: (filename: string, type: string) => void;
    onCrop: () => void;
    onEditCaption: () => void;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: image.filename });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 100 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`gallery-slot has-image ${isDragging ? 'dragging' : ''}`}
            {...attributes}
            {...listeners}
        >
            <img src={image.url} alt={`gallery-${index + 1}`} />
            <div className="gallery-slot-actions">
                <button className="slot-btn edit" onClick={(e) => { e.stopPropagation(); onCrop(); }} title="裁剪">
                    ✂️
                </button>
                <button className="slot-btn caption" onClick={(e) => { e.stopPropagation(); onEditCaption(); }} title="编辑标注">
                    ✏️
                </button>
                <button
                    className="slot-btn remove"
                    onClick={(e) => { e.stopPropagation(); onUnassign(image.filename, 'gallery'); }}
                    title="取消分配"
                >
                    ×
                </button>
            </div>
            <span className="gallery-index">{index + 1}</span>
            {image.caption && (
                <span className="gallery-caption" title={image.caption}>
                    {image.caption}
                </span>
            )}
        </div>
    );
}

export default ProjectCard;
