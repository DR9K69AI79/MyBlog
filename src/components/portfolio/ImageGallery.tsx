import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { GalleryItem } from './types'

interface ImageGalleryProps {
    items: GalleryItem[]
    autoPlay?: boolean
    autoPlayInterval?: number
    showThumbnails?: boolean
    aspectRatio?: 'video' | 'square' | 'wide'
}

export function ImageGallery({
    items,
    autoPlay = false,
    autoPlayInterval = 4000,
    showThumbnails = true,
    aspectRatio = 'video',
}: ImageGalleryProps) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [direction, setDirection] = useState(0)
    const [isHovered, setIsHovered] = useState(false)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    const aspectRatioClass = {
        video: 'aspect-video',
        square: 'aspect-square',
        wide: 'aspect-[21/9]',
    }[aspectRatio]

    // 自动播放逻辑
    useEffect(() => {
        if (!autoPlay || isHovered || items.length <= 1) return

        const timer = setInterval(() => {
            setDirection(1)
            setCurrentIndex((prev) => (prev + 1) % items.length)
        }, autoPlayInterval)

        return () => clearInterval(timer)
    }, [autoPlay, autoPlayInterval, isHovered, items.length])

    const goTo = useCallback((index: number) => {
        setDirection(index > currentIndex ? 1 : -1)
        setCurrentIndex(index)
    }, [currentIndex])

    const goNext = useCallback(() => {
        setDirection(1)
        setCurrentIndex((prev) => (prev + 1) % items.length)
    }, [items.length])

    const goPrev = useCallback(() => {
        setDirection(-1)
        setCurrentIndex((prev) => (prev - 1 + items.length) % items.length)
    }, [items.length])

    // 键盘导航
    useEffect(() => {
        if (!isFullscreen) return

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') goPrev()
            else if (e.key === 'ArrowRight') goNext()
            else if (e.key === 'Escape') setIsFullscreen(false)
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [isFullscreen, goNext, goPrev])

    const currentItem = items[currentIndex]

    // 动画变体
    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 300 : -300,
            opacity: 0,
            scale: 0.95,
        }),
        center: {
            x: 0,
            opacity: 1,
            scale: 1,
        },
        exit: (direction: number) => ({
            x: direction > 0 ? -300 : 300,
            opacity: 0,
            scale: 0.95,
        }),
    }

    const renderMedia = (item: GalleryItem, className: string) => {
        if (item.type === 'video') {
            return (
                <video
                    className={className}
                    src={item.url}
                    autoPlay
                    loop
                    muted
                    playsInline
                />
            )
        }
        return (
            <img
                className={className}
                src={item.url}
                alt={item.caption || '项目截图'}
                loading="lazy"
            />
        )
    }

    if (items.length === 0) return null

    return (
        <>
            <div
                ref={containerRef}
                className="relative group"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* 主展示区域 */}
                <div className={`relative ${aspectRatioClass} overflow-hidden rounded-xl bg-secondary`}>
                    <AnimatePresence initial={false} custom={direction} mode="wait">
                        <motion.div
                            key={currentIndex}
                            custom={direction}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{
                                x: { type: 'spring', stiffness: 300, damping: 30 },
                                opacity: { duration: 0.2 },
                                scale: { duration: 0.2 },
                            }}
                            className="absolute inset-0 cursor-pointer"
                            onClick={() => setIsFullscreen(true)}
                        >
                            {renderMedia(currentItem, 'size-full object-cover')}

                            {/* 渐变遮罩和标题 */}
                            {currentItem.caption && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent"
                                >
                                    <p className="text-white text-sm font-medium">{currentItem.caption}</p>
                                </motion.div>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    {/* 导航箭头 */}
                    {items.length > 1 && (
                        <>
                            <motion.button
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -10 }}
                                transition={{ duration: 0.2 }}
                                onClick={(e) => { e.stopPropagation(); goPrev() }}
                                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 size-10 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/60 hover:scale-110 transition-all"
                                aria-label="上一张"
                            >
                                <i className="iconfont icon-arrow-left text-lg" />
                            </motion.button>
                            <motion.button
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 10 }}
                                transition={{ duration: 0.2 }}
                                onClick={(e) => { e.stopPropagation(); goNext() }}
                                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 size-10 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/60 hover:scale-110 transition-all"
                                aria-label="下一张"
                            >
                                <i className="iconfont icon-arrow-right text-lg" />
                            </motion.button>
                        </>
                    )}

                    {/* 指示器点 */}
                    {items.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
                            {items.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={(e) => { e.stopPropagation(); goTo(idx) }}
                                    className={`h-2 rounded-full transition-all duration-300 ${idx === currentIndex
                                        ? 'w-6 bg-white'
                                        : 'w-2 bg-white/50 hover:bg-white/75'
                                        }`}
                                    aria-label={`跳转到第 ${idx + 1} 张`}
                                />
                            ))}
                        </div>
                    )}

                    {/* 全屏按钮 */}
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isHovered ? 1 : 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => setIsFullscreen(true)}
                        className="absolute top-3 right-3 z-10 size-9 rounded-lg bg-black/40 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/60 transition-colors"
                        aria-label="全屏查看"
                    >
                        <i className="iconfont icon-external-link text-base" />
                    </motion.button>
                </div>

                {/* 缩略图条 */}
                {showThumbnails && items.length > 1 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mt-3 flex gap-2 overflow-x-auto pb-2 scrollbar-thin"
                    >
                        {items.map((item, idx) => (
                            <button
                                key={idx}
                                onClick={() => goTo(idx)}
                                className={`relative shrink-0 w-16 h-12 rounded-lg overflow-hidden transition-all duration-300 ${idx === currentIndex
                                    ? 'ring-2 ring-accent ring-offset-2 ring-offset-primary scale-105'
                                    : 'opacity-60 hover:opacity-100 hover:scale-105'
                                    }`}
                            >
                                {item.type === 'video' ? (
                                    <video className="size-full object-cover" src={item.url} muted />
                                ) : (
                                    <img className="size-full object-cover" src={item.url} alt="" loading="lazy" />
                                )}
                                {item.type === 'gif' && (
                                    <span className="absolute bottom-0.5 right-0.5 text-[10px] bg-accent text-white px-1 rounded">GIF</span>
                                )}
                                {item.type === 'video' && (
                                    <span className="absolute inset-0 flex items-center justify-center">
                                        <i className="iconfont icon-right text-white text-lg drop-shadow-lg" />
                                    </span>
                                )}
                            </button>
                        ))}
                    </motion.div>
                )}
            </div>

            {/* 全屏模态框 */}
            <AnimatePresence>
                {isFullscreen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
                        onClick={() => setIsFullscreen(false)}
                    >
                        {/* 关闭按钮 */}
                        <button
                            onClick={() => setIsFullscreen(false)}
                            className="absolute top-4 right-4 z-10 size-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
                            aria-label="关闭"
                        >
                            <i className="iconfont icon-close text-2xl" />
                        </button>

                        {/* 全屏图片 */}
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="max-w-[90vw] max-h-[90vh]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {renderMedia(currentItem, 'max-w-full max-h-[85vh] object-contain rounded-lg')}
                            {currentItem.caption && (
                                <p className="text-white text-center mt-4 text-lg">{currentItem.caption}</p>
                            )}
                        </motion.div>

                        {/* 全屏导航 */}
                        {items.length > 1 && (
                            <>
                                <button
                                    onClick={(e) => { e.stopPropagation(); goPrev() }}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 size-14 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
                                    aria-label="上一张"
                                >
                                    <i className="iconfont icon-arrow-left text-2xl" />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); goNext() }}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 size-14 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
                                    aria-label="下一张"
                                >
                                    <i className="iconfont icon-arrow-right text-2xl" />
                                </button>
                            </>
                        )}

                        {/* 计数器 */}
                        <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
                            {currentIndex + 1} / {items.length}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
