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
  
  const {
    mountRef,
    isLoading,
    hasError,
    initScene,
    switchProject,
    updateCurrentModelParams,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleTouchStart,
    cleanup,
  } = useProjectViewer(modelParams)

  const sceneInitialized = useRef(false)
  
  // 计算渲染器尺寸 - 4:3比例，增大尺寸以实现出框效果
  const rendererWidth = isMobile ? 320 : 420
  const rendererHeight = isMobile ? 240 : 315

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
    <div className={`relative ${className}`}>
      {/* 外层容器 - 设置实际显示尺寸 */}
      <div className="relative w-[200px] h-[200px] lg:w-[300px] lg:h-[300px]">
        {/* 背景容器 - 缩小尺寸创建出框效果，适配4:3比例 */}
        <div className="absolute left-1/2 top-1/2 w-5/6 h-3/4 -translate-x-1/2 -translate-y-1/2 rounded-xl border border-primary bg-gradient-to-br from-blue-500/10 to-purple-600/10 backdrop-blur-sm z-0 shadow-2xl" />
        
        {/* 装饰性光晕效果 */}
        <div className="absolute left-1/2 top-1/2 w-5/6 h-3/4 -translate-x-1/2 -translate-y-1/2 rounded-xl bg-gradient-to-br from-blue-400/5 to-purple-500/5 blur-xl z-[-1]" />
        
        {/* 立体投影效果 */}
        <div className="absolute left-1/2 bottom-2 w-4/5 h-2 -translate-x-1/2 bg-gradient-to-t from-black/10 to-transparent rounded-b-full blur-sm z-[-2]" />

        {/* Three.js 容器 - 完整尺寸，允许内容超出背景框 */}
        <div
          className="relative w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing z-20"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          style={{ touchAction: 'none' }}
        >
          {isLoading && (
            <div className="w-full h-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          )}
          <div
            ref={mountRef}
            className={`${isLoading ? 'hidden' : 'block'}`}
            style={{ 
              width: `${rendererWidth}px`, 
              height: `${rendererHeight}px`,
              maxWidth: 'none',
              maxHeight: 'none'
            }}
          />
        </div>

        {/* 拖拽提示 */}
        {!isLoading && !hasError && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-secondary opacity-70 z-30">
            拖拽旋转
          </div>
        )}
      </div>
    </div>
  )
}
