'use client'

import { useEffect, useRef } from 'react'
import { useModelViewer } from './useModelViewer'

interface ModelViewerProps {
  modelType: string
  className?: string
}

export default function ModelViewer({ modelType, className = '' }: ModelViewerProps) {
  const {
    mountRef,
    isLoading,
    hasError,
    initScene,
    switchModel,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    cleanup,
  } = useModelViewer()

  const sceneInitialized = useRef(false)

  useEffect(() => {
    const init = async () => {
      console.log('ModelViewer effect triggered with modelType:', modelType)
      
      if (!sceneInitialized.current) {
        console.log('初始化场景...')
        const initialized = await initScene()
        if (initialized) {
          sceneInitialized.current = true
          console.log('场景初始化成功，现在切换模型...')
          await switchModel(modelType)
        } else {
          console.log('场景初始化失败')
        }
      } else {
        console.log('场景已存在，直接切换模型...')
        await switchModel(modelType)
      }
    }

    init()

    // 清理函数不应该调用 cleanup，因为这会破坏场景
    // cleanup 应该只在组件完全卸载时调用
  }, [modelType, initScene, switchModel])

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      cleanup()
    }
  }, [])

  if (hasError) {
    return (
      <div className={`size-[200px] lg:size-[300px] rounded-xl overflow-hidden border border-primary bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center ${className}`}>
        <img 
          className="size-full object-cover" 
          src="/avatar.jpeg" 
          alt="Site owner avatar" 
          loading="lazy" 
        />
      </div>
    )
  }

  return (
    <div className={`size-[200px] lg:size-[300px] relative ${className}`}>
      {/* 背景容器 */}
      <div className="absolute inset-0 rounded-xl border border-primary bg-gradient-to-br from-blue-500/10 to-purple-600/10 backdrop-blur-sm" />
      
      {/* Three.js 容器 */}
      <div 
        className="relative z-10 w-full h-full rounded-xl overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {isLoading && (
          <div className="w-full h-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}
        <div 
          ref={mountRef} 
          className={`${isLoading ? 'hidden' : 'block'}`}
          style={{ width: '200px', height: '200px' }}
        />
      </div>

      {/* 拖拽提示 */}
      {!isLoading && !hasError && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-secondary opacity-70">
          拖拽旋转
        </div>
      )}
    </div>
  )
}