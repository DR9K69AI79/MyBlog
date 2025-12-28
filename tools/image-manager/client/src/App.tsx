/**
 * 图片管理器主应用
 * 多页面工作流架构
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import AssignPage from './pages/AssignPage';
import OrganizePage from './pages/OrganizePage';
import CropPage from './pages/CropPage';
import PublishPage from './pages/PublishPage';

import './styles/index.css';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/assign" replace />} />
                <Route path="/assign" element={<AssignPage />} />
                <Route path="/organize" element={<OrganizePage />} />
                <Route path="/organize/:projectId" element={<OrganizePage />} />
                <Route path="/crop" element={<CropPage />} />
                <Route path="/crop/:projectId" element={<CropPage />} />
                <Route path="/publish" element={<PublishPage />} />
            </Routes>

            <Toaster
                position="top-right"
                toastOptions={{
                    style: {
                        background: 'var(--bg-card)',
                        color: 'var(--text-primary)',
                        border: '1px solid var(--border)',
                    },
                    success: {
                        iconTheme: {
                            primary: 'var(--success)',
                            secondary: 'white',
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: 'var(--danger)',
                            secondary: 'white',
                        },
                    },
                }}
            />
        </BrowserRouter>
    );
}

export default App;
