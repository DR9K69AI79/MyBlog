/**
 * 标注编辑模态框组件
 */

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useImageManager } from '../store/useImageManager';
import './CaptionModal.css';

function CaptionModal() {
    const { captionModal, closeCaptionModal, updateCaption } = useImageManager();
    const [caption, setCaption] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // 初始化标注值
    useEffect(() => {
        if (captionModal.open && captionModal.image) {
            setCaption(captionModal.image.caption || '');
        }
    }, [captionModal.open, captionModal.image]);

    if (!captionModal.open || !captionModal.image) return null;

    const handleSave = async () => {
        if (!captionModal.image) return;

        setIsSaving(true);
        try {
            await updateCaption(captionModal.image.filename, caption);
            toast.success('标注已更新');
            closeCaptionModal();
        } catch {
            toast.error('保存失败');
        } finally {
            setIsSaving(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSave();
        } else if (e.key === 'Escape') {
            closeCaptionModal();
        }
    };

    return (
        <div className="caption-modal-overlay" onClick={closeCaptionModal}>
            <div className="caption-modal" onClick={(e) => e.stopPropagation()}>
                <div className="caption-modal-header">
                    <h3>✏️ 编辑图片标注</h3>
                    <button className="close-btn" onClick={closeCaptionModal}>×</button>
                </div>

                <div className="caption-modal-body">
                    <div className="caption-preview">
                        <img src={captionModal.image.url} alt="preview" />
                    </div>

                    <div className="caption-form">
                        <label htmlFor="caption-input">
                            标注文字
                            <span className="label-hint">（将显示在发布的文件名中）</span>
                        </label>
                        <input
                            id="caption-input"
                            type="text"
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="例如：游戏开始界面"
                            autoFocus
                        />
                        <p className="caption-help">
                            发布后文件名：<code>{captionModal.image.index}{caption ? `-${caption}` : ''}.webp</code>
                        </p>
                    </div>
                </div>

                <div className="caption-modal-footer">
                    <button
                        className="btn btn-secondary"
                        onClick={closeCaptionModal}
                        disabled={isSaving}
                    >
                        取消
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={handleSave}
                        disabled={isSaving}
                    >
                        {isSaving ? '保存中...' : '保存'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CaptionModal;
