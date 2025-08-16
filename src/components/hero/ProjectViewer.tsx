'use client'

import { useEffect, useRef } from 'react'
import { useProjectViewer } from './useProjectViewer'
import type { ModelParams } from './ProjectLibrary'
import { useAtomValue } from 'jotai'
import { isMobileAtom } from '@/store/viewport'

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
  
  // 响应式尺寸计算 - 确保4:3比例，并适配不同屏幕
  const rendererWidth = isMobile ? 280 : 420
  const rendererHeight = isMobile ? 210 : 315
  
  // 容器尺寸 - 比渲染器稍小，营造出框效果
  const containerWidth = isMobile ? 240 : 360
  const containerHeight = isMobile ? 180 : 270
  
  const {
    mountRef,
    isLoading,
    hasError,
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
  
  // 监听尺寸变化并更新渲染器
  useEffect(() => {
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
      <div className={`relative ${className}`}>
        <div className="relative w-[200px] h-[200px] lg:w-[300px] lg:h-[300px]">
          <div className="absolute left-1/2 top-1/2 w-5/6 h-3/4 -translate-x-1/2 -translate-y-1/2 rounded-xl overflow-hidden border border-primary bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center z-0" />
          <div className="relative w-full h-full flex items-center justify-center z-20">
            <img
              className="size-full object-cover"
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
      {/* 外层容器 - 精确控制尺寸确保居中 */}
      <div 
        className="relative"
        style={{
          width: `${containerWidth}px`,
          height: `${containerHeight}px`
        }}
      >
        {/* 背景容器 - 填满整个容器 */}
        <div className="absolute inset-0 rounded-xl border border-primary bg-gradient-to-br from-blue-500/10 to-purple-600/10 backdrop-blur-sm z-0 shadow-2xl" />
        
        {/* 装饰性光晕效果 */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-400/5 to-purple-500/5 blur-xl z-[-1]" />
        
        {/* 立体投影效果 */}
        <div 
          className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-gradient-to-t from-black/10 to-transparent rounded-b-full blur-sm z-[-2]"
          style={{
            width: `${containerWidth * 0.8}px`,
            height: '8px'
          }}
        />

        {/* Three.js 容器 - 绝对定位居中，允许溢出 */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing z-20"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          style={{ 
            touchAction: 'none',
            width: `${rendererWidth}px`,
            height: `${rendererHeight}px`
          }}
        >
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          )}
          <div
            ref={mountRef}
            className={`${isLoading ? 'hidden' : 'block'}`}
            style={{ 
              width: `${rendererWidth}px`, 
              height: `${rendererHeight}px`
            }}
          />
        </div>

        {/* 拖拽提示 */}
        {!isLoading && !hasError && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-secondary opacity-70 z-30">
            拖拽旋转
          </div>
        )}
      </div>
    </div>
  )
}
