/**
 * 分拣页面
 * 将图片分配到项目（简化版：统一分配，不区分 cover/gallery）
 */

import { useEffect, useState, useRef } from 'react';
import {
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors,
    useDroppable,
    useDraggable,
} from '@dnd-kit/core';
import toast from 'react-hot-toast';
import PageLayout from '../components/layout/PageLayout';
import { useImageManager } from '../store/useImageManager';
import { ImageInfo, Project } from '../api/client';
import './AssignPage.css';

function AssignPage() {
    const {
        projects,
        pendingImages,
        fetchData,
        isLoading,
        uploadImages,
        assignMultipleImages,
        unassignImage,
        deleteImage,
    } = useImageManager();

    const [activeImage, setActiveImage] = useState<ImageInfo | null>(null);
    const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
    const [filter, setFilter] = useState<'all' | 'hasImages' | 'noImages'>('all');
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const sensors = useSensors(
        useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
        useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } })
    );

    // 点击图片选择/取消选择
    const toggleSelect = (filename: string, ctrlKey: boolean) => {
        setSelectedImages(prev => {
            const newSet = new Set(prev);
            if (ctrlKey) {
                // Ctrl+点击：切换选择
                if (newSet.has(filename)) {
                    newSet.delete(filename);
                } else {
                    newSet.add(filename);
                }
            } else {
                // 普通点击：单选或取消
                if (newSet.has(filename) && newSet.size === 1) {
                    newSet.clear();
                } else {
                    newSet.clear();
                    newSet.add(filename);
                }
            }
            return newSet;
        });
    };

    const handleDragStart = (event: DragStartEvent) => {
        const image = pendingImages.find(img => img.filename === event.active.id);
        setActiveImage(image || null);

        // 如果拖拽的图片不在选中列表中，清空选择并只选中当前图片
        if (image && !selectedImages.has(image.filename)) {
            setSelectedImages(new Set([image.filename]));
        }
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        setActiveImage(null);
        const { active, over } = event;

        if (!over) return;

        const projectId = over.id as string;

        // 确定要分配的图片列表
        let imagesToAssign: string[];
        if (selectedImages.has(active.id as string) && selectedImages.size > 1) {
            // 如果拖拽的是选中的图片且有多选，批量分配
            imagesToAssign = Array.from(selectedImages);
        } else {
            // 否则只分配拖拽的图片
            imagesToAssign = [active.id as string];
        }

        try {
            await assignMultipleImages(imagesToAssign, projectId);
            toast.success(`已分配 ${imagesToAssign.length} 张图片到 ${projectId}`);
            setSelectedImages(new Set()); // 清空选择
        } catch {
            toast.error('分配失败');
        }
    };

    // 过滤项目
    const filteredProjects = projects.filter(project => {
        const totalImages = (project.rawImages.cover ? 1 : 0) + project.rawImages.gallery.length;
        if (filter === 'hasImages' && totalImages === 0) return false;
        if (filter === 'noImages' && totalImages > 0) return false;
        if (search && !project.id.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
    });

    // 取消分配处理
    const handleUnassign = async (filename: string) => {
        try {
            await unassignImage(filename);
            toast.success('已取消分配');
        } catch {
            toast.error('操作失败');
        }
    };

    if (isLoading) {
        return (
            <PageLayout title="📥 分拣" description="将图片分配到项目">
                <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>加载中...</p>
                </div>
            </PageLayout>
        );
    }

    return (
        <PageLayout title="📥 分拣" description="拖拽图片到项目卡片进行分配（支持多选：Ctrl+点击）">
            <DndContext
                sensors={sensors}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                {/* 待分配区域 */}
                <PendingZone
                    images={pendingImages}
                    selectedImages={selectedImages}
                    onToggleSelect={toggleSelect}
                    onUpload={uploadImages}
                    onDelete={deleteImage}
                />

                {/* 过滤器 */}
                <div className="filter-bar">
                    <div className="filter-tabs">
                        <button
                            className={filter === 'all' ? 'active' : ''}
                            onClick={() => setFilter('all')}
                        >
                            全部 ({projects.length})
                        </button>
                        <button
                            className={filter === 'hasImages' ? 'active' : ''}
                            onClick={() => setFilter('hasImages')}
                        >
                            已配置 ({projects.filter(p => p.rawImages.cover || p.rawImages.gallery.length > 0).length})
                        </button>
                        <button
                            className={filter === 'noImages' ? 'active' : ''}
                            onClick={() => setFilter('noImages')}
                        >
                            未配置 ({projects.filter(p => !p.rawImages.cover && p.rawImages.gallery.length === 0).length})
                        </button>
                    </div>
                    <input
                        type="text"
                        placeholder="搜索项目..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="search-input"
                    />
                </div>

                {/* 项目网格 */}
                <div className="project-grid">
                    {filteredProjects.map(project => (
                        <ProjectDropZone
                            key={project.id}
                            project={project}
                            onUnassign={handleUnassign}
                        />
                    ))}
                </div>

                {/* 拖拽预览 */}
                <DragOverlay>
                    {activeImage && (
                        <div className="drag-preview">
                            <img src={activeImage.url} alt="" />
                            {selectedImages.size > 1 && (
                                <span className="drag-count">{selectedImages.size}</span>
                            )}
                        </div>
                    )}
                </DragOverlay>
            </DndContext>
        </PageLayout>
    );
}

// 待分配区域
function PendingZone({
    images,
    selectedImages,
    onToggleSelect,
    onUpload,
    onDelete,
}: {
    images: ImageInfo[];
    selectedImages: Set<string>;
    onToggleSelect: (filename: string, ctrlKey: boolean) => void;
    onUpload: (files: FileList) => Promise<void>;
    onDelete: (filename: string) => Promise<void>;
}) {
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        if (e.dataTransfer.files.length > 0) {
            await onUpload(e.dataTransfer.files);
            toast.success(`已导入 ${e.dataTransfer.files.length} 张图片`);
        }
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            await onUpload(e.target.files);
            toast.success(`已导入 ${e.target.files.length} 张图片`);
            e.target.value = '';
        }
    };

    return (
        <section
            className={`pending-zone ${isDragOver ? 'dragover' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
        >
            <div className="pending-header">
                <h2>待分配图片 <span className="count">{images.length}</span></h2>
                {selectedImages.size > 0 && (
                    <span className="selected-hint">已选中 {selectedImages.size} 张</span>
                )}
                <button className="btn btn-secondary" onClick={() => fileInputRef.current?.click()}>
                    📁 选择文件
                </button>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    hidden
                    onChange={handleFileSelect}
                />
            </div>

            <div className={`pending-images ${images.length === 0 ? 'empty' : ''}`}>
                {images.length === 0 ? (
                    <div className="empty-hint">
                        <span>📷</span>
                        <p>拖拽图片到此处，或点击选择文件</p>
                    </div>
                ) : (
                    images.map(img => (
                        <DraggableImage
                            key={img.filename}
                            image={img}
                            isSelected={selectedImages.has(img.filename)}
                            onToggleSelect={onToggleSelect}
                            onDelete={onDelete}
                        />
                    ))
                )}
            </div>
        </section>
    );
}

// 可拖拽的图片
function DraggableImage({
    image,
    isSelected,
    onToggleSelect,
    onDelete,
}: {
    image: ImageInfo;
    isSelected: boolean;
    onToggleSelect: (filename: string, ctrlKey: boolean) => void;
    onDelete: (filename: string) => Promise<void>;
}) {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: image.filename,
    });

    const handleClick = (e: React.MouseEvent) => {
        // 只在非拖拽状态下处理点击
        if (!isDragging) {
            onToggleSelect(image.filename, e.ctrlKey || e.metaKey);
        }
    };

    return (
        <div
            ref={setNodeRef}
            className={`pending-image ${isDragging ? 'dragging' : ''} ${isSelected ? 'selected' : ''}`}
            {...listeners}
            {...attributes}
            onClick={handleClick}
        >
            <img src={image.url} alt="" />
            {isSelected && <div className="selected-check">✓</div>}
            <button
                className="delete-btn"
                onClick={(e) => {
                    e.stopPropagation();
                    if (confirm('确定删除？')) onDelete(image.filename);
                }}
            >
                ×
            </button>
        </div>
    );
}

// 项目放置区（简化版：统一放置区）
function ProjectDropZone({
    project,
    onUnassign,
}: {
    project: Project;
    onUnassign: (filename: string) => Promise<void>;
}) {
    const droppable = useDroppable({ id: project.id });

    const allImages = [
        ...(project.rawImages.cover ? [{ ...project.rawImages.cover, isCover: true }] : []),
        ...project.rawImages.gallery.map(img => ({ ...img, isCover: false })),
    ];
    const totalCount = allImages.length;

    return (
        <div className={`project-drop-zone ${droppable.isOver ? 'dragover' : ''}`} ref={droppable.setNodeRef}>
            <div className="project-header">
                <span className={`status-dot ${totalCount > 0 ? 'has-images' : ''}`}></span>
                <span className="project-id">{project.id}</span>
                <span className="image-count">{totalCount} 张</span>
            </div>

            <div className="project-images">
                {totalCount > 0 ? (
                    <div className="image-grid">
                        {allImages.slice(0, 6).map((img, i) => (
                            <div key={i} className={`image-thumb ${img.isCover ? 'is-cover' : ''}`}>
                                <img src={img.url} alt="" />
                                {img.isCover && <span className="cover-badge">封面</span>}
                                <button
                                    className="unassign-btn"
                                    onClick={() => onUnassign(img.filename)}
                                    title="取消分配"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                        {totalCount > 6 && (
                            <div className="more-indicator">+{totalCount - 6}</div>
                        )}
                    </div>
                ) : (
                    <div className="drop-hint">
                        <span>📷</span>
                        <span>拖拽图片到此处</span>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AssignPage;
