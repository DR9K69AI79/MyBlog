'use client'

import { useState, useEffect } from 'react'
import type { ModelConfig } from './ModelLibrary'
import { modelLibraryManager } from './ModelLibrary'
import { motion } from 'framer-motion'
import { useAtom } from 'jotai'
import { modalStackAtom } from '@/store/modalStack'

interface ModelSwitcherProps {
  currentModel: ModelConfig
  onModelChange: (model: ModelConfig) => void
  className?: string
}

export default function ModelSwitcher({ currentModel, onModelChange, className = '' }: ModelSwitcherProps) {
  const [models, setModels] = useState<ModelConfig[]>([])
  const [showModelList, setShowModelList] = useState(false)
  const setModalStack = useAtom(modalStackAtom)[1]

  useEffect(() => {
    setModels(modelLibraryManager.getAllModels())
  }, [])

  const handlePrevious = () => {
    const previousModel = modelLibraryManager.previousModel()
    onModelChange(previousModel)
    setModels(modelLibraryManager.getAllModels())
  }

  const handleNext = () => {
    const nextModel = modelLibraryManager.nextModel()
    onModelChange(nextModel)
    setModels(modelLibraryManager.getAllModels())
  }

  const handleModelSelect = (model: ModelConfig) => {
    modelLibraryManager.switchToModel(model.id)
    onModelChange(model)
    setModels(modelLibraryManager.getAllModels())
    setShowModelList(false)
  }

  const openModelUploader = () => {
    // TODO: 实现自定义模型上传功能
    console.log('自定义模型上传功能尚未实现')
    alert('自定义模型上传功能正在开发中...')
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* 左切换按钮 */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handlePrevious}
        className="p-2 rounded-lg bg-primary/50 hover:bg-primary/70 transition-colors border border-primary/30"
        aria-label="上一个模型"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </motion.button>

      {/* 当前模型信息 */}
      <div className="flex-1 text-center min-w-0">
        <motion.div
          key={currentModel.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm font-medium text-primary truncate"
        >
          {currentModel.displayName}
        </motion.div>
        <div className="text-xs text-secondary">
          {currentModel.type === 'built-in' ? '内置' : '自定义'}
        </div>
      </div>

      {/* 右切换按钮 */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleNext}
        className="p-2 rounded-lg bg-primary/50 hover:bg-primary/70 transition-colors border border-primary/30"
        aria-label="下一个模型"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </motion.button>

      {/* 模型列表按钮 */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowModelList(!showModelList)}
        className="p-2 rounded-lg bg-primary/50 hover:bg-primary/70 transition-colors border border-primary/30"
        aria-label="模型列表"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </motion.button>

      {/* 上传模型按钮 - 暂时隐藏，功能开发中 */}
      {false && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={openModelUploader}
          className="p-2 rounded-lg bg-primary/50 hover:bg-primary/70 transition-colors border border-primary/30"
          aria-label="上传模型"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </motion.button>
      )}

      {/* 模型列表弹窗 */}
      {showModelList && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-primary border border-primary/30 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          {models.map((model) => (
            <motion.button
              key={model.id}
              whileHover={{ backgroundColor: 'rgba(79, 70, 229, 0.1)' }}
              onClick={() => handleModelSelect(model)}
              className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                model.id === currentModel.id ? 'bg-accent/20 text-accent' : 'text-primary hover:text-accent'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{model.displayName}</span>
                <span className="text-xs text-secondary">
                  {model.type === 'built-in' ? '内置' : '自定义'}
                </span>
              </div>
              {model.description && (
                <div className="text-xs text-secondary mt-1">{model.description}</div>
              )}
            </motion.button>
          ))}
        </div>
      )}
    </div>
  )
}

// 模型上传弹窗组件
function ModelUploaderModal({ onClose, onModelUploaded }: {
  onClose: () => void
  onModelUploaded: (model: any) => void
}) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<string>('')

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setUploadStatus('正在上传模型...')

    try {
      const model = await modelLibraryManager.addModelFromFile(file)
      setUploadStatus('模型上传成功！')
      onModelUploaded(model)
      
      // 延迟关闭弹窗
      setTimeout(() => {
        onClose()
      }, 1500)
    } catch (error) {
      setUploadStatus(error instanceof Error ? error.message : '上传失败')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="bg-primary rounded-lg border border-primary/30 p-6 max-w-md w-full mx-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-primary">上传3D模型</h3>
        <button
          onClick={onClose}
          className="text-secondary hover:text-primary transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="space-y-4">
        <div className="border-2 border-dashed border-primary/30 rounded-lg p-6 text-center">
          <input
            type="file"
            accept=".glb,.gltf,.obj"
            onChange={handleFileUpload}
            disabled={isUploading}
            className="hidden"
            id="model-upload"
          />
          <label
            htmlFor="model-upload"
            className="cursor-pointer block"
          >
            <svg className="w-12 h-12 mx-auto mb-4 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <div className="text-sm text-secondary">
              点击或拖拽文件到此处上传
            </div>
            <div className="text-xs text-secondary mt-1">
              支持 .glb, .gltf, .obj 格式，最大 10MB
            </div>
          </label>
        </div>

        {isUploading && (
          <div className="flex items-center justify-center gap-2 text-sm text-secondary">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
            {uploadStatus}
          </div>
        )}

        {uploadStatus && !isUploading && (
          <div className={`text-sm text-center ${
            uploadStatus.includes('成功') ? 'text-green-500' : 'text-red-500'
          }`}>
            {uploadStatus}
          </div>
        )}
      </div>
    </div>
  )
}