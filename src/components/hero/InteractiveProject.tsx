'use client'

import { useState, useEffect } from 'react'
import type { ProjectConfig } from './ProjectLibrary'
import { projectLibraryManager } from './ProjectLibrary'
import ProjectViewer from './ProjectViewer'
import { motion, AnimatePresence } from 'framer-motion'
import { useAtomValue } from 'jotai'
import { isMobileAtom } from '@/store/viewport'

interface InteractiveProjectProps {
  className?: string
}

export default function InteractiveProject({ className = '' }: InteractiveProjectProps) {
  const isMobile = useAtomValue(isMobileAtom)
  const [currentProject, setCurrentProject] = useState<ProjectConfig | null>(null)
  const [projects, setProjects] = useState<ProjectConfig[]>([])
  const [showProjectList, setShowProjectList] = useState(false)
  const [viewportKey, setViewportKey] = useState(0) // 用于强制重新渲染
  const [isLoading, setIsLoading] = useState(true) // 添加加载状态
  const [isProjectSwitching, setIsProjectSwitching] = useState(false) // 项目切换状态
  
  // 监听视口变化以处理设备旋转等情况
  useEffect(() => {
    const handleViewportChange = () => {
      // 通过改变 key 来强制重新渲染 ProjectViewer 组件
      setViewportKey(prev => prev + 1)
    }

    let resizeTimer: NodeJS.Timeout
    const handleResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(handleViewportChange, 250) // 防抖处理
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('orientationchange', handleViewportChange)
    
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleViewportChange)
      clearTimeout(resizeTimer)
    }
  }, [])
  
  // 加载 YAML 项目配置
  useEffect(() => {
    const loadProjects = async () => {
      try {
        setIsLoading(true)
        // 动态导入项目加载器
        const { loadProjectsToLibrary } = await import('@/utils/projectLoader')
        await loadProjectsToLibrary()
        
        // 获取加载后的项目
        const loadedProject = projectLibraryManager.getCurrentProject()
        if (loadedProject) {
          setCurrentProject(loadedProject)
          setProjects(projectLibraryManager.getAllProjects())
        } else {
          // 如果没有项目，使用默认项目作为fallback
          setCurrentProject(projectLibraryManager.getCurrentProjectOrDefault())
          setProjects([])
        }
      } catch (error) {
        console.error('Failed to load projects:', error)
        // 加载失败时使用默认项目
        setCurrentProject(projectLibraryManager.getCurrentProjectOrDefault())
        setProjects([])
      } finally {
        setIsLoading(false)
      }
    }

    loadProjects()
  }, []) // 只在组件挂载时运行一次

  const handleProjectChange = async (project: ProjectConfig) => {
    console.log('项目切换:', {
      id: project.id,
      displayName: project.displayName,
      modelParams: project.modelParams
    })
    
    // 启动切换动画
    setIsProjectSwitching(true)
    
    // 延迟更新项目，让退出动画先执行
    setTimeout(() => {
      setCurrentProject(project)
      setProjects(projectLibraryManager.getAllProjects())
      
      // 再延迟一点时间让进入动画执行
      setTimeout(() => {
        setIsProjectSwitching(false)
      }, 200)
    }, 150)
  }

  const handlePrevious = () => {
    const previousProject = projectLibraryManager.previousProject()
    if (previousProject) {
      handleProjectChange(previousProject)
    }
  }

  const handleNext = () => {
    const nextProject = projectLibraryManager.nextProject()
    if (nextProject) {
      handleProjectChange(nextProject)
    }
  }

  const handleToggleProjectList = () => {
    setShowProjectList(!showProjectList)
  }

  const handleProjectSelect = (project: ProjectConfig) => {
    const switchedProject = projectLibraryManager.switchToProject(project.id)
    if (switchedProject) {
      handleProjectChange(switchedProject)
    } else {
      handleProjectChange(project)
    }
    setShowProjectList(false)
  }

  return (
    <div className={`w-full max-w-2xl mx-auto space-y-6 overflow-visible relative ${className}`}>
      {/* 直接显示内容，不显示加载状态 */}
      {currentProject ? (
        <>
          {/* 桌面端：整体内容区域，为右侧导航留空间 */}
          <div className={`${isMobile ? 'w-full' : 'pr-20'} transition-all duration-300 overflow-visible`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center overflow-visible relative"
        >
          <ProjectViewer
            key={viewportKey} // 只保留视口变化的key，移除项目ID
            projectType={currentProject.modelPath || currentProject.modelType || 'sphere'}
            modelParams={currentProject.modelParams}
            className="shrink-0"
          />
          
          {/* 项目列表弹窗 - 优化位置和滚动条样式 */}
          {showProjectList && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: isMobile ? 10 : -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: isMobile ? 10 : -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className={`fixed z-[9999] bg-primary/95 backdrop-blur-md border border-primary/40 rounded-xl shadow-xl min-w-[280px] max-w-[320px] ${
                isMobile 
                  ? 'bottom-28 left-1/2 -translate-x-1/2 max-h-[40vh]' 
                  : 'right-8 top-[20%] max-h-[60vh]'
              }`}
            >
              {/* 弹窗头部 */}
              <div className="flex items-center justify-between p-4 border-b border-primary/20 bg-primary/20 rounded-t-xl">
                <h3 className="text-sm font-semibold text-primary">选择项目</h3>
                <button 
                  onClick={() => setShowProjectList(false)}
                  className="p-1.5 rounded-lg hover:bg-primary/30 transition-colors text-secondary hover:text-primary"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* 项目列表 - 自定义滚动条样式 */}
              <div className="p-2 overflow-y-auto scrollbar-thin scrollbar-thumb-primary/30">
                {projects.map((project) => (
                  <motion.button
                    key={project.id}
                    whileHover={{ backgroundColor: 'rgba(var(--color-accent), 0.08)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleProjectSelect(project)}
                    className={`w-full px-3 py-2.5 text-left text-sm transition-all duration-200 rounded-lg mb-1 last:mb-0 ${
                      project.id === currentProject.id
                        ? 'bg-accent/15 text-accent border border-accent/20 shadow-sm'
                        : 'text-primary hover:text-accent hover:bg-accent/5'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium truncate flex-1">{project.displayName}</span>
                      <span className="text-xs text-secondary ml-2 flex-shrink-0">
                        {project.timeText || (project.type === 'built-in' ? '内置' : '自定义')}
                      </span>
                    </div>
                    {project.description && (
                      <div className="text-xs text-secondary mt-1 line-clamp-2">{project.description}</div>
                    )}
                    {project.category && (
                      <div className="text-xs text-accent mt-1 font-medium">{project.category}</div>
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* 当前项目信息 - 提高z-index确保可点击，增加与渲染器的间距 */}
        <div className="text-center relative z-50 mt-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentProject.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ 
                opacity: isProjectSwitching ? 0 : 1, 
                y: isProjectSwitching ? -10 : 0, 
                scale: isProjectSwitching ? 0.95 : 1 
              }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ 
                duration: 0.4, 
                ease: "easeInOut",
                opacity: { duration: 0.3 },
                scale: { duration: 0.3 }
              }}
              className="space-y-4"
            >
              {/* 项目标题和链接 */}
              <div className="mb-3">
                {currentProject.postUrl ||
                (currentProject.projectUrl && currentProject.projectUrl !== '#') ? (
                  <button
                    onClick={() => {
                      if (currentProject.postUrl) {
                        window.location.href = currentProject.postUrl
                      } else if (currentProject.projectUrl && currentProject.projectUrl !== '#') {
                        window.open(currentProject.projectUrl, '_blank')
                      }
                    }}
                    className="text-lg font-semibold text-primary hover:text-accent transition-colors cursor-pointer underline decoration-dotted underline-offset-4 hover:decoration-solid relative z-50"
                  >
                    {currentProject.displayName}
                  </button>
                ) : (
                  <h3 className="text-lg font-semibold text-primary">
                    {currentProject.displayName}
                  </h3>
                )}
                <div className="text-sm text-secondary mt-1">
                  {currentProject.timeText || (currentProject.type === 'built-in' ? '内置项目' : '自定义项目')}
                </div>
              </div>

              {/* 项目描述 */}
              {currentProject.description && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="text-sm text-secondary mb-3 max-w-md mx-auto leading-relaxed"
                >
                  {currentProject.description}
                </motion.p>
              )}

              {/* 项目标签 */}
              {currentProject.tags && currentProject.tags.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2">
                  {currentProject.tags.map((tag, index) => (
                    <motion.span
                      key={`${currentProject.id}-${tag}-${index}`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
                      className="text-xs px-3 py-1 bg-primary/40 rounded-full text-primary border border-primary/20 hover:border-accent/30 hover:text-accent transition-colors"
                    >
                      {tag}
                    </motion.span>
                  ))}
                </div>
              )}

              {/* 模型文件大小 */}
              {currentProject.fileSize && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                  className="text-xs text-secondary mt-3"
                >
                  模型大小: {(currentProject.fileSize / 1024 / 1024).toFixed(2)} MB
                </motion.p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* 桌面端：竖向项目导航控制 - 放置在整个内容区域右侧，进一步上移以达到视觉平衡 */}
      {!isMobile && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="absolute right-0 flex flex-col gap-3 z-50"
          style={{ top: '35%' }}
        >
          {/* 上一个项目按钮 */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePrevious}
            className="group relative p-3 rounded-xl bg-primary/90 hover:bg-primary/95 backdrop-blur-md transition-all duration-200 border border-primary/30 hover:border-accent/50 shadow-lg hover:shadow-xl"
            aria-label="上一个项目"
          >
            {/* 按钮背景光效 */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            
            {/* 图标 */}
            <svg className="relative w-5 h-5 text-primary group-hover:text-accent transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
            </svg>
            
            {/* 悬浮提示光点 */}
            <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-accent/70 opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-200" />
          </motion.button>

          {/* 项目列表按钮 */}
          <motion.button
            whileHover={{ scale: 1.05, rotate: showProjectList ? -180 : 0 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleToggleProjectList}
            className={`group relative p-3 rounded-xl backdrop-blur-md transition-all duration-300 border shadow-lg hover:shadow-xl ${
              showProjectList 
                ? 'bg-accent/30 border-accent/50 text-accent rotate-180' 
                : 'bg-primary/90 hover:bg-primary/95 border-primary/30 hover:border-accent/50 text-primary hover:text-accent'
            }`}
            aria-label="项目列表"
          >
            {/* 激活状态背景 */}
            {showProjectList && (
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-accent/15 to-accent/5" />
            )}
            
            {/* 悬浮背景光效 */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            
            {/* 图标 */}
            <svg className="relative w-5 h-5 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            
            {/* 激活状态指示器 */}
            {showProjectList && (
              <div className="absolute -top-1 -left-1 w-2 h-2 rounded-full bg-accent animate-pulse" />
            )}
          </motion.button>

          {/* 下一个项目按钮 */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNext}
            className="group relative p-3 rounded-xl bg-primary/90 hover:bg-primary/95 backdrop-blur-md transition-all duration-200 border border-primary/30 hover:border-accent/50 shadow-lg hover:shadow-xl"
            aria-label="下一个项目"
          >
            {/* 按钮背景光效 */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            
            {/* 图标 */}
            <svg className="relative w-5 h-5 text-primary group-hover:text-accent transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
            
            {/* 悬浮提示光点 */}
            <div className="absolute -bottom-1 -right-1 w-2 h-2 rounded-full bg-accent/70 opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-200" />
          </motion.button>
        </motion.div>
      )}

      {/* 移动端：横向项目导航控制 - 放置在最下方，简化设计，确保高 z-index */}
      {isMobile && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="flex items-center justify-center gap-6 mt-8 relative z-[9998]"
        >
          {/* 上一个项目按钮 */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePrevious}
            className="group relative p-3 rounded-xl bg-primary/80 hover:bg-primary/90 backdrop-blur-sm transition-all duration-200 border border-primary/30 hover:border-accent/50 shadow-md hover:shadow-lg z-[9998]"
            aria-label="上一个项目"
          >
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            <svg className="relative w-5 h-5 text-primary group-hover:text-accent transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </motion.button>

          {/* 项目列表按钮 */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleToggleProjectList}
            className={`group relative p-3 rounded-xl backdrop-blur-sm transition-all duration-200 border shadow-md hover:shadow-lg z-[9998] ${
              showProjectList 
                ? 'bg-accent/25 border-accent/50 text-accent' 
                : 'bg-primary/80 hover:bg-primary/90 border-primary/30 hover:border-accent/50 text-primary hover:text-accent'
            }`}
            aria-label="项目列表"
          >
            {showProjectList && (
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-accent/15 to-accent/5" />
            )}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            <svg className="relative w-5 h-5 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            {showProjectList && (
              <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-accent animate-pulse" />
            )}
          </motion.button>

          {/* 下一个项目按钮 */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNext}
            className="group relative p-3 rounded-xl bg-primary/80 hover:bg-primary/90 backdrop-blur-sm transition-all duration-200 border border-primary/30 hover:border-accent/50 shadow-md hover:shadow-lg z-[9998]"
            aria-label="下一个项目"
          >
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            <svg className="relative w-5 h-5 text-primary group-hover:text-accent transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
        </motion.div>
      )}
        </>
      ) : null}
    </div>
  )
}
