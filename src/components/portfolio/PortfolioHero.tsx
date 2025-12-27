import { useRef, useMemo, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion'
import type { ProjectData } from './types'

interface PortfolioHeroProps {
    name: string
    title: string
    subtitle: string
    projectCount: number
    projects?: ProjectData[]
}

// 悬浮元素类型定义
interface FloatingItemData {
    id: string
    type: 'image' | 'tech'
    content: string
    projectId?: string // 用于点击跳转
    x: number
    y: number
    scale: number
    depth: number // 0-1, 1 is closest
}

// 独立的悬浮元素组件
function FloatingElement({
    item,
    mousePos,
    onProjectClick
}: {
    item: FloatingItemData
    mousePos: { x: number, y: number }
    onProjectClick?: (projectId: string) => void
}) {
    // 视差移动系数
    const moveFactor = item.depth * 20

    // 基于鼠标位置的视差偏移
    const x = -mousePos.x * moveFactor
    const y = -mousePos.y * moveFactor

    // 模糊效果
    const blur = (1 - item.depth) * 3

    const handleClick = () => {
        if (item.projectId && onProjectClick) {
            onProjectClick(item.projectId)
        }
    }

    return (
        <motion.div
            className="absolute z-0 pointer-events-auto"
            style={{
                left: `${item.x}%`,
                top: `${item.y}%`,
            }}
            animate={{
                x, y,
                rotate: (mousePos.x * item.depth * 1.5),
            }}
            transition={{ type: 'spring', damping: 50, stiffness: 200 }}
        >
            <motion.div
                className={`relative group ${item.projectId ? 'cursor-pointer' : 'cursor-default'}`}
                initial={{ scale: item.scale, opacity: 0.25 + item.depth * 0.35 }}
                whileHover={{
                    scale: 1.1, // 统一放大到固定尺寸，模拟"推到最前方"
                    opacity: 1,
                    zIndex: 100,
                    filter: 'blur(0px)',
                }}
                onClick={handleClick}
                style={{
                    filter: `blur(${blur}px)`,
                }}
                transition={{ duration: 0.25 }}
            >
                {item.type === 'image' ? (
                    <div className="w-32 h-20 md:w-40 md:h-24 rounded-lg overflow-hidden shadow-xl ring-1 ring-white/10 group-hover:ring-accent/50 group-hover:shadow-accent/20 transition-all">
                        <img src={item.content} alt="project-thumb" className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        {/* 点击提示 */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="px-2 py-1 rounded bg-black/60 text-white text-xs backdrop-blur-sm">
                                点击查看
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="px-3 py-1.5 rounded-full bg-primary/80 border border-white/10 backdrop-blur-md text-secondary whitespace-nowrap text-xs font-medium shadow-md hover:bg-zinc-900 hover:text-white hover:border-zinc-700 dark:hover:bg-white dark:hover:text-zinc-900 dark:hover:border-white transition-all">
                        {item.content}
                    </div>
                )}
            </motion.div>
        </motion.div>
    )
}

export function PortfolioHero({ name, title, subtitle, projectCount, projects = [] }: PortfolioHeroProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

    // 窗口尺寸状态，默认给予一个合理的初始值避免 SSR 闪烁
    const [dimensions, setDimensions] = useState({ width: 1200, height: 800 })
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
        const handleResize = () => {
            setDimensions({
                width: window.innerWidth,
                height: window.innerHeight
            })
        }

        // 初始化
        handleResize()

        // 防抖 Resize 监听
        let timeoutId: NodeJS.Timeout
        const debouncedResize = () => {
            clearTimeout(timeoutId)
            timeoutId = setTimeout(handleResize, 100)
        }

        window.addEventListener('resize', debouncedResize)
        return () => window.removeEventListener('resize', debouncedResize)
    }, [])

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end start'],
    })

    // 视差和淡出效果
    const y = useTransform(scrollYProgress, [0, 1], [0, 200])
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
    const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9])

    // 点击项目跳转
    const handleProjectClick = (projectId: string) => {
        const el = document.getElementById(`project-${projectId}`)
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' })
            el.classList.add('ring-2', 'ring-accent', 'ring-offset-2')
            setTimeout(() => {
                el.classList.remove('ring-2', 'ring-accent', 'ring-offset-2')
            }, 2000)
        }
    }

    // 动态生成悬浮元素 - 分离 Image 和 Tag 的密度计算
    const floatingItems = useMemo(() => {
        if (projects.length === 0 || !isMounted) return []

        const { width, height } = dimensions
        const screenArea = width * height

        // ========== 配置参数 ==========
        // Image 配置：大尺寸
        const IMAGE_CONFIG = {
            elementWidth: 160,
            elementHeight: 96,
            coverage: 0.12,      // 提升图片覆盖率
            gridSize: 160,       // 缩小网格间距
            minCount: 20,
            maxCount: 50,
        }
        // Tag 配置：小尺寸、密集网格
        const TAG_CONFIG = {
            elementWidth: 80,
            elementHeight: 28,
            coverage: 0.04,
            gridSize: 100,
            minCount: 100,
            maxCount: 200,
        }

        // 避让区域：中心文字区 + 顶部导航区
        const centerSafeZone = {
            xMin: 0.35,
            xMax: 0.65,
            yMin: 0.25,
            yMax: 0.85
        }
        const topSafeZone = 0.08  // 顶部 8% 安全区

        // 准备内容数据
        const allTechs = Array.from(new Set(projects.flatMap(p => p.techStack || [])))
        const projectCovers = projects
            .filter(p => p.cover)
            .map(p => ({ cover: p.cover as string, id: p.id }))

        const items: FloatingItemData[] = []

        // ========== 辅助函数：四象限均匀采样 ==========
        // 四象限之间轮流取，象限内部随机打乱
        const balancedShuffle = (cells: { col: number, row: number }[], colCount: number, rowCount: number): { col: number, row: number }[] => {
            const midCol = colCount / 2
            const midRow = rowCount / 2

            // 分为四象限
            const quadrants = [
                cells.filter(c => c.col < midCol && c.row < midRow),      // 左上
                cells.filter(c => c.col >= midCol && c.row < midRow),     // 右上
                cells.filter(c => c.col < midCol && c.row >= midRow),     // 左下
                cells.filter(c => c.col >= midCol && c.row >= midRow),    // 右下
            ]

            // 每个象限内部随机打乱
            quadrants.forEach(q => {
                q.sort(() => Math.random() - 0.5)
            })

            // 轮流从四个象限取格子
            const result: { col: number, row: number }[] = []
            const maxLen = Math.max(...quadrants.map(q => q.length))

            for (let i = 0; i < maxLen; i++) {
                // 固定顺序轮流取
                for (let qi = 0; qi < 4; qi++) {
                    if (i < quadrants[qi].length) {
                        result.push(quadrants[qi][i])
                    }
                }
            }
            return result
        }

        // ========== 生成 Image 元素 ==========
        {
            const { elementWidth, elementHeight, coverage, gridSize, minCount, maxCount } = IMAGE_CONFIG
            const elementArea = elementWidth * elementHeight
            let targetCount = Math.floor((screenArea * coverage) / elementArea)
            targetCount = Math.min(Math.max(targetCount, minCount), maxCount)

            const colCount = Math.max(Math.floor(width / gridSize), 4)
            const rowCount = Math.max(Math.floor(height / gridSize), 3)
            const cellWidth = 100 / colCount
            const cellHeight = 100 / rowCount

            const availableCells: { col: number, row: number }[] = []
            for (let r = 0; r < rowCount; r++) {
                for (let c = 0; c < colCount; c++) {
                    const xCenter = (c + 0.5) / colCount
                    const yCenter = (r + 0.5) / rowCount

                    // 顶部安全区
                    if (yCenter < topSafeZone) continue

                    // 中心文字区
                    const inCenterZone =
                        xCenter > centerSafeZone.xMin &&
                        xCenter < centerSafeZone.xMax &&
                        yCenter > centerSafeZone.yMin &&
                        yCenter < centerSafeZone.yMax
                    if (!inCenterZone) {
                        availableCells.push({ col: c, row: r })
                    }
                }
            }

            // 使用分区均匀采样
            const shuffledCells = balancedShuffle(availableCells, colCount, rowCount)

            const finalCount = Math.min(targetCount, shuffledCells.length, projectCovers.length > 0 ? Infinity : 0)
            for (let i = 0; i < finalCount; i++) {
                const cell = shuffledCells[i]
                const proj = projectCovers[i % projectCovers.length]

                const offsetX = (Math.random() * 0.6 + 0.2) * cellWidth
                const offsetY = (Math.random() * 0.6 + 0.2) * cellHeight
                const x = cell.col * cellWidth + offsetX
                const y = cell.row * cellHeight + offsetY

                items.push({
                    id: `image-${i}`,
                    type: 'image',
                    content: proj.cover,
                    projectId: proj.id,
                    x: x - (cellWidth / 2),
                    y: y - (cellHeight / 2),
                    scale: 0.6 + Math.random() * 0.4,
                    depth: Math.random() * 0.6 + 0.4,
                })
            }
        }

        // ========== 生成 Tag 元素 ==========
        {
            const { elementWidth, elementHeight, coverage, gridSize, minCount, maxCount } = TAG_CONFIG
            const elementArea = elementWidth * elementHeight
            let targetCount = Math.floor((screenArea * coverage) / elementArea)
            targetCount = Math.min(Math.max(targetCount, minCount), maxCount)

            const colCount = Math.max(Math.floor(width / gridSize), 6)
            const rowCount = Math.max(Math.floor(height / gridSize), 5)
            const cellWidth = 100 / colCount
            const cellHeight = 100 / rowCount

            const availableCells: { col: number, row: number }[] = []
            for (let r = 0; r < rowCount; r++) {
                for (let c = 0; c < colCount; c++) {
                    const xCenter = (c + 0.5) / colCount
                    const yCenter = (r + 0.5) / rowCount

                    // 顶部安全区
                    if (yCenter < topSafeZone) continue

                    // 中心文字区
                    const inCenterZone =
                        xCenter > centerSafeZone.xMin &&
                        xCenter < centerSafeZone.xMax &&
                        yCenter > centerSafeZone.yMin &&
                        yCenter < centerSafeZone.yMax
                    if (!inCenterZone) {
                        availableCells.push({ col: c, row: r })
                    }
                }
            }

            // 使用分区均匀采样
            const shuffledCells = balancedShuffle(availableCells, colCount, rowCount)

            const finalCount = Math.min(targetCount, shuffledCells.length, allTechs.length > 0 ? Infinity : 0)
            for (let i = 0; i < finalCount; i++) {
                const cell = shuffledCells[i]
                const tech = allTechs[i % allTechs.length]

                const offsetX = (Math.random() * 0.7 + 0.15) * cellWidth
                const offsetY = (Math.random() * 0.7 + 0.15) * cellHeight
                const x = cell.col * cellWidth + offsetX
                const y = cell.row * cellHeight + offsetY

                items.push({
                    id: `tag-${i}`,
                    type: 'tech',
                    content: tech,
                    projectId: undefined,
                    x: x - (cellWidth / 2),
                    y: y - (cellHeight / 2),
                    scale: 0.5 + Math.random() * 0.5,
                    depth: Math.random() * 0.5 + 0.2,
                })
            }
        }

        // 按 depth 排序，远的在前（先渲染，被盖住）
        return items.sort((a, b) => a.depth - b.depth)
    }, [projects, dimensions, isMounted])

    // 鼠标移动监听
    const handleMouseMove = (e: React.MouseEvent) => {
        const { clientX, clientY } = e
        const { innerWidth, innerHeight } = window
        setMousePosition({
            x: (clientX / innerWidth - 0.5) * 2,
            y: (clientY / innerHeight - 0.5) * 2
        })
    }

    return (
        <div
            ref={containerRef}
            className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-primary"
            onMouseMove={handleMouseMove}
        >
            {/* 动态背景层 */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none lg:pointer-events-auto">
                {/* 基础渐变 */}
                <div className="absolute inset-0 bg-gradient-to-b from-primary via-primary to-secondary opacity-80" />

                {/* 悬浮元素层 */}
                {floatingItems.map((item) => (
                    <FloatingElement
                        key={item.id}
                        item={item}
                        mousePos={mousePosition}
                        onProjectClick={handleProjectClick}
                    />
                ))}

                {/* 顶部遮罩，确保文字可读性 */}
                <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-primary/40 to-primary/70 pointer-events-none" />
                <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-primary/70 pointer-events-none" />
            </div>

            {/* 主内容 */}
            <motion.div
                className="relative z-20 text-center px-4 max-w-5xl mx-auto"
                style={{ y, opacity, scale }}
            >
                {/* 头像和名字 */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="mb-8"
                >
                    <motion.div
                        className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium backdrop-blur-md shadow-lg shadow-accent/5"
                        whileHover={{ scale: 1.05 }}
                    >
                        <span className="relative flex size-2">
                            <span className="animate-ping absolute inline-flex size-full rounded-full bg-accent opacity-75" />
                            <span className="relative inline-flex rounded-full size-2 bg-accent" />
                        </span>
                        2026届毕业生
                    </motion.div>
                </motion.div>

                {/* 大标题 */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight"
                >
                    <span className="bg-gradient-to-r from-accent via-accent to-accent/60 bg-clip-text text-transparent filter drop-shadow-sm">
                        {name}
                    </span>
                    <br />
                    <span className="text-primary text-4xl md:text-5xl lg:text-6xl font-extrabold relative inline-block">
                        {title}
                        {/* 装饰下划线 */}
                        <motion.svg
                            className="absolute -bottom-2 left-0 w-full h-3 text-accent/30 -z-10"
                            viewBox="0 0 100 10"
                            preserveAspectRatio="none"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1, delay: 0.8 }}
                        >
                            <path d="M0 5 Q 50 10 100 5" fill="none" stroke="currentColor" strokeWidth="2" />
                        </motion.svg>
                    </span>
                </motion.h1>

                {/* 副标题 */}
                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-xl md:text-2xl text-secondary mb-12 max-w-2xl mx-auto leading-relaxed"
                >
                    {subtitle}
                </motion.p>

                {/* 统计数据 - 玻璃拟态卡片 */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="inline-flex flex-wrap justify-center gap-4 md:gap-8 p-6 rounded-3xl bg-secondary/30 border border-white/5 backdrop-blur-xl shadow-2xl"
                >
                    <div className="text-center px-4">
                        <div className="text-3xl md:text-4xl font-bold text-accent mb-1">{projectCount}</div>
                        <div className="text-xs text-secondary uppercase tracking-wider font-medium">项目经历</div>
                    </div>
                    <div className="w-px h-12 bg-white/10 my-auto" />
                    <div className="text-center px-4">
                        <div className="text-3xl md:text-4xl font-bold text-accent mb-1">3+</div>
                        <div className="text-xs text-secondary uppercase tracking-wider font-medium">年学习</div>
                    </div>
                    <div className="w-px h-12 bg-white/10 my-auto" />
                    <div className="text-center px-4">
                        <div className="text-3xl md:text-4xl font-bold text-accent mb-1">Unity</div>
                        <div className="text-xs text-secondary uppercase tracking-wider font-medium">/ UE</div>
                    </div>
                </motion.div>

                {/* 交互提示 */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.6 }}
                    transition={{ duration: 0.8, delay: 1.2 }}
                    className="mt-8 text-xs text-secondary"
                >
                    💡 点击背景中的项目截图可快速跳转
                </motion.p>

                {/* 向下滚动提示 */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 1 }}
                    className="absolute -bottom-32 left-1/2 -translate-x-1/2"
                >
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        className="flex flex-col items-center gap-2 text-secondary/50 hover:text-accent transition-colors cursor-pointer"
                        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
                    >
                        <span className="text-xs font-medium tracking-[0.2em] uppercase">Scroll</span>
                        <div className="w-[1px] h-12 bg-gradient-to-b from-current to-transparent" />
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    )
}
