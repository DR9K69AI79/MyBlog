/**
 * 底部操作栏组件
 */

import { useState } from 'react';
import toast from 'react-hot-toast';
import { useImageManager } from '../store/useImageManager';
import './Footer.css';

function Footer() {
    const { projects, pendingImages, publish, quality } = useImageManager();
    const [isPublishing, setIsPublishing] = useState(false);

    // 统计数据
    const coverCount = projects.filter(p => p.rawImages.cover).length;
    const galleryCount = projects.reduce((sum, p) => sum + p.rawImages.gallery.length, 0);
    const totalImages = coverCount + galleryCount;

    const handlePublish = async () => {
        if (totalImages === 0) {
            toast.error('没有可发布的图片');
            return;
        }

        setIsPublishing(true);
        try {
            const result = await publish();
            if (result.success) {
                toast.success(`成功发布 ${result.published} 张图片！`);
                if (result.failed > 0) {
                    toast.error(`${result.failed} 张图片发布失败`);
                }
            }
        } catch (err) {
            toast.error('发布失败');
        } finally {
            setIsPublishing(false);
        }
    };

    return (
        <footer className="footer">
            <div className="footer-stats">
                <div className="stat">
                    <span className="stat-label">待分配:</span>
                    <span className="stat-value pending">{pendingImages.length}</span>
                </div>
                <div className="stat">
                    <span className="stat-label">封面:</span>
                    <span className="stat-value cover">{coverCount}</span>
                </div>
                <div className="stat">
                    <span className="stat-label">Gallery:</span>
                    <span className="stat-value gallery">{galleryCount}</span>
                </div>
                <div className="stat">
                    <span className="stat-label">压缩质量:</span>
                    <span className="stat-value quality">{quality}%</span>
                </div>
            </div>

            <div className="footer-actions">
                <button
                    className="btn btn-success publish-btn"
                    onClick={handlePublish}
                    disabled={isPublishing || totalImages === 0}
                >
                    {isPublishing ? (
                        <>
                            <span className="spinner"></span>
                            发布中...
                        </>
                    ) : (
                        <>
                            🚀 发布到 public/projects/
                        </>
                    )}
                </button>
            </div>
        </footer>
    );
}

export default Footer;
