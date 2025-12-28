/**
 * 分拣页面
 * 将图片分配到项目
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
        assignImage,
        deleteImage,
    } = useImageManager();

    const [activeImage, setActiveImage] = useState<ImageInfo | null>(null);
    const [filter, setFilter] = useState<'all' | 'hasImages' | 'noImages'>('all');
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const sensors = useSensors(
        useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
        useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } })
    );

    const handleDragStart = (event: DragStartEvent) => {
        const image = pendingImages.find(img => img.filename === event.active.id);
        setActiveImage(image || null);
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        setActiveImage(null);
        const { active, over } = event;

        if (!over) return;

        const [projectId, slot] = (over.id as string).split('::');
        if (projectId && slot) {
            try {
                await assignImage(active.id as string, projectId, slot as 'cover' | 'gallery');
                toast.success(slot === 'cover' ? `已设为 ${projectId} 封面` : `已添加到 ${projectId} Gallery`);
            } catch {
                toast.error('分配失败');
            }
        }
    };

    // 过滤项目
    const filteredProjects = projects.filter(project => {
        const hasImages = project.rawImages.cover || project.rawImages.gallery.length > 0;
        if (filter === 'hasImages' && !hasImages) return false;
        if (filter === 'noImages' && hasImages) return false;
        if (search && !project.id.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
    });

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
        <PageLayout title="📥 分拣" description="拖拽图片到项目卡片进行分配">
            <DndContext
                sensors={sensors}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                {/* 待分配区域 */}
                <PendingZone
                    images={pendingImages}
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
                        <ProjectDropZone key={project.id} project={project} />
                    ))}
                </div>

                {/* 拖拽预览 */}
                <DragOverlay>
                    {activeImage && (
                        <div className="drag-preview">
                            <img src={activeImage.url} alt="" />
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
    onUpload,
    onDelete,
}: {
    images: ImageInfo[];
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
                        <DraggableImage key={img.filename} image={img} onDelete={onDelete} />
                    ))
                )}
            </div>
        </section>
    );
}

// 可拖拽的图片
function DraggableImage({ image, onDelete }: { image: ImageInfo; onDelete: (filename: string) => Promise<void> }) {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: image.filename,
    });

    return (
        <div
            ref={setNodeRef}
            className={`pending-image ${isDragging ? 'dragging' : ''}`}
            {...listeners}
            {...attributes}
        >
            <img src={image.url} alt="" />
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

// 项目放置区
function ProjectDropZone({ project }: { project: Project }) {
    const coverDroppable = useDroppable({ id: `${project.id}::cover` });
    const galleryDroppable = useDroppable({ id: `${project.id}::gallery` });

    const hasCover = !!project.rawImages.cover;
    const galleryCount = project.rawImages.gallery.length;

    return (
        <div className="project-drop-zone">
            <div className="project-header">
                <span className={`status-dot ${hasCover ? 'has-cover' : ''}`}></span>
                <span className="project-id">{project.id}</span>
            </div>

            {/* 封面区 */}
            <div
                ref={coverDroppable.setNodeRef}
                className={`cover-drop ${hasCover ? 'has-image' : ''} ${coverDroppable.isOver ? 'dragover' : ''}`}
            >
                {hasCover ? (
                    <img src={project.rawImages.cover!.url} alt="cover" />
                ) : (
                    <span className="drop-hint">📷 封面</span>
                )}
            </div>

            {/* Gallery 区 */}
            <div
                ref={galleryDroppable.setNodeRef}
                className={`gallery-drop ${galleryDroppable.isOver ? 'dragover' : ''}`}
            >
                {galleryCount > 0 ? (
                    <div className="gallery-preview">
                        {project.rawImages.gallery.slice(0, 3).map((img, i) => (
                            <img key={i} src={img.url} alt="" />
                        ))}
                        {galleryCount > 3 && <span className="more">+{galleryCount - 3}</span>}
                    </div>
                ) : (
                    <span className="drop-hint">🖼 Gallery</span>
                )}
            </div>
        </div>
    );
}

export default AssignPage;
