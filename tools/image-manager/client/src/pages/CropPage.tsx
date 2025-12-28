/**
 * 裁剪页面
 * 精细调整每张图片的裁剪区域
 */

import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import toast from 'react-hot-toast';
import PageLayout from '../components/layout/PageLayout';
import { useImageManager } from '../store/useImageManager';
import { ImageInfo, imagesApi, CropData } from '../api/client';
import './CropPage.css';

function CropPage() {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const { projects, fetchData, isLoading, saveCrop } = useImageManager();

    const [selectedProjectId, setSelectedProjectId] = useState<string>(projectId || '');
    const [images, setImages] = useState<ImageInfo[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [aspectRatio, setAspectRatio] = useState(16 / 9);
    const [savedCropData, setSavedCropData] = useState<CropData | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const cropperRef = useRef<any>(null);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // 加载项目图片
    useEffect(() => {
        if (selectedProjectId && projects.length > 0) {
            const project = projects.find(p => p.id === selectedProjectId);
            if (project) {
                const allImages: ImageInfo[] = [];
                if (project.rawImages.cover) {
                    allImages.push({ ...project.rawImages.cover, caption: '封面' });
                }
                allImages.push(...project.rawImages.gallery);
                setImages(allImages);
                setCurrentIndex(0);
            }
        }
    }, [selectedProjectId, projects]);

    // 加载已保存的裁剪数据
    useEffect(() => {
        if (images[currentIndex]) {
            imagesApi.getCrop(images[currentIndex].filename).then(({ cropData }) => {
                setSavedCropData(cropData);
            });
        }
    }, [currentIndex, images]);

    // 应用已保存的裁剪数据
    useEffect(() => {
        if (savedCropData && cropperRef.current) {
            const cropper = cropperRef.current.cropper;
            if (cropper) {
                setTimeout(() => {
                    cropper.setData(savedCropData);
                }, 200);
            }
        }
    }, [savedCropData]);

    const currentImage = images[currentIndex];

    const handleSave = async () => {
        if (!currentImage || !cropperRef.current) return;

        const cropper = cropperRef.current.cropper;
        const data = cropper.getData();
        const cropData: CropData = {
            x: data.x,
            y: data.y,
            width: data.width,
            height: data.height,
            rotate: data.rotate,
        };

        setIsSaving(true);
        try {
            await saveCrop(currentImage.filename, cropData);
            toast.success('裁剪已保存');
        } catch {
            toast.error('保存失败');
        } finally {
            setIsSaving(false);
        }
    };

    const handleAspectRatioChange = (ratio: number) => {
        setAspectRatio(ratio);
        const cropper = cropperRef.current?.cropper;
        if (cropper) {
            cropper.setAspectRatio(ratio);
        }
    };

    const handleRotate = (angle: number) => {
        const cropper = cropperRef.current?.cropper;
        if (cropper) {
            cropper.rotate(angle);
        }
    };

    const handleReset = () => {
        const cropper = cropperRef.current?.cropper;
        if (cropper) {
            cropper.reset();
        }
    };

    const projectsWithImages = projects.filter(
        p => p.rawImages.cover || p.rawImages.gallery.length > 0
    );

    if (isLoading) {
        return (
            <PageLayout title="✂️ 裁剪" description="精细调整图片裁剪区域">
                <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>加载中...</p>
                </div>
            </PageLayout>
        );
    }

    return (
        <PageLayout
            title="✂️ 裁剪"
            description="调整裁剪区域，发布时会自动应用"
            footer={
                currentImage && (
                    <button
                        className="btn btn-primary"
                        onClick={handleSave}
                        disabled={isSaving}
                    >
                        {isSaving ? '保存中...' : '💾 保存裁剪'}
                    </button>
                )
            }
        >
            <div className="crop-layout">
                {/* 左侧：项目和图片选择 */}
                <aside className="crop-sidebar">
                    <div className="sidebar-section">
                        <label>选择项目</label>
                        <select
                            value={selectedProjectId}
                            onChange={(e) => {
                                setSelectedProjectId(e.target.value);
                                navigate(`/crop/${e.target.value}`);
                            }}
                        >
                            <option value="">请选择项目</option>
                            {projectsWithImages.map(p => (
                                <option key={p.id} value={p.id}>{p.id}</option>
                            ))}
                        </select>
                    </div>

                    {images.length > 0 && (
                        <div className="sidebar-section">
                            <label>图片列表 ({currentIndex + 1}/{images.length})</label>
                            <div className="thumbnail-list">
                                {images.map((img, idx) => (
                                    <button
                                        key={img.filename}
                                        className={`thumbnail ${idx === currentIndex ? 'active' : ''}`}
                                        onClick={() => setCurrentIndex(idx)}
                                    >
                                        <img src={img.url} alt="" />
                                        <span className="thumb-index">{idx + 1}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </aside>

                {/* 右侧：裁剪区域 */}
                <main className="crop-main">
                    {currentImage ? (
                        <>
                            <div className="cropper-container">
                                <Cropper
                                    ref={cropperRef}
                                    src={currentImage.url}
                                    style={{ height: '100%', width: '100%' }}
                                    aspectRatio={aspectRatio}
                                    viewMode={1}
                                    autoCropArea={0.9}
                                    responsive={true}
                                    guides={true}
                                />
                            </div>

                            <div className="crop-controls">
                                <div className="control-group">
                                    <span className="control-label">比例:</span>
                                    <button
                                        className={aspectRatio === 16 / 9 ? 'active' : ''}
                                        onClick={() => handleAspectRatioChange(16 / 9)}
                                    >
                                        16:9
                                    </button>
                                    <button
                                        className={aspectRatio === 4 / 3 ? 'active' : ''}
                                        onClick={() => handleAspectRatioChange(4 / 3)}
                                    >
                                        4:3
                                    </button>
                                    <button
                                        className={aspectRatio === 1 ? 'active' : ''}
                                        onClick={() => handleAspectRatioChange(1)}
                                    >
                                        1:1
                                    </button>
                                    <button
                                        className={!aspectRatio ? 'active' : ''}
                                        onClick={() => handleAspectRatioChange(NaN)}
                                    >
                                        自由
                                    </button>
                                </div>

                                <div className="control-group">
                                    <span className="control-label">旋转:</span>
                                    <button onClick={() => handleRotate(-90)}>↺ -90°</button>
                                    <button onClick={() => handleRotate(90)}>↻ +90°</button>
                                    <button onClick={handleReset}>🔄 重置</button>
                                </div>

                                <div className="nav-controls">
                                    <button
                                        disabled={currentIndex === 0}
                                        onClick={() => setCurrentIndex(i => i - 1)}
                                    >
                                        ◀ 上一张
                                    </button>
                                    <button
                                        disabled={currentIndex === images.length - 1}
                                        onClick={() => setCurrentIndex(i => i + 1)}
                                    >
                                        下一张 ▶
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="no-image">
                            <p>请选择项目和图片</p>
                        </div>
                    )}
                </main>
            </div>
        </PageLayout>
    );
}

export default CropPage;
