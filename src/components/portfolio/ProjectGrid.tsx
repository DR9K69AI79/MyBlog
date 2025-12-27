import { motion } from 'framer-motion'
import { ProjectCard } from './ProjectCard'
import type { ProjectData } from './types'

interface ProjectGridProps {
    projects: ProjectData[]
}

export function ProjectGrid({ projects }: ProjectGridProps) {
    // 动画容器变体
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08,
            },
        },
    }

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6"
        >
            {projects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
            ))}
        </motion.div>
    )
}
