/**
 * 项目网格组件
 */

import { useImageManager } from '../store/useImageManager';
import ProjectCard from './ProjectCard';
import './ProjectGrid.css';

function ProjectGrid() {
    const { projects } = useImageManager();

    // 统计有图片的项目数
    const projectsWithImages = projects.filter(
        p => p.rawImages.cover || p.rawImages.gallery.length > 0
    ).length;

    return (
        <section className="projects-section">
            <div className="projects-header">
                <h2>
                    📁 项目卡片
                    <span className="projects-count">{projects.length}</span>
                </h2>
                <p className="projects-stats">
                    已配置图片: <span className="stat-value">{projectsWithImages}</span> / {projects.length}
                </p>
            </div>

            <div className="projects-grid">
                {projects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                ))}
            </div>
        </section>
    );
}

export default ProjectGrid;
