import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import type { ProjectData, GalleryItem } from './types'
import { withBase } from '../../utils/path'

interface ProjectCardProps {
    project: ProjectData
    index: number
}

export function ProjectCard({ project, index }: ProjectCardProps) {
    const [isHovered, setIsHovered] = useState(false)
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
    const cardRef = useRef<HTMLDivElement>(null)

    // 获取封面图：优先使用 gallery 第一张，否则使用 cover
    const coverImage = project.gallery?.[0]?.url || project.cover || '/placeholder-project.jpg'
    const previewImages = project.gallery?.slice(0, 4) || []

    // 计算鼠标位置用于光效
    const handleMouseMove = (e: React.MouseEvent) => {
        if (!cardRef.current) return
        const rect = cardRef.current.getBoundingClientRect()
        setMousePosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        })
    }

    // 状态标签颜色
    const statusColors = {
        completed: 'bg-green-500/20 text-green-400 border-green-500/30',
        'in-progress': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        archived: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    }

    const statusLabels = {
        completed: '已完成',
        'in-progress': '进行中',
        archived: '已归档',
    }

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onMouseMove={handleMouseMove}
            className="group relative"
        >
            {/* 光效背景 */}
            <motion.div
                className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                    background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(var(--color-accent), 0.15), transparent 40%)`,
                }}
            />

            {/* 渐变边框 */}
            <motion.div
                className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                    background: 'linear-gradient(135deg, rgba(var(--color-accent), 0.5), transparent 50%, rgba(var(--color-accent), 0.3))',
                    mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    maskComposite: 'xor',
                    WebkitMaskComposite: 'xor',
                    padding: '1px',
                }}
            />

            {/* 卡片内容 */}
            <a
                href={withBase(`/projects/${project.id}`)}
                className="relative block rounded-2xl bg-secondary overflow-hidden"
            >
                {/* 封面图区域 */}
                <div className="relative aspect-video overflow-hidden">
                    {/* 主封面 */}
                    <motion.img
                        src={coverImage}
                        alt={project.displayName}
                        className="size-full object-cover"
                        animate={{
                            scale: isHovered ? 1.05 : 1,
                        }}
                        transition={{ duration: 0.4 }}
                    />

                    {/* 悬停时的图库预览网格 */}
                    {previewImages.length > 1 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: isHovered ? 1 : 0 }}
                            transition={{ duration: 0.3 }}
                            className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-1 p-1 bg-black/30 backdrop-blur-sm"
                        >
                            {previewImages.map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{
                                        scale: isHovered ? 1 : 0.8,
                                        opacity: isHovered ? 1 : 0,
                                    }}
                                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                                    className="rounded overflow-hidden"
                                >
                                    {item.type === 'video' ? (
                                        <video className="size-full object-cover" src={item.url} muted loop autoPlay />
                                    ) : (
                                        <img className="size-full object-cover" src={item.url} alt="" loading="lazy" />
                                    )}
                                </motion.div>
                            ))}
                        </motion.div>
                    )}

                    {/* 渐变遮罩 */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* 状态标签 */}
                    {project.status && project.status !== 'completed' && (
                        <span className={`absolute top-3 left-3 px-2 py-1 text-xs font-medium rounded-full border ${statusColors[project.status]}`}>
                            {statusLabels[project.status]}
                        </span>
                    )}

                    {/* 图库数量指示器 */}
                    {project.gallery && project.gallery.length > 1 && (
                        <motion.span
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="absolute top-3 right-3 px-2 py-1 text-xs font-medium rounded-full bg-black/50 text-white backdrop-blur-sm flex items-center gap-1"
                        >
                            <i className="iconfont icon-file-list text-sm" />
                            {project.gallery.length}
                        </motion.span>
                    )}

                    {/* 底部信息 */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                        {/* 时间 */}
                        {project.timeText && (
                            <motion.span
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="inline-block mb-2 text-xs text-white/70"
                            >
                                {project.timeText}
                            </motion.span>
                        )}

                        {/* 标题 */}
                        <motion.h3
                            className="text-xl font-bold text-white line-clamp-1"
                            animate={{ x: isHovered ? 8 : 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            {project.displayName}
                        </motion.h3>
                    </div>
                </div>

                {/* 卡片底部内容 */}
                <div className="p-4 space-y-3">
                    {/* 描述 */}
                    {project.description && (
                        <p className="text-sm text-secondary line-clamp-2">{project.description}</p>
                    )}

                    {/* 标签 */}
                    {project.tags && project.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                            {project.tags.slice(0, 4).map((tag, idx) => (
                                <motion.span
                                    key={tag}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.1 + idx * 0.05 }}
                                    className="px-2 py-0.5 text-xs rounded-md bg-accent/10 text-accent border border-accent/20"
                                >
                                    {tag}
                                </motion.span>
                            ))}
                            {project.tags.length > 4 && (
                                <span className="px-2 py-0.5 text-xs rounded-md bg-primary text-secondary">
                                    +{project.tags.length - 4}
                                </span>
                            )}
                        </div>
                    )}

                    {/* 查看详情 */}
                    <motion.div
                        className="flex items-center gap-2 text-accent text-sm font-medium pt-2"
                        animate={{ x: isHovered ? 8 : 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <span>查看详情</span>
                        <motion.span
                            animate={{
                                x: isHovered ? [0, 4, 0] : 0,
                            }}
                            transition={{
                                duration: 0.6,
                                repeat: isHovered ? Infinity : 0,
                                repeatDelay: 0.2,
                            }}
                        >
                            <i className="iconfont icon-arrow-right" />
                        </motion.span>
                    </motion.div>
                </div>

                {/* 底部高光 */}
                <motion.div
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent"
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{
                        scaleX: isHovered ? 1 : 0,
                        opacity: isHovered ? 1 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                />
            </a>
        </motion.div>
    )
}
