/**
 * 页面布局组件
 * 统一的页面结构
 */

import { ReactNode } from 'react';
import StepNav from './StepNav';
import './PageLayout.css';

interface PageLayoutProps {
    title: string;
    description?: string;
    children: ReactNode;
    footer?: ReactNode;
}

function PageLayout({ title, description, children, footer }: PageLayoutProps) {
    return (
        <div className="page-layout">
            <StepNav />

            <div className="page-header">
                <h1 className="page-title">{title}</h1>
                {description && <p className="page-description">{description}</p>}
            </div>

            <main className="page-content">
                {children}
            </main>

            {footer && (
                <footer className="page-footer">
                    {footer}
                </footer>
            )}
        </div>
    );
}

export default PageLayout;
