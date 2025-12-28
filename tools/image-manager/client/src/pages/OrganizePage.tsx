/**
 * 排序/标注页面
 * 调整 Gallery 顺序和编辑标注
 */

import { useEffect, useState } from 'react';
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
    } = useImageManager();

    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [galleryItems, setGalleryItems] = useState<ImageInfo[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // 选择项目
    useEffect(() => {
        if (projectId && projects.length > 0) {
            const project = projects.find(p => p.id === projectId);
            if (project) {
                setSelectedProject(project);
                setGalleryItems([...project.rawImages.gallery]);
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

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = galleryItems.findIndex(item => item.filename === active.id);
        const newIndex = galleryItems.findIndex(item => item.filename === over.id);

        const newItems = arrayMove(galleryItems, oldIndex, newIndex);
        setGalleryItems(newItems);
        setHasChanges(true);
    };

    const handleCaptionChange = (filename: string, newCaption: string) => {
        setGalleryItems(items =>
            items.map(item =>
                item.filename === filename
                    ? { ...item, caption: newCaption }
                    : item
            )
        );
        setHasChanges(true);
    };

    const handleSave = async () => {
        if (!selectedProject) return;

        setIsSaving(true);
        try {
            // 1. 保存排序
            const newOrder = galleryItems.map((item, idx) => ({
                filename: item.filename,
                newIndex: idx + 1,
            }));
            await reorderGallery(selectedProject.id, newOrder);

            // 2. 保存标注变更
            for (const item of galleryItems) {
                const original = selectedProject.rawImages.gallery.find(
                    g => g.index === (galleryItems.indexOf(item) + 1)
                );
                if (original?.caption !== item.caption) {
                    await updateCaption(item.filename, item.caption || '');
                }
            }

            toast.success('保存成功');
            setHasChanges(false);
            fetchData(); // 刷新数据
        } catch {
            toast.error('保存失败');
        } finally {
            setIsSaving(false);
        }
    };

    const handleRemove = async (filename: string) => {
        if (!confirm('确定移除此图片？')) return;
        try {
            await unassignImage(filename);
            setGalleryItems(items => items.filter(item => item.filename !== filename));
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
            description="拖拽调整 Gallery 顺序，直接编辑标注文字"
            footer={
                hasChanges && (
                    <button
                        className="btn btn-primary"
                        onClick={handleSave}
                        disabled={isSaving}
                    >
                        {isSaving ? '保存中...' : '💾 保存更改'}
                    </button>
                )
            }
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
                            {p.id} ({p.rawImages.gallery.length} 张)
                        </option>
                    ))}
                </select>
            </div>

            {selectedProject ? (
                <div className="organize-content">
                    {/* 封面展示 */}
                    {selectedProject.rawImages.cover && (
                        <section className="cover-section">
                            <h3>📷 封面</h3>
                            <div className="cover-preview">
                                <img src={selectedProject.rawImages.cover.url} alt="cover" />
                            </div>
                        </section>
                    )}

                    {/* Gallery 排序 */}
                    <section className="gallery-section">
                        <div className="section-header">
                            <h3>🎨 Gallery ({galleryItems.length})</h3>
                            <span className="hint">拖拽卡片调整顺序</span>
                        </div>

                        {galleryItems.length > 0 ? (
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={handleDragEnd}
                            >
                                <SortableContext
                                    items={galleryItems.map(item => item.filename)}
                                    strategy={rectSortingStrategy}
                                >
                                    <div className="gallery-grid">
                                        {galleryItems.map((item, index) => (
                                            <SortableGalleryItem
                                                key={item.filename}
                                                item={item}
                                                index={index}
                                                onCaptionChange={handleCaptionChange}
                                                onRemove={handleRemove}
                                            />
                                        ))}
                                    </div>
                                </SortableContext>
                            </DndContext>
                        ) : (
                            <div className="empty-gallery">
                                <p>暂无 Gallery 图片</p>
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

// 可排序的 Gallery 项
function SortableGalleryItem({
    item,
    index,
    onCaptionChange,
    onRemove,
}: {
    item: ImageInfo;
    index: number;
    onCaptionChange: (filename: string, caption: string) => void;
    onRemove: (filename: string) => void;
}) {
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

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`gallery-item ${isDragging ? 'dragging' : ''}`}
        >
            <div className="item-handle" {...attributes} {...listeners}>
                <span className="index">{index + 1}</span>
                <span className="drag-icon">⠿</span>
            </div>

            <div className="item-preview">
                <img src={item.url} alt="" />
                <button
                    className="remove-btn"
                    onClick={() => onRemove(item.filename)}
                    title="移除"
                >
                    ×
                </button>
            </div>

            <input
                type="text"
                className="caption-input"
                placeholder="添加标注..."
                value={item.caption || ''}
                onChange={(e) => onCaptionChange(item.filename, e.target.value)}
            />
        </div>
    );
}

export default OrganizePage;
