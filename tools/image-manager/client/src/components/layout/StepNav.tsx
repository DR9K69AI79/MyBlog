/**
 * 步骤导航组件
 * 显示当前工作流步骤
 */

import { NavLink } from 'react-router-dom';
import './StepNav.css';

const steps = [
    { path: '/assign', label: '📥 分拣', description: '分配图片到项目' },
    { path: '/organize', label: '🔢 排序', description: '调整顺序和标注' },
    { path: '/crop', label: '✂️ 裁剪', description: '精细裁剪调整' },
    { path: '/publish', label: '🚀 发布', description: '压缩并发布' },
];

function StepNav() {
    return (
        <nav className="step-nav">
            <div className="step-nav-brand">
                <span className="brand-icon">📸</span>
                <span className="brand-text">图片管理器</span>
            </div>

            <div className="step-nav-steps">
                {steps.map((step, index) => (
                    <NavLink
                        key={step.path}
                        to={step.path}
                        className={({ isActive }) =>
                            `step-item ${isActive ? 'active' : ''}`
                        }
                    >
                        <span className="step-number">{index + 1}</span>
                        <span className="step-label">{step.label}</span>
                    </NavLink>
                ))}
            </div>

            <div className="step-nav-actions">
                <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => window.location.reload()}
                >
                    🔄 刷新
                </button>
            </div>
        </nav>
    );
}

export default StepNav;
