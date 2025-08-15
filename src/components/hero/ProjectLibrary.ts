export interface ModelParams {
  scale: number
  rotation: {
    x: number
    y: number
    z: number
  }
  position: {
    x: number
    y: number
    z: number
  }
  material: {
    metalness: number
    roughness: number
    opacity: number
    transparent: boolean
    wireframe: boolean
  }
  lighting: {
    intensity: number
    ambientIntensity: number
    enableShadows: boolean
  }
  animation: {
    autoRotate: boolean
    rotationSpeed: number
    bounceEnabled: boolean
  }
}

export interface ProjectConfig {
  id: string
  name: string
  type: 'built-in' | 'custom'
  displayName: string
  description?: string
  color?: string
  modelPath?: string
  fileSize?: number
  // 显示控制
  showOnHomepage?: boolean
  modelType?: string
  // 模型参数配置
  modelParams?: ModelParams
  // 项目特有字段
  projectUrl?: string
  postUrl?: string
  tags?: string[]
  category?: string
  cover?: string
  timeText?: string
}

export interface ProjectLibrary {
  projects: ProjectConfig[]
  currentProjectIndex: number
}

// 默认项目库（空，由YAML文件填充）
export const createDefaultProjectLibrary = (): ProjectLibrary => ({
  projects: [],
  currentProjectIndex: 0,
})

// 项目库管理类
export class ProjectLibraryManager {
  private library: ProjectLibrary
  private yamlProjects: ProjectConfig[] = []

  constructor(initialLibrary?: ProjectLibrary) {
    this.library = initialLibrary || createDefaultProjectLibrary()
  }

  // 获取当前项目
  getCurrentProject(): ProjectConfig {
    // 如果没有YAML项目，返回默认项目
    if (this.yamlProjects.length === 0) {
      return this.getDefaultProject()
    }
    return this.yamlProjects[this.library.currentProjectIndex] || this.getDefaultProject()
  }

  // 获取所有项目
  getAllProjects(): ProjectConfig[] {
    // 如果有YAML项目，只返回YAML项目
    if (this.yamlProjects.length > 0) {
      return this.yamlProjects.filter((project) => project.showOnHomepage !== false)
    }
    // 如果没有YAML项目，返回空数组
    return []
  }

  // 获取默认项目（当没有YAML项目时的fallback）
  private getDefaultProject(): ProjectConfig {
    return {
      id: 'default-project',
      name: 'default-project',
      type: 'built-in',
      displayName: '默认项目',
      description: '请配置YAML项目文件',
      color: '#4F46E5',
      modelType: 'sphere',
      showOnHomepage: true,
      projectUrl: '#',
      tags: ['Default'],
      category: 'Default',
      timeText: '默认',
    }
  }

  // 从YAML配置加载项目
  loadYamlProjects(yamlProjects: any[]): void {
    this.yamlProjects = yamlProjects.map((yamlProject) => {
      const resolvedModelPath = this.resolveModelPath(yamlProject.modelPath, yamlProject.id)

      return {
        id: yamlProject.id,
        name: yamlProject.displayName || yamlProject.id, // 优先使用displayName作为name
        type: yamlProject.type || 'built-in',
        displayName: yamlProject.displayName,
        description: yamlProject.description,
        color: yamlProject.color,
        modelPath: resolvedModelPath,
        // 如果 modelType 是 "custom" 且有 modelPath，则使用 modelPath 作为 modelType
        modelType:
          yamlProject.modelType === 'custom' && resolvedModelPath
            ? resolvedModelPath
            : yamlProject.modelType || 'sphere',
        modelParams: yamlProject.modelParams,
        showOnHomepage: yamlProject.showOnHomepage !== false,
        projectUrl: yamlProject.projectUrl,
        postUrl: yamlProject.postUrl,
        tags: yamlProject.tags || [],
        category: yamlProject.category,
        cover: yamlProject.cover,
        timeText: yamlProject.timeText,
      }
    })

    // 重置当前项目索引到第一个项目
    this.library.currentProjectIndex = 0
  }

  // 解析模型文件路径
  private resolveModelPath(modelPath: string | undefined, projectId: string): string | undefined {
    if (!modelPath) return undefined

    // 如果已经是完整URL，直接返回
    if (modelPath.startsWith('http://') || modelPath.startsWith('https://')) {
      return modelPath
    }

    // 如果是绝对路径，直接返回
    if (modelPath.startsWith('/')) {
      return modelPath
    }

    // 处理Windows风格的路径
    if (modelPath.includes('\\')) {
      // 将反斜杠替换为正斜杠，并移除public前缀
      const normalizedPath = modelPath.replace(/\\/g, '/')
      if (normalizedPath.startsWith('public/')) {
        return `/${normalizedPath.substring(7)}`
      }
      return normalizedPath
    }

    // 对于相对路径，放在models目录下
    if (modelPath.includes('/')) {
      // 如果包含路径分隔符，确保以/开头
      return modelPath.startsWith('/') ? modelPath : `/${modelPath}`
    } else {
      // 如果是简单文件名，放在models目录下
      return `/models/${modelPath}`
    }
  }

  // 切换到下一个项目（只在显示的项目中循环）
  nextProject(): ProjectConfig {
    if (this.yamlProjects.length === 0) {
      return this.getDefaultProject()
    }

    // 获取所有显示的项目
    const visibleProjects = this.yamlProjects.filter((project) => project.showOnHomepage !== false)

    if (visibleProjects.length === 0) {
      return this.getDefaultProject()
    }

    // 如果当前项目不在显示的项目中，切换到第一个显示的项目
    const currentProject = this.yamlProjects[this.library.currentProjectIndex]
    const currentVisibleIndex = visibleProjects.findIndex(
      (project) => project.id === currentProject.id,
    )

    if (currentVisibleIndex === -1) {
      // 找到第一个显示的项目在yamlProjects中的索引
      const firstVisibleProject = visibleProjects[0]
      const firstVisibleIndex = this.yamlProjects.findIndex(
        (project) => project.id === firstVisibleProject.id,
      )
      this.library.currentProjectIndex = firstVisibleIndex
      return this.getCurrentProject()
    }

    // 切换到下一个显示的项目
    const nextVisibleIndex = (currentVisibleIndex + 1) % visibleProjects.length
    const nextVisibleProject = visibleProjects[nextVisibleIndex]
    const nextIndex = this.yamlProjects.findIndex((project) => project.id === nextVisibleProject.id)

    this.library.currentProjectIndex = nextIndex
    return this.getCurrentProject()
  }

  // 切换到上一个项目（只在显示的项目中循环）
  previousProject(): ProjectConfig {
    if (this.yamlProjects.length === 0) {
      return this.getDefaultProject()
    }

    // 获取所有显示的项目
    const visibleProjects = this.yamlProjects.filter((project) => project.showOnHomepage !== false)

    if (visibleProjects.length === 0) {
      return this.getDefaultProject()
    }

    // 如果当前项目不在显示的项目中，切换到第一个显示的项目
    const currentProject = this.yamlProjects[this.library.currentProjectIndex]
    const currentVisibleIndex = visibleProjects.findIndex(
      (project) => project.id === currentProject.id,
    )

    if (currentVisibleIndex === -1) {
      // 找到第一个显示的项目在yamlProjects中的索引
      const firstVisibleProject = visibleProjects[0]
      const firstVisibleIndex = this.yamlProjects.findIndex(
        (project) => project.id === firstVisibleProject.id,
      )
      this.library.currentProjectIndex = firstVisibleIndex
      return this.getCurrentProject()
    }

    // 切换到上一个显示的项目
    const prevVisibleIndex =
      (currentVisibleIndex - 1 + visibleProjects.length) % visibleProjects.length
    const prevVisibleProject = visibleProjects[prevVisibleIndex]
    const prevIndex = this.yamlProjects.findIndex((project) => project.id === prevVisibleProject.id)

    this.library.currentProjectIndex = prevIndex
    return this.getCurrentProject()
  }

  // 切换到指定项目
  switchToProject(projectId: string): ProjectConfig | null {
    if (this.yamlProjects.length === 0) {
      return null
    }
    const index = this.yamlProjects.findIndex((project) => project.id === projectId)
    if (index !== -1) {
      this.library.currentProjectIndex = index
      return this.getCurrentProject()
    }
    return null
  }

  // 添加自定义项目
  addCustomProject(project: Omit<ProjectConfig, 'type'>): ProjectConfig {
    const customProject: ProjectConfig = {
      ...project,
      type: 'custom',
    }
    this.yamlProjects.push(customProject)
    return customProject
  }

  // 移除项目
  removeProject(projectId: string): boolean {
    const index = this.yamlProjects.findIndex((project) => project.id === projectId)
    if (index !== -1) {
      this.yamlProjects.splice(index, 1)
      // 调整当前索引
      if (this.library.currentProjectIndex >= this.yamlProjects.length) {
        this.library.currentProjectIndex = Math.max(0, this.yamlProjects.length - 1)
      }
      return true
    }
    return false
  }

  // 获取项目库状态
  getLibrary(): ProjectLibrary {
    return { ...this.library }
  }

  // 从文件添加项目
  addProjectFromFile(file: File): Promise<ProjectConfig> {
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

      // 创建项目配置
      const project: ProjectConfig = {
        id: `custom_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        name: file.name.replace(/\.[^/.]+$/, ''),
        type: 'custom',
        displayName: file.name.replace(/\.[^/.]+$/, ''),
        description: `自定义项目: ${file.name}`,
        modelPath: URL.createObjectURL(file),
        fileSize: file.size,
      }

      try {
        this.addCustomProject(project)
        resolve(project)
      } catch (error) {
        reject(error)
      }
    })
  }

  // 从项目配置添加项目
  addProjectFromConfig(project: Omit<ProjectConfig, 'type'>): ProjectConfig {
    return this.addCustomProject(project)
  }
}

// 创建单例实例
export const projectLibraryManager = new ProjectLibraryManager()

// 向后兼容的接口（已弃用）
export interface ModelConfig extends ProjectConfig {}
export interface ModelLibrary extends ProjectLibrary {}
export const builtInModels: ProjectConfig[] = []
export const createDefaultModelLibrary = createDefaultProjectLibrary
export class ModelLibraryManager extends ProjectLibraryManager {}
export const modelLibraryManager = projectLibraryManager
