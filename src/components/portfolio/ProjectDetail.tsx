import { motion } from 'framer-motion'
import { ImageGallery } from './ImageGallery'
import type { ProjectData, ProjectLink } from './types'
import { withBase } from '../../utils/path'

interface ProjectDetailProps {
    project: ProjectData
}

// 链接类型配置（图标使用 iconfont.css 中定义的）
const linkConfig: Record<ProjectLink['type'], { icon: string; label: string; primary?: boolean }> = {
    github: { icon: 'icon-github', label: '查看源码', primary: true },
    report: { icon: 'icon-file-list', label: '相关文章' },
    video: { icon: 'icon-bilibili', label: '视频演示' },
    demo: { icon: 'icon-rocket', label: '在线演示', primary: true },
    docs: { icon: 'icon-contacts-book', label: '文档' },
    download: { icon: 'icon-down', label: '下载' },
    post: { icon: 'icon-pen', label: '查看文章' },
}

export function ProjectDetail({ project }: ProjectDetailProps) {
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

    // 准备图库数据：如果没有 gallery，使用 cover 作为唯一图片
    const galleryItems = project.gallery || (project.cover ? [{ url: project.cover, type: 'image' as const }] : [])

    // 合并 links：如果有 projectUrl 但没有 links，生成兼容的 github 链接
    const allLinks: ProjectLink[] = project.links || (project.projectUrl ? [{ type: 'github', url: project.projectUrl }] : [])

    // 获取主要按钮（第一个 primary 类型或第一个链接）
    const primaryLink = allLinks.find(l => linkConfig[l.type]?.primary) || allLinks[0]

    return (
        <div className="space-y-12">
            {/* 头部区域 */}
            <motion.header
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-4"
            >
                {/* 返回按钮 */}
                <motion.a
                    href={withBase('/projects')}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="inline-flex items-center gap-2 text-secondary hover:text-accent transition-colors group"
                >
                    <motion.span
                        animate={{ x: 0 }}
                        whileHover={{ x: -4 }}
                        className="inline-block"
                    >
                        <i className="iconfont icon-arrow-left" />
                    </motion.span>
                    <span>返回项目列表</span>
                </motion.a>

                {/* 标题区域 */}
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="space-y-2">
                        <h1 className="text-4xl md:text-5xl font-bold">{project.displayName}</h1>
                        <div className="flex flex-wrap items-center gap-3">
                            {project.timeText && (
                                <span className="text-secondary text-sm">{project.timeText}</span>
                            )}
                            {project.status && (
                                <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${statusColors[project.status]}`}>
                                    {statusLabels[project.status]}
                                </span>
                            )}
                            {project.category && (
                                <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-accent/10 text-accent border border-accent/20">
                                    {project.category}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* 动态链接按钮 */}
                    {primaryLink && (
                        <motion.a
                            href={primaryLink.url}
                            target={primaryLink.url.startsWith('http') ? '_blank' : undefined}
                            rel={primaryLink.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-white font-medium shadow-lg shadow-accent/20 hover:shadow-accent/40 transition-shadow"
                        >
                            <i className={`iconfont ${linkConfig[primaryLink.type].icon} text-lg`} />
                            <span>{primaryLink.label || linkConfig[primaryLink.type].label}</span>
                            {primaryLink.url.startsWith('http') && <i className="iconfont icon-external-link text-sm" />}
                        </motion.a>
                    )}
                </div>

                {/* 简短描述 */}
                {project.description && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-secondary max-w-3xl"
                    >
                        {project.description}
                    </motion.p>
                )}
            </motion.header>

            {/* 图库区域 */}
            {galleryItems.length > 0 && (
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <ImageGallery
                        items={galleryItems}
                        autoPlay={false}
                        showThumbnails={true}
                        aspectRatio="video"
                    />
                </motion.section>
            )}

            {/* 详细内容网格 */}
            <div className="grid lg:grid-cols-3 gap-8">
                {/* 左侧主内容 */}
                <div className="lg:col-span-2 space-y-8">
                    {/* 详细描述 */}
                    {project.longDescription && (
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="space-y-4"
                        >
                            <h2 className="text-2xl font-bold flex items-center gap-3">
                                <span className="size-1.5 rounded-full bg-accent" />
                                项目介绍
                            </h2>
                            <div className="prose prose-invert max-w-none">
                                <p className="text-secondary leading-relaxed whitespace-pre-wrap">
                                    {project.longDescription}
                                </p>
                            </div>
                        </motion.section>
                    )}

                    {/* 项目亮点 */}
                    {project.highlights && project.highlights.length > 0 && (
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="space-y-4"
                        >
                            <h2 className="text-2xl font-bold flex items-center gap-3">
                                <span className="size-1.5 rounded-full bg-accent" />
                                项目亮点
                            </h2>
                            <ul className="space-y-3">
                                {project.highlights.map((highlight, idx) => (
                                    <motion.li
                                        key={idx}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.5 + idx * 0.1 }}
                                        className="flex items-start gap-3 p-4 rounded-xl bg-secondary/50"
                                    >
                                        <span className="shrink-0 size-6 rounded-lg bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">
                                            {idx + 1}
                                        </span>
                                        <span className="text-primary">{highlight}</span>
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.section>
                    )}
                </div>

                {/* 右侧信息栏 */}
                <div className="space-y-6">
                    {/* 技术栈 */}
                    {project.techStack && project.techStack.length > 0 && (
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="p-6 rounded-2xl bg-secondary space-y-4"
                        >
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <i className="iconfont icon-computer text-accent" />
                                技术栈
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {project.techStack.map((tech, idx) => (
                                    <motion.span
                                        key={tech}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.4 + idx * 0.05 }}
                                        className="px-3 py-1.5 text-sm rounded-lg bg-primary text-primary border border-primary"
                                    >
                                        {tech}
                                    </motion.span>
                                ))}
                            </div>
                        </motion.section>
                    )}

                    {/* 标签 */}
                    {project.tags && project.tags.length > 0 && (
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="p-6 rounded-2xl bg-secondary space-y-4"
                        >
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <i className="iconfont icon-hashtag text-accent" />
                                标签
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {project.tags.map((tag, idx) => (
                                    <motion.span
                                        key={tag}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.5 + idx * 0.05 }}
                                        className="px-3 py-1.5 text-sm rounded-lg bg-accent/10 text-accent border border-accent/20"
                                    >
                                        {tag}
                                    </motion.span>
                                ))}
                            </div>
                        </motion.section>
                    )}

                    {/* 快捷链接 */}
                    {allLinks.length > 0 && (
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="p-6 rounded-2xl bg-secondary space-y-4"
                        >
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <i className="iconfont icon-link text-accent" />
                                快捷链接
                            </h3>
                            <div className="space-y-2">
                                {allLinks.map((link, idx) => {
                                    const config = linkConfig[link.type]
                                    const isExternal = link.url.startsWith('http')
                                    // 站内链接需要加 withBase
                                    const href = isExternal ? link.url : withBase(link.url)
                                    return (
                                        <a
                                            key={idx}
                                            href={href}
                                            target={isExternal ? '_blank' : undefined}
                                            rel={isExternal ? 'noopener noreferrer' : undefined}
                                            className="flex items-center gap-3 p-3 rounded-xl bg-primary hover:bg-accent/10 transition-colors group"
                                        >
                                            <i className={`iconfont ${config.icon} text-xl text-secondary group-hover:text-accent transition-colors`} />
                                            <span className="text-sm text-secondary group-hover:text-accent transition-colors">
                                                {link.label || config.label}
                                            </span>
                                            {isExternal && <i className="iconfont icon-external-link text-xs text-secondary/50 ml-auto" />}
                                        </a>
                                    )
                                })}
                            </div>
                        </motion.section>
                    )}
                </div>
            </div>
        </div>
    )
}
