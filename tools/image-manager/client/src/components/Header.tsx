/**
 * 顶部工具栏组件
 */

import { useImageManager } from '../store/useImageManager';
import './Header.css';

function Header() {
    const { quality, updateSettings, fetchData } = useImageManager();

    return (
        <header className="header">
            <div className="header-left">
                <h1 className="header-title">
                    <span className="header-icon">📸</span>
                    项目图片管理器
                </h1>
                <span className="header-badge">v2.0</span>
            </div>

            <div className="header-controls">
                <div className="control-group">
                    <label htmlFor="quality">压缩质量:</label>
                    <input
                        type="range"
                        id="quality"
                        min="10"
                        max="100"
                        value={quality}
                        onChange={(e) => updateSettings({ quality: parseInt(e.target.value) })}
                    />
                    <span className="control-value">{quality}%</span>
                </div>

                <button className="btn btn-secondary" onClick={() => fetchData()}>
                    🔄 刷新
                </button>
            </div>
        </header>
    );
}

export default Header;
