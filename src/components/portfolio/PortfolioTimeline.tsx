import { useRef } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { ShowcaseCard, ShowcaseGallery, ShowcaseInfo } from './ShowcaseCard'
import type { ProjectData } from './types'

interface PortfolioTimelineProps {
    projects: ProjectData[]
}

export function PortfolioTimeline({ projects }: PortfolioTimelineProps) {
    const containerRef = useRef<HTMLDivElement>(null)

    // 进度条动画
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start center', 'end center'],
    })

    const scaleY = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001,
    })

    return (
        <div ref={containerRef} className="relative">
            {/* PC 端时间线轴背景 - 绝对定位居中 */}
            <div className="absolute left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 hidden lg:block">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/20 to-transparent" />
                <motion.div
                    className="absolute top-0 left-0 right-0 origin-top bg-gradient-to-b from-accent via-accent to-transparent"
                    style={{ scaleY, height: '100%' }}
                />
            </div>

            <div className="space-y-24 lg:space-y-0">
                {projects.map((project, index) => {
                    const isEven = index % 2 === 0

                    return (
                        <div key={project.id} id={`project-${project.id}`} className="relative group scroll-mt-24 transition-all duration-300">
                            {/* 移动端布局 */}
                            <div className="lg:hidden">
                                <ShowcaseCard project={project} index={index} isLeft={true} />
                            </div>

                            {/* PC 端拆分式布局 (Grid) */}
                            {/* grid-cols-[1fr_80px_1fr]: 左内容，中间轴(80px)，右内容 */}
                            <div className="hidden lg:grid grid-cols-[1fr_80px_1fr] gap-x-0 items-center min-h-[500px] py-16">

                                {/* 左列 */}
                                <div className="relative pl-8">
                                    {isEven ? (
                                        // 偶数行左侧：显示图片 (Align Letf -> Timeline Right)
                                        // 图片在左，所以 align='left'
                                        <ShowcaseGallery project={project} align="left" />
                                    ) : (
                                        // 奇数行左侧：显示信息 (向右对齐)
                                        <ShowcaseInfo project={project} index={index} align="right" />
                                    )}
                                </div>

                                {/* 中间列：节点 */}
                                <div className="relative h-full flex justify-center items-center">
                                    <motion.div
                                        initial={{ scale: 0, opacity: 0 }}
                                        whileInView={{ scale: 1, opacity: 1 }}
                                        viewport={{ once: true, margin: '-100px' }}
                                        transition={{ duration: 0.5 }}
                                        className="relative z-10 flex items-center justify-center"
                                    >
                                        {/* 光晕 - 统一使用 accent */}
                                        <div
                                            className="absolute size-12 rounded-full blur-xl opacity-40 transition-opacity duration-300 group-hover:opacity-80 bg-accent"
                                        />
                                        {/* 环 - 统一使用 accent */}
                                        <div
                                            className="absolute size-8 rounded-full border-2 opacity-50 transition-all duration-300 group-hover:scale-125 border-accent"
                                        />
                                        {/* 点 - 统一使用 accent */}
                                        <motion.div
                                            className="relative size-4 rounded-full shadow-lg bg-accent"
                                            whileHover={{ scale: 1.5 }}
                                        />
                                    </motion.div>
                                </div>

                                {/* 右列 */}
                                <div className="relative pr-8">
                                    {isEven ? (
                                        // 偶数行右侧：显示信息 (向左对齐)
                                        <ShowcaseInfo project={project} index={index} align="left" />
                                    ) : (
                                        // 奇数行右侧：显示图片 (Align Right -> Timeline Left)
                                        // 图片在右，所以 align='right'
                                        <ShowcaseGallery project={project} align="right" />
                                    )}
                                </div>

                            </div>
                        </div>
                    )
                })}
            </div>

            {/* 底部与未来展望 */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mt-24 text-center"
            >
                <div className="inline-flex items-center gap-4 px-6 py-3 rounded-full bg-secondary/50 backdrop-blur-sm border border-primary/10">
                    <motion.div
                        className="size-3 rounded-full bg-accent"
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.5, 1, 0.5],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    />
                    <span className="text-secondary text-sm">未来：探索更多可能性...</span>
                </div>
            </motion.div>
        </div>
    )
}
