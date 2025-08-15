'use client'

import { useState, useEffect } from 'react'
import type { ProjectConfig } from './ProjectLibrary'
import { projectLibraryManager } from './ProjectLibrary'
import ProjectViewer from './ProjectViewer'
import ProjectSwitcher from './ProjectSwitcher'
import { motion } from 'framer-motion'

interface InteractiveProjectProps {
  className?: string
}

export default function InteractiveProject({ className = '' }: InteractiveProjectProps) {
  const [currentProject, setCurrentProject] = useState<ProjectConfig>(
    projectLibraryManager.getCurrentProject(),
  )
  // 加载 YAML 项目配置
  useEffect(() => {
    const loadProjects = async () => {
      try {
        // 动态导入项目加载器
        const { loadProjectsToLibrary } = await import('@/utils/projectLoader')
        await loadProjectsToLibrary()
        
        // 无论当前项目是什么，都更新为项目库中的第一个项目
        const newCurrentProject = projectLibraryManager.getCurrentProject()
        setCurrentProject(newCurrentProject)
        
        // setProjectsLoaded(true) // 不再需要这个状态
      } catch (error) {
        console.error('Failed to load projects:', error)
        // setProjectsLoaded(true) // 不再需要这个状态
      }
    }

    loadProjects()
  }, []) // 只在组件挂载时运行一次

  const handleProjectChange = (project: ProjectConfig) => {
    console.log('项目切换:', {
      id: project.id,
      displayName: project.displayName,
      modelParams: project.modelParams
    })
    setCurrentProject(project)
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 3D项目查看器 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <ProjectViewer
          projectType={currentProject.modelPath || currentProject.modelType || 'sphere'}
          modelParams={currentProject.modelParams}
          className="w-full"
        />
      </motion.div>

      {/* 项目切换控制 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative"
      >
        <ProjectSwitcher
          currentProject={currentProject}
          onProjectChange={handleProjectChange}
          className="w-full"
        />
      </motion.div>

      {/* 项目信息 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="text-center text-sm text-secondary"
      >
        {currentProject.description && <p className="mt-1">{currentProject.description}</p>}

        {/* 项目标签 */}
        {currentProject.tags && currentProject.tags.length > 0 && (
          <div className="flex flex-wrap justify-center gap-1 mt-2">
            {currentProject.tags.map((tag, index) => (
              <span
                key={index}
                className="text-xs px-2 py-1 bg-primary/20 rounded-full text-primary"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {currentProject.fileSize && (
          <p className="text-xs mt-1">
            模型大小: {(currentProject.fileSize / 1024 / 1024).toFixed(2)} MB
          </p>
        )}
      </motion.div>
    </div>
  )
}
