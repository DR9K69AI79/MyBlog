/**
 * 排序/标注页面
 * 调整 Gallery 顺序、编辑标注、选择封面
 * 改进：自动保存，所见即所得
 */

import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
    rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import toast from 'react-hot-toast';
import PageLayout from '../components/layout/PageLayout';
import { useImageManager } from '../store/useImageManager';
import { ImageInfo, Project } from '../api/client';
import './OrganizePage.css';

// 防抖函数
function useDebouncedCallback<T extends (...args: any[]) => any>(
    callback: T,
    delay: number
) {
    const timeoutRef = useState<NodeJS.Timeout | null>(null)[1];

    return useCallback((...args: Parameters<T>) => {
        timeoutRef((prev) => {
            if (prev) clearTimeout(prev);
            return setTimeout(() => callback(...args), delay);
        });
    }, [callback, delay, timeoutRef]);
}

function OrganizePage() {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const {
        projects,
        fetchData,
        isLoading,
        reorderGallery,
        updateCaption,
        unassignImage,
        setCoverImage,
    } = useImageManager();

    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [allImages, setAllImages] = useState<(ImageInfo & { isCover: boolean })[]>([]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // 选择项目并合并所有图片
    useEffect(() => {
        if (projectId && projects.length > 0) {
            const project = projects.find(p => p.id === projectId);
            if (project) {
                setSelectedProject(project);
                // 合并封面和 gallery，封面排在最前
                const merged: (ImageInfo & { isCover: boolean })[] = [];
                if (project.rawImages.cover) {
                    merged.push({ ...project.rawImages.cover, isCover: true });
                }
                project.rawImages.gallery.forEach(img => {
                    merged.push({ ...img, isCover: false });
                });
                setAllImages(merged);
            }
        } else if (projects.length > 0 && !projectId) {
            // 自动选择第一个有图片的项目
            const projectWithImages = projects.find(
                p => p.rawImages.cover || p.rawImages.gallery.length > 0
            );
            if (projectWithImages) {
                navigate(`/organize/${projectWithImages.id}`, { replace: true });
            }
        }
    }, [projectId, projects, navigate]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    // 拖拽结束 - 自动保存排序
    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id || !selectedProject) return;

        const oldIndex = allImages.findIndex(item => item.filename === active.id);
        const newIndex = allImages.findIndex(item => item.filename === over.id);

        const newItems = arrayMove(allImages, oldIndex, newIndex);
        setAllImages(newItems);

        // 立即保存排序
        try {
            const galleryItems = newItems.filter(item => !item.isCover);
            const newOrder = galleryItems.map((item, idx) => ({
                filename: item.filename,
                newIndex: idx + 1,
            }));
            await reorderGallery(selectedProject.id, newOrder);
            toast.success('排序已保存');
        } catch {
            toast.error('排序保存失败');
            // 恢复原状态
            fetchData();
        }
    };

    // 标注变更 - 自动保存（失焦时）
    const handleCaptionSave = async (filename: string, newCaption: string) => {
        try {
            await updateCaption(filename, newCaption);
            toast.success('标注已保存');
        } catch {
            toast.error('标注保存失败');
        }
    };

    // 设置封面
    const handleSetCover = async (filename: string) => {
        if (!selectedProject) return;

        try {
            await setCoverImage(selectedProject.id, filename);
            toast.success('已设为封面');
        } catch {
            toast.error('设置封面失败');
        }
    };

    const handleRemove = async (filename: string) => {
        if (!confirm('确定移除此图片？')) return;
        try {
            await unassignImage(filename);
            setAllImages(items => items.filter(item => item.filename !== filename));
            toast.success('已移除');
        } catch {
            toast.error('移除失败');
        }
    };

    if (isLoading) {
        return (
            <PageLayout title="🔢 排序/标注" description="调整 Gallery 顺序和编辑标注">
                <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>加载中...</p>
                </div>
            </PageLayout>
        );
    }

    const projectsWithImages = projects.filter(
        p => p.rawImages.cover || p.rawImages.gallery.length > 0
    );

    return (
        <PageLayout
            title="🔢 排序/标注"
            description="拖拽自动保存排序 · 标注失焦自动保存 · 点击⭐设为封面"
        >
            {/* 项目选择器 */}
            <div className="project-selector">
                <label>选择项目：</label>
                <select
                    value={selectedProject?.id || ''}
                    onChange={(e) => navigate(`/organize/${e.target.value}`)}
                >
                    <option value="" disabled>请选择项目</option>
                    {projectsWithImages.map(p => (
                        <option key={p.id} value={p.id}>
                            {p.id} ({(p.rawImages.cover ? 1 : 0) + p.rawImages.gallery.length} 张)
                        </option>
                    ))}
                </select>
            </div>

            {selectedProject ? (
                <div className="organize-content">
                    {/* 统一的图片列表 */}
                    <section className="gallery-section">
                        <div className="section-header">
                            <h3>📸 项目图片 ({allImages.length})</h3>
                            <span className="hint">自动保存 · 拖拽调整顺序 · 点击⭐设为封面</span>
                        </div>

                        {allImages.length > 0 ? (
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={handleDragEnd}
                            >
                                <SortableContext
                                    items={allImages.map(item => item.filename)}
                                    strategy={rectSortingStrategy}
                                >
                                    <div className="gallery-grid">
                                        {allImages.map((item, index) => (
                                            <SortableGalleryItem
                                                key={item.filename}
                                                item={item}
                                                index={index}
                                                isCover={item.isCover}
                                                onCaptionSave={handleCaptionSave}
                                                onRemove={handleRemove}
                                                onSetCover={handleSetCover}
                                            />
                                        ))}
                                    </div>
                                </SortableContext>
                            </DndContext>
                        ) : (
                            <div className="empty-gallery">
                                <p>暂无图片</p>
                                <p>请先在「分拣」页面分配图片</p>
                            </div>
                        )}
                    </section>
                </div>
            ) : (
                <div className="no-project">
                    <p>请选择一个项目进行编辑</p>
                </div>
            )}
        </PageLayout>
    );
}

// 可排序的图片项
function SortableGalleryItem({
    item,
    index,
    isCover,
    onCaptionSave,
    onRemove,
    onSetCover,
}: {
    item: ImageInfo & { isCover: boolean };
    index: number;
    isCover: boolean;
    onCaptionSave: (filename: string, caption: string) => void;
    onRemove: (filename: string) => void;
    onSetCover: (filename: string) => void;
}) {
    const [localCaption, setLocalCaption] = useState(item.caption || '');
    const [originalCaption, setOriginalCaption] = useState(item.caption || '');

    // 同步外部数据变化
    useEffect(() => {
        setLocalCaption(item.caption || '');
        setOriginalCaption(item.caption || '');
    }, [item.caption, item.filename]);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: item.filename });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.6 : 1,
        zIndex: isDragging ? 100 : 1,
    };

    // 失焦时保存（只在内容有变化时）
    const handleBlur = () => {
        if (localCaption !== originalCaption) {
            onCaptionSave(item.filename, localCaption);
            setOriginalCaption(localCaption);
        }
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`gallery-item ${isDragging ? 'dragging' : ''} ${isCover ? 'is-cover' : ''}`}
        >
            <div className="item-handle" {...attributes} {...listeners}>
                <span className="index">{index + 1}</span>
                <span className="drag-icon">⠿</span>
            </div>

            <div className="item-preview">
                <img src={item.url} alt="" />
                {isCover && <span className="cover-badge">封面</span>}

                <div className="item-actions">
                    {!isCover && (
                        <button
                            className="action-btn set-cover"
                            onClick={() => onSetCover(item.filename)}
                            title="设为封面"
                        >
                            ⭐
                        </button>
                    )}
                    <button
                        className="action-btn remove"
                        onClick={() => onRemove(item.filename)}
                        title="移除"
                    >
                        ×
                    </button>
                </div>
            </div>

            {!isCover && (
                <input
                    type="text"
                    className="caption-input"
                    placeholder="添加标注（失焦自动保存）..."
                    value={localCaption}
                    onChange={(e) => setLocalCaption(e.target.value)}
                    onBlur={handleBlur}
                />
            )}
        </div>
    );
}

export default OrganizePage;
