'use client'

import { useEffect, useRef } from 'react'
import { useProjectViewer } from './useProjectViewer'
import type { ModelParams } from './ProjectLibrary'
import { useAtomValue } from 'jotai'
import { isMobileAtom } from '@/store/viewport'
import { motion } from 'framer-motion'
import { calculateSafeRendererSize } from '@/utils/viewportUtils'

interface ProjectViewerProps {
  projectType: string
  className?: string
  modelParams?: ModelParams
}

export default function ProjectViewer({
  projectType,
  className = '',
  modelParams,
}: ProjectViewerProps) {
  const isMobile = useAtomValue(isMobileAtom)
  
  // 使用新的尺寸计算函数
  const {
    containerWidth,
    containerHeight,
    rendererWidth,
    rendererHeight
  } = calculateSafeRendererSize(isMobile)
  
  const {
    mountRef,
    isLoading,
    hasError,
    isProjectSwitching,
    initScene,
    switchProject,
    updateCurrentModelParams,
    updateRendererSize,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleTouchStart,
    cleanup,
  } = useProjectViewer(modelParams, { width: rendererWidth, height: rendererHeight })

  const sceneInitialized = useRef(false)
  
  // 监听窗口尺寸变化 - 只在容器尺寸参数变化时更新，避免无意义的重新渲染
  useEffect(() => {
    // 移除窗口resize监听，改为只在组件尺寸变化时更新
    if (sceneInitialized.current) {
      updateRendererSize({ width: rendererWidth, height: rendererHeight })
    }
  }, [rendererWidth, rendererHeight, updateRendererSize])

  useEffect(() => {
    const init = async () => {
      console.log('ProjectViewer effect triggered with projectType:', projectType)

      if (!sceneInitialized.current) {
        console.log('初始化场景...')
        const initialized = await initScene()
        if (initialized) {
          sceneInitialized.current = true
          console.log('场景初始化成功，现在切换项目...')
          await switchProject(projectType)
        } else {
          console.log('场景初始化失败')
        }
      } else {
        console.log('场景已存在，直接切换项目...')
        await switchProject(projectType)
      }
    }

    init()

    // 清理函数不应该调用 cleanup，因为这会破坏场景
    // cleanup 应该只在组件完全卸载时调用
  }, [projectType, initScene, switchProject])

  // 当 modelParams 变化时，重新应用参数到当前项目
  useEffect(() => {
    if (sceneInitialized.current && modelParams && projectType) {
      console.log('modelParams 变化，重新应用参数到当前项目:', {
        projectType,
        modelParams
      })
      updateCurrentModelParams(modelParams)
    }
  }, [modelParams, projectType, updateCurrentModelParams, sceneInitialized.current])

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      cleanup()
    }
  }, [])

  if (hasError) {
    return (
      <div className={`relative flex justify-center ${className}`}>
        <div 
          className="relative overflow-visible"
          style={{
            width: `${containerWidth}px`,
            height: `${containerHeight}px`
          }}
        >
          <div className="absolute inset-0 rounded-xl overflow-hidden border border-primary bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center z-0" />
          <div className="relative w-full h-full flex items-center justify-center z-20">
            <img
              className="w-3/4 h-3/4 object-cover rounded-lg"
              src="/avatar.jpeg"
              alt="Site owner avatar"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative flex justify-center ${className}`}>
      {/* 3D 渲染器容器 - 主体部分 */}
      <div 
        className="relative overflow-visible"
        style={{
          width: `${containerWidth}px`,
          height: `${containerHeight}px`
        }}
      >
        {/* 外层光环效果 - 最大的发光层 */}
        <div className="absolute inset-[-20px] rounded-2xl bg-gradient-to-br from-accent/20 via-transparent to-accent/20 blur-2xl hero-glow z-[-3]" />
        
        {/* 中层光环效果 - 中等发光层 */}
        <div className="absolute inset-[-10px] rounded-xl bg-gradient-to-br from-accent/30 via-accent/10 to-accent/30 blur-xl z-[-2]" />
        
        {/* 动态光束效果 */}
        <div className="absolute inset-[-5px] rounded-xl overflow-hidden z-[-1]">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/30 to-transparent hero-shine"></div>
        </div>
        
        {/* 主背景框 - 多层次设计 */}
        <div className="absolute inset-0 rounded-xl overflow-hidden z-0">
          {/* 背景基础层 */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/95 to-primary/90 backdrop-blur-xl" />
          
          {/* 彩色渐变叠加层 */}
          <div className="absolute inset-0 bg-gradient-to-br from-accent/15 via-transparent to-accent/25 mix-blend-overlay" />
          
          {/* 网格纹理效果 */}
          <div 
            className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px'
            }}
          />
          
          {/* 边框效果 - 动态彩色边框 */}
          <div className="absolute inset-0 rounded-xl border-2 border-accent/30 shadow-lg shadow-accent/20" />
          
          {/* 内部高光边框 */}
          <div className="absolute inset-[2px] rounded-lg border border-white/10 dark:border-white/5" />
        </div>
        
        {/* 立体投影效果 - 增强深度感 */}
        <div 
          className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-gradient-radial from-black/20 via-black/10 to-transparent blur-lg z-[-4]"
          style={{
            width: `${containerWidth * 0.9}px`,
            height: '20px',
            borderRadius: '50%'
          }}
        />
        
        {/* 角落装饰元素 */}
        <div className="absolute top-2 left-2 w-3 h-3 rounded-full bg-accent/60 shadow-lg shadow-accent/40 z-10" />
        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-accent/40 shadow-md shadow-accent/30 z-10" />
        <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-accent/40 shadow-md shadow-accent/30 z-10" />
        <div className="absolute bottom-2 right-2 w-1.5 h-1.5 rounded-full bg-accent/30 shadow-sm shadow-accent/20 z-10" />

        {/* Three.js 容器 - 精确控制尺寸，确保不会溢出 */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 overflow-visible"
          style={{ 
            width: `${containerWidth}px`,
            height: `${containerHeight}px`
          }}
        >
          {/* 交互区域 - 覆盖整个容器 */}
          <div
            className="absolute inset-0 cursor-grab active:cursor-grabbing transition-transform duration-300 hover:scale-105"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            style={{ touchAction: 'none' }}
          >
            {/* 大尺寸渲染器 - 居中但被容器严格裁切，添加切换动画 */}
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ 
                width: `${rendererWidth}px`, 
                height: `${rendererHeight}px`,
              }}
            >
              <motion.div
                ref={mountRef}
                className="w-full h-full block"
                initial={false}
                animate={{ 
                  opacity: isProjectSwitching ? 0 : 1,
                  scale: isProjectSwitching ? 0.95 : 1,
                }}
                transition={{ 
                  duration: 0.2, 
                  ease: "easeOut" 
                }}
                style={{ 
                  // 开发环境下显示边界（可选）
                  ...(process.env.NODE_ENV === 'development' ? {
                    outline: '1px dashed rgba(255,165,0,0)', // 设置alpha来启用
                    outlineOffset: '-1px'
                  } : {})
                }}
              />
            </div>
          </div>
        </div>

        {/* 交互提示 - 右下角位置，视觉弱化 */}
        {!hasError && !isProjectSwitching && (
          <div className="absolute bottom-2 right-3 z-30">
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 0.4, y: 0, scale: 0.8 }}
              transition={{ duration: 0.4, delay: 0.8 }}
              className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-primary/40 backdrop-blur-sm text-secondary text-xs opacity-60 hover:opacity-80 transition-opacity duration-200"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-secondary/70 animate-pulse"></div>
              <span className="select-none">拖拽旋转</span>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}
