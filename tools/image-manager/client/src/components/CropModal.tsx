/**
 * 裁剪模态框组件
 */

import { useRef, useEffect, useState } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import toast from 'react-hot-toast';
import { useImageManager } from '../store/useImageManager';
import { imagesApi, CropData } from '../api/client';
import './CropModal.css';

function CropModal() {
    const { cropModal, closeCropModal, saveCrop } = useImageManager();
    const cropperRef = useRef<any>(null);
    const [aspectRatio, setAspectRatio] = useState(16 / 9);
    const [savedCropData, setSavedCropData] = useState<CropData | null>(null);
    const [cropInfo, setCropInfo] = useState({ width: 0, height: 0 });

    // 加载已保存的裁剪数据
    useEffect(() => {
        if (cropModal.open && cropModal.image) {
            imagesApi.getCrop(cropModal.image.filename).then(({ cropData }) => {
                setSavedCropData(cropData);
            });
        }
    }, [cropModal.open, cropModal.image]);

    // 应用已保存的裁剪数据
    useEffect(() => {
        if (savedCropData && cropperRef.current) {
            const cropper = cropperRef.current.cropper;
            if (cropper) {
                setTimeout(() => {
                    cropper.setData(savedCropData);
                }, 100);
            }
        }
    }, [savedCropData]);

    if (!cropModal.open || !cropModal.image) return null;

    const handleCrop = () => {
        const cropper = cropperRef.current?.cropper;
        if (cropper) {
            const data = cropper.getData();
            setCropInfo({
                width: Math.round(data.width),
                height: Math.round(data.height),
            });
        }
    };

    const handleSave = async () => {
        const cropper = cropperRef.current?.cropper;
        if (!cropper || !cropModal.image) return;

        const data = cropper.getData();
        const cropData: CropData = {
            x: data.x,
            y: data.y,
            width: data.width,
            height: data.height,
            rotate: data.rotate,
        };

        try {
            await saveCrop(cropModal.image.filename, cropData);
            toast.success('裁剪坐标已保存');
            closeCropModal();
        } catch {
            toast.error('保存失败');
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

    return (
        <div className="crop-modal-overlay" onClick={closeCropModal}>
            <div className="crop-modal" onClick={(e) => e.stopPropagation()}>
                <div className="crop-modal-header">
                    <h2>✂️ 精细裁剪</h2>
                    <button className="btn btn-secondary" onClick={closeCropModal}>
                        ✕ 取消
                    </button>
                </div>

                <div className="crop-modal-body">
                    <Cropper
                        ref={cropperRef}
                        src={cropModal.image.url}
                        style={{ height: '100%', width: '100%' }}
                        aspectRatio={aspectRatio}
                        viewMode={1}
                        autoCropArea={0.9}
                        responsive={true}
                        crop={handleCrop}
                        guides={true}
                    />
                </div>

                <div className="crop-modal-footer">
                    <div className="crop-controls">
                        <button
                            className={`crop-btn ${aspectRatio === 16 / 9 ? 'active' : ''}`}
                            onClick={() => handleAspectRatioChange(16 / 9)}
                        >
                            16:9
                        </button>
                        <button
                            className={`crop-btn ${aspectRatio === 4 / 3 ? 'active' : ''}`}
                            onClick={() => handleAspectRatioChange(4 / 3)}
                        >
                            4:3
                        </button>
                        <button
                            className={`crop-btn ${aspectRatio === 1 ? 'active' : ''}`}
                            onClick={() => handleAspectRatioChange(1)}
                        >
                            1:1
                        </button>
                        <button
                            className={`crop-btn ${!aspectRatio ? 'active' : ''}`}
                            onClick={() => handleAspectRatioChange(NaN)}
                        >
                            自由
                        </button>

                        <span className="crop-divider">|</span>

                        <button className="crop-btn" onClick={() => handleRotate(-90)}>
                            ↺ 左旋
                        </button>
                        <button className="crop-btn" onClick={() => handleRotate(90)}>
                            ↻ 右旋
                        </button>
                        <button className="crop-btn" onClick={handleReset}>
                            🔄 重置
                        </button>
                    </div>

                    <div className="crop-footer-right">
                        <span className="crop-info">
                            选区: {cropInfo.width} × {cropInfo.height}
                        </span>
                        <button className="btn btn-primary" onClick={handleSave}>
                            ✓ 保存裁剪坐标
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CropModal;
