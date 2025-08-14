export interface ModelConfig {
  id: string
  name: string
  type: 'built-in' | 'custom'
  displayName: string
  description?: string
  color?: string
  filePath?: string
  fileSize?: number
}

export interface ModelLibrary {
  models: ModelConfig[]
  currentModelIndex: number
}

// 内置模型配置
export const builtInModels: ModelConfig[] = [
  {
    id: 'sphere',
    name: 'sphere',
    type: 'built-in',
    displayName: '球体',
    description: '经典球体模型，带标记点和线框',
    color: '#4F46E5',
  },
  {
    id: 'cube',
    name: 'cube',
    type: 'built-in',
    displayName: '立方体',
    description: '几何立方体，带边框线条',
    color: '#059669',
  },
  {
    id: 'torus',
    name: 'torus',
    type: 'built-in',
    displayName: '圆环',
    description: '圆环几何体',
    color: '#dc2626',
  },
  {
    id: 'pyramid',
    name: 'pyramid',
    type: 'built-in',
    displayName: '金字塔',
    description: '四棱锥几何体',
    color: '#7c3aed',
  },
]

// 默认模型库
export const createDefaultModelLibrary = (): ModelLibrary => ({
  models: [...builtInModels],
  currentModelIndex: 0,
})

// 模型库管理类
export class ModelLibraryManager {
  private library: ModelLibrary

  constructor(initialLibrary?: ModelLibrary) {
    this.library = initialLibrary || createDefaultModelLibrary()
  }

  // 获取当前模型
  getCurrentModel(): ModelConfig {
    return this.library.models[this.library.currentModelIndex]
  }

  // 获取所有模型
  getAllModels(): ModelConfig[] {
    return this.library.models
  }

  // 切换到下一个模型
  nextModel(): ModelConfig {
    this.library.currentModelIndex =
      (this.library.currentModelIndex + 1) % this.library.models.length
    return this.getCurrentModel()
  }

  // 切换到上一个模型
  previousModel(): ModelConfig {
    this.library.currentModelIndex =
      (this.library.currentModelIndex - 1 + this.library.models.length) % this.library.models.length
    return this.getCurrentModel()
  }

  // 切换到指定模型
  switchToModel(modelId: string): ModelConfig | null {
    const index = this.library.models.findIndex((model) => model.id === modelId)
    if (index !== -1) {
      this.library.currentModelIndex = index
      return this.getCurrentModel()
    }
    return null
  }

  // 添加自定义模型
  addCustomModel(model: Omit<ModelConfig, 'type'>): ModelConfig {
    const customModel: ModelConfig = {
      ...model,
      type: 'custom',
    }
    this.library.models.push(customModel)
    return customModel
  }

  // 移除模型
  removeModel(modelId: string): boolean {
    const index = this.library.models.findIndex((model) => model.id === modelId)
    if (index !== -1) {
      this.library.models.splice(index, 1)
      // 调整当前索引
      if (this.library.currentModelIndex >= this.library.models.length) {
        this.library.currentModelIndex = Math.max(0, this.library.models.length - 1)
      }
      return true
    }
    return false
  }

  // 获取模型库状态
  getLibrary(): ModelLibrary {
    return { ...this.library }
  }

  // 从文件添加模型
  addModelFromFile(file: File): Promise<ModelConfig> {
    return new Promise((resolve, reject) => {
      // 验证文件类型
      const validTypes = ['.glb', '.gltf', '.obj']
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()

      if (!validTypes.includes(fileExtension)) {
        reject(new Error('不支持的文件格式，请使用 .glb, .gltf 或 .obj 文件'))
        return
      }

      // 验证文件大小 (限制为10MB)
      const maxSize = 10 * 1024 * 1024 // 10MB
      if (file.size > maxSize) {
        reject(new Error('文件过大，请选择小于10MB的文件'))
        return
      }

      // 创建模型配置
      const model: ModelConfig = {
        id: `custom_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        name: file.name.replace(/\.[^/.]+$/, ''),
        type: 'custom',
        displayName: file.name.replace(/\.[^/.]+$/, ''),
        description: `自定义模型: ${file.name}`,
        filePath: URL.createObjectURL(file),
        fileSize: file.size,
      }

      try {
        this.addCustomModel(model)
        resolve(model)
      } catch (error) {
        reject(error)
      }
    })
  }
}

// 创建单例实例
export const modelLibraryManager = new ModelLibraryManager()
