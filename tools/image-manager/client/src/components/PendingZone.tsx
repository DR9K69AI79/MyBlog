/**
 * 待分配图片区域组件
 */

import { useRef, useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import toast from 'react-hot-toast';
import { useImageManager } from '../store/useImageManager';
import { ImageInfo } from '../api/client';
import './PendingZone.css';

function PendingZone() {
    const { pendingImages, uploadImages, deleteImage } = useImageManager();
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // 处理文件拖放
    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            try {
                await uploadImages(files);
                toast.success(`成功导入 ${files.length} 张图片`);
            } catch (err) {
                toast.error('导入失败');
            }
        }
    };

    // 处理文件选择
    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            try {
                await uploadImages(files);
                toast.success(`成功导入 ${files.length} 张图片`);
            } catch (err) {
                toast.error('导入失败');
            }
        }
        // 清空 input 以便可以再次选择相同文件
        e.target.value = '';
    };

    // 处理粘贴
    const handlePaste = async (e: React.ClipboardEvent) => {
        const items = e.clipboardData.items;
        const imageFiles: File[] = [];

        for (const item of items) {
            if (item.type.startsWith('image/')) {
                const file = item.getAsFile();
                if (file) imageFiles.push(file);
            }
        }

        if (imageFiles.length > 0) {
            const dataTransfer = new DataTransfer();
            imageFiles.forEach(f => dataTransfer.items.add(f));
            try {
                await uploadImages(dataTransfer.files);
                toast.success(`成功粘贴 ${imageFiles.length} 张图片`);
            } catch (err) {
                toast.error('粘贴失败');
            }
        }
    };

    return (
        <section
            className={`pending-zone ${isDragOver ? 'dragover' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            onPaste={handlePaste}
            tabIndex={0}
        >
            <div className="pending-header">
                <h2>
                    📥 待分配图片
                    <span className="pending-count">{pendingImages.length}</span>
                </h2>
                <button
                    className="btn btn-secondary"
                    onClick={() => fileInputRef.current?.click()}
                >
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

            <div className={`pending-images ${pendingImages.length === 0 ? 'empty' : ''}`}>
                {pendingImages.length === 0 ? (
                    <div className="pending-placeholder">
                        <span className="placeholder-icon">📷</span>
                        <p>拖拽图片到此处，或点击选择文件</p>
                        <p className="placeholder-hint">也可以使用 Ctrl+V 粘贴截图</p>
                    </div>
                ) : (
                    pendingImages.map((img) => (
                        <PendingImage key={img.filename} image={img} onDelete={deleteImage} />
                    ))
                )}
            </div>
        </section>
    );
}

// 可拖拽的待分配图片
function PendingImage({
    image,
    onDelete
}: {
    image: ImageInfo;
    onDelete: (filename: string) => void;
}) {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: image.filename,
        data: { image, type: 'pending' },
    });

    const formatSize = (bytes: number) => {
        if (bytes < 1024) return bytes + 'B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + 'KB';
        return (bytes / (1024 * 1024)).toFixed(1) + 'MB';
    };

    return (
        <div
            ref={setNodeRef}
            className={`pending-image ${isDragging ? 'dragging' : ''}`}
            {...listeners}
            {...attributes}
        >
            <img src={image.url} alt={image.filename} />
            <div className="pending-image-info">
                <span className="pending-image-size">{formatSize(image.size)}</span>
            </div>
            <button
                className="pending-image-delete"
                onClick={(e) => {
                    e.stopPropagation();
                    if (confirm('确定删除这张图片？')) {
                        onDelete(image.filename);
                    }
                }}
            >
                ×
            </button>
        </div>
    );
}

export default PendingZone;
