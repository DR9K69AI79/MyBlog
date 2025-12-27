import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import type { ProjectData } from './types'
import { withBase } from '../../utils/path'

// 状态配置
const statusConfig = {
    completed: { color: 'bg-emerald-500', label: '已完成', glow: 'shadow-emerald-500/30' },
    'in-progress': { color: 'bg-amber-500', label: '进行中', glow: 'shadow-amber-500/30' },
    archived: { color: 'bg-slate-500', label: '已归档', glow: 'shadow-slate-500/30' },
}

interface ShowcaseProps {
    project: ProjectData
    align?: 'left' | 'right'
    disableHoverEffects?: boolean  // 移动端禁用内置光效，改用外层统一光效
}

export function ShowcaseGallery({ project, align = 'left', disableHoverEffects = false }: ShowcaseProps) {
    const [activeImage, setActiveImage] = useState(0)
    const images = project.gallery || (project.cover ? [{ url: project.cover, type: 'image' as const }] : [])
    const status = statusConfig[project.status || 'completed']

    // 自动轮播
    useEffect(() => {
        if (images.length <= 1) return
        const timer = setInterval(() => {
            setActiveImage((prev) => (prev + 1) % images.length)
        }, 5000)
        return () => clearInterval(timer)
    }, [images.length])

    // 边框渐变方向
    const gradientAngle = align === 'left' ? 'to left' : 'to right'

    return (
        <motion.div
            className={`relative group h-full ${disableHoverEffects ? '' : 'min-h-[300px]'}`}
            whileHover={{ scale: disableHoverEffects ? 1 : 1.02 }}
            transition={{ duration: 0.3 }}
        >
            {/* 背景光效 - 移动端禁用 */}
            {!disableHoverEffects && (
                <div
                    className="absolute -inset-4 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl"
                    style={{
                        background: align === 'left'
                            ? `linear-gradient(to left, rgb(var(--color-accent) / 0.4), transparent 60%)`
                            : `linear-gradient(to right, rgb(var(--color-accent) / 0.4), transparent 60%)`
                    }}
                />
            )}

            {/* 主图容器 */}
            <div className="relative size-full aspect-video rounded-2xl overflow-hidden bg-secondary shadow-2xl">
                {/* 渐变边框 - 移动端禁用 */}
                {!disableHoverEffects && (
                    <div
                        className="absolute inset-0 rounded-2xl p-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{
                            background: `linear-gradient(${gradientAngle}, rgb(var(--color-accent)), transparent 70%)`,
                        }}
                    >
                        <div className="size-full rounded-2xl bg-secondary" />
                    </div>
                )}

                {/* 图片轮播 */}
                <div className="absolute inset-[2px] rounded-2xl overflow-hidden">
                    {images.map((img, idx) => (
                        <motion.img
                            key={idx}
                            src={img.url}
                            alt={img.caption || project.displayName}
                            className="absolute inset-0 size-full object-cover"
                            initial={false}
                            animate={{
                                opacity: idx === activeImage ? 1 : 0,
                                scale: idx === activeImage ? 1 : 1.1,
                            }}
                            transition={{ duration: 0.7, ease: 'easeInOut' }}
                        />
                    ))}

                    {/* 渐变遮罩 */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </div>

                {/* 图片指示器 */}
                {images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                        {images.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveImage(idx)}
                                className={`h-1.5 rounded-full transition-all duration-300 ${idx === activeImage ? 'w-8 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/60'
                                    }`}
                            />
                        ))}
                    </div>
                )}

                {/* 状态标签 */}
                <div className={`absolute top-4 left-4 px-3 py-1 rounded-full ${status.color} text-white text-xs font-medium shadow-lg ${status.glow}`}>
                    {status.label}
                </div>

                {/* 查看详情按钮 - 使用 accent 色 */}
                <motion.a
                    href={withBase(`/projects/${project.id}`)}
                    className="absolute bottom-4 right-4 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md text-white text-sm font-medium flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-accent hover:text-white"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <span>查看详情</span>
                    <i className="iconfont icon-arrow-right" />
                </motion.a>
            </div>
        </motion.div>
    )
}

interface ShowcaseInfoProps extends ShowcaseProps {
    index: number
}

export function ShowcaseInfo({ project, index, align = 'left' }: ShowcaseInfoProps) {
    const alignClass = align === 'right' ? 'lg:text-right lg:items-end' : 'lg:text-left lg:items-start'

    return (
        <div className={`flex flex-col gap-6 ${alignClass}`}>
            {/* 时间和分类 */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className={`flex items-center gap-3 text-sm text-secondary ${align === 'right' ? 'lg:justify-end' : 'lg:justify-start'}`}
            >
                {project.timeText && (
                    <>
                        <i className="iconfont icon-calendar" />
                        <span>{project.timeText}</span>
                    </>
                )}
                {project.category && (
                    <>
                        <span className="w-1 h-1 rounded-full bg-secondary" />
                        <span>{project.category}</span>
                    </>
                )}
            </motion.div>

            {/* 标题 - 统一使用 text-accent */}
            <motion.h3
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-3xl lg:text-4xl font-bold text-accent"
            >
                {project.displayName}
            </motion.h3>

            {/* 描述 */}
            <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-lg text-secondary leading-relaxed"
            >
                {project.description}
            </motion.p>

            {/* 亮点列表 - 统一颜色 */}
            {project.highlights && project.highlights.length > 0 && (
                <motion.ul
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className={`space-y-2 flex flex-col ${align === 'right' ? 'lg:items-end' : 'lg:items-start'}`}
                >
                    {project.highlights.slice(0, 3).map((highlight, idx) => (
                        <motion.li
                            key={idx}
                            initial={{ opacity: 0, x: align === 'right' ? 20 : -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: 0.5 + idx * 0.1 }}
                            className={`flex items-center gap-3 ${align === 'right' ? 'lg:flex-row-reverse' : ''}`}
                        >
                            <span
                                className="shrink-0 size-2 rounded-full bg-accent"
                            />
                            <span className="text-primary">{highlight}</span>
                        </motion.li>
                    ))}
                </motion.ul>
            )}

            {/* 技术栈标签 */}
            {project.techStack && project.techStack.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className={`flex flex-wrap gap-2 ${align === 'right' ? 'lg:justify-end' : 'lg:justify-start'}`}
                >
                    {project.techStack.slice(0, 6).map((tech) => (
                        <span
                            key={tech}
                            className="px-3 py-1 text-sm rounded-lg border border-primary/20 bg-secondary/50 text-primary backdrop-blur-sm"
                        >
                            {tech}
                        </span>
                    ))}
                </motion.div>
            )}

            {/* 标签云 - 统一颜色 */}
            {project.tags && project.tags.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                    className={`flex flex-wrap gap-2 ${align === 'right' ? 'lg:justify-end' : 'lg:justify-start'}`}
                >
                    {project.tags.map((tag) => (
                        <span
                            key={tag}
                            className="px-2 py-0.5 text-xs rounded-md bg-accent/10 text-accent"
                        >
                            #{tag}
                        </span>
                    ))}
                </motion.div>
            )}
        </div>
    )
}

// 移动端/Legacy 对外暴露的组件，用于保持兼容性或移动端展示
export function ShowcaseCard({ project, index, isLeft }: { project: ProjectData, index: number, isLeft: boolean }) {
    const cardRef = useRef<HTMLDivElement>(null)
    const isInView = useInView(cardRef, { once: true, margin: '-100px' })

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 60 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="space-y-6 group"
        >
            {/* 移动端整体光效 */}
            <div className="relative">
                <div className="absolute -inset-2 rounded-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-500 blur-lg bg-accent/20" />
                <div className="relative ring-0 group-hover:ring-2 ring-accent/50 rounded-2xl transition-all duration-300">
                    <ShowcaseGallery project={project} disableHoverEffects />
                </div>
            </div>
            <ShowcaseInfo project={project} index={index} align="left" />
        </motion.div>
    )
}
