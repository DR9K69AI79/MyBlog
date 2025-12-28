/**
 * 发布页面
 * 预览并发布处理后的图片
 */

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import PageLayout from '../components/layout/PageLayout';
import { useImageManager } from '../store/useImageManager';
import { Project } from '../api/client';
import './PublishPage.css';

interface PublishLog {
    time: string;
    message: string;
    type: 'success' | 'error' | 'info';
}

function PublishPage() {
    const {
        projects,
        fetchData,
        isLoading,
        publish,
        quality,
        maxWidth,
        updateSettings,
    } = useImageManager();

    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [isPublishing, setIsPublishing] = useState(false);
    const [logs, setLogs] = useState<PublishLog[]>([]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // 筛选有图片的项目
    const publishableProjects = projects.filter(
        p => p.rawImages.cover || p.rawImages.gallery.length > 0
    );

    // 默认全选
    useEffect(() => {
        setSelectedIds(new Set(publishableProjects.map(p => p.id)));
    }, [projects]);

    const toggleProject = (id: string) => {
        const newSet = new Set(selectedIds);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        setSelectedIds(newSet);
    };

    const toggleAll = () => {
        if (selectedIds.size === publishableProjects.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(publishableProjects.map(p => p.id)));
        }
    };

    const addLog = (message: string, type: 'success' | 'error' | 'info') => {
        setLogs(prev => [...prev, {
            time: new Date().toLocaleTimeString(),
            message,
            type,
        }]);
    };

    const handlePublish = async () => {
        if (selectedIds.size === 0) {
            toast.error('请选择要发布的项目');
            return;
        }

        setIsPublishing(true);
        setLogs([]);

        addLog(`开始发布 ${selectedIds.size} 个项目...`, 'info');

        try {
            const result = await publish();

            if (result.success) {
                addLog(`✓ 发布完成: ${result.published} 张图片`, 'success');
                if (result.failed > 0) {
                    addLog(`✗ 失败: ${result.failed} 张`, 'error');
                }
                toast.success(`发布完成！${result.published} 张图片`);
            }
        } catch (err) {
            addLog(`发布失败: ${(err as Error).message}`, 'error');
            toast.error('发布失败');
        } finally {
            setIsPublishing(false);
        }
    };

    // 统计
    const totalImages = publishableProjects
        .filter(p => selectedIds.has(p.id))
        .reduce((sum, p) => {
            return sum + (p.rawImages.cover ? 1 : 0) + p.rawImages.gallery.length;
        }, 0);

    if (isLoading) {
        return (
            <PageLayout title="🚀 发布" description="压缩并发布图片">
                <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>加载中...</p>
                </div>
            </PageLayout>
        );
    }

    return (
        <PageLayout
            title="🚀 发布"
            description="将原始图片处理后发布到 public/projects/"
            footer={
                <button
                    className="btn btn-primary btn-lg"
                    onClick={handlePublish}
                    disabled={isPublishing || selectedIds.size === 0}
                >
                    {isPublishing ? '发布中...' : `🚀 发布 ${totalImages} 张图片`}
                </button>
            }
        >
            <div className="publish-layout">
                {/* 左侧：设置和项目列表 */}
                <div className="publish-main">
                    {/* 发布设置 */}
                    <section className="settings-section">
                        <h3>发布设置</h3>
                        <div className="settings-grid">
                            <div className="setting-item">
                                <label>压缩质量</label>
                                <div className="slider-control">
                                    <input
                                        type="range"
                                        min="10"
                                        max="100"
                                        value={quality}
                                        onChange={(e) => updateSettings({ quality: parseInt(e.target.value) })}
                                    />
                                    <span className="slider-value">{quality}%</span>
                                </div>
                            </div>
                            <div className="setting-item">
                                <label>最大宽度</label>
                                <div className="input-control">
                                    <input
                                        type="number"
                                        value={maxWidth}
                                        onChange={(e) => updateSettings({ maxWidth: parseInt(e.target.value) })}
                                    />
                                    <span className="input-suffix">px</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 项目列表 */}
                    <section className="projects-section">
                        <div className="section-header">
                            <h3>待发布项目</h3>
                            <button className="btn btn-text" onClick={toggleAll}>
                                {selectedIds.size === publishableProjects.length ? '取消全选' : '全选'}
                            </button>
                        </div>

                        {publishableProjects.length === 0 ? (
                            <div className="empty-state">
                                <p>暂无可发布的项目</p>
                                <p>请先在「分拣」页面分配图片</p>
                            </div>
                        ) : (
                            <div className="project-list">
                                {publishableProjects.map(project => (
                                    <ProjectItem
                                        key={project.id}
                                        project={project}
                                        selected={selectedIds.has(project.id)}
                                        onToggle={() => toggleProject(project.id)}
                                    />
                                ))}
                            </div>
                        )}
                    </section>
                </div>

                {/* 右侧：发布日志 */}
                <aside className="publish-sidebar">
                    <h3>发布日志</h3>
                    <div className="log-container">
                        {logs.length === 0 ? (
                            <div className="log-empty">等待发布...</div>
                        ) : (
                            logs.map((log, idx) => (
                                <div key={idx} className={`log-item ${log.type}`}>
                                    <span className="log-time">{log.time}</span>
                                    <span className="log-message">{log.message}</span>
                                </div>
                            ))
                        )}
                    </div>
                </aside>
            </div>
        </PageLayout>
    );
}

// 项目列表项
function ProjectItem({
    project,
    selected,
    onToggle,
}: {
    project: Project;
    selected: boolean;
    onToggle: () => void;
}) {
    const coverCount = project.rawImages.cover ? 1 : 0;
    const galleryCount = project.rawImages.gallery.length;

    return (
        <label className={`project-item ${selected ? 'selected' : ''}`}>
            <input
                type="checkbox"
                checked={selected}
                onChange={onToggle}
            />
            <div className="project-info">
                <span className="project-name">{project.id}</span>
                <span className="project-stats">
                    {coverCount > 0 && <span>封面</span>}
                    {galleryCount > 0 && <span>{galleryCount} 张 Gallery</span>}
                </span>
            </div>
            {project.hasPublishedAssets && (
                <span className="published-badge">已发布</span>
            )}
        </label>
    );
}

export default PublishPage;
