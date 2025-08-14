'use client'

import { useState } from 'react'
import type { ModelConfig } from './ModelLibrary'
import { modelLibraryManager } from './ModelLibrary'
import ModelViewer from './ModelViewer'
import ModelSwitcher from './ModelSwitcher'
import { motion } from 'framer-motion'

interface InteractiveModelProps {
  className?: string
}

export default function InteractiveModel({ className = '' }: InteractiveModelProps) {
  const [currentModel, setCurrentModel] = useState<ModelConfig>(modelLibraryManager.getCurrentModel())

  const handleModelChange = (model: ModelConfig) => {
    setCurrentModel(model)
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 3D模型查看器 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <ModelViewer 
          modelType={currentModel.name} 
          className="w-full"
        />
      </motion.div>

      {/* 模型切换控制 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative"
      >
        <ModelSwitcher
          currentModel={currentModel}
          onModelChange={handleModelChange}
          className="w-full"
        />
      </motion.div>

      {/* 模型信息 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="text-center text-sm text-secondary"
      >
        {currentModel.description && (
          <p>{currentModel.description}</p>
        )}
        {currentModel.fileSize && (
          <p className="text-xs mt-1">
            文件大小: {(currentModel.fileSize / 1024 / 1024).toFixed(2)} MB
          </p>
        )}
      </motion.div>
    </div>
  )
}