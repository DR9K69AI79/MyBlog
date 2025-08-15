import { getCollection } from 'astro:content'
import type { ProjectConfig } from '@/components/hero/ProjectLibrary'

export async function getProjectConfigs(): Promise<ProjectConfig[]> {
  try {
    // 获取 YAML 项目配置
    const yamlProjects = await getCollection('projects')

    // 转换为 ProjectConfig 格式
    const projectConfigs: ProjectConfig[] = yamlProjects.map((yamlProject) => {
      const data = yamlProject.data

      return {
        id: data.id,
        name: data.name || data.id,
        type: data.type || 'built-in',
        displayName: data.displayName,
        description: data.description,
        color: data.color,
        modelPath: data.modelPath,
        modelType: data.modelType || 'sphere',
        modelParams: data.modelParams,
        showOnHomepage: data.showOnHomepage !== false,
        projectUrl: data.projectUrl,
        postUrl: data.postUrl,
        tags: data.tags || [],
        category: data.category,
        cover: data.cover,
        timeText: data.timeText,
      }
    })

    return projectConfigs
  } catch (error) {
    console.error('Failed to load project configs:', error)
    return []
  }
}

export async function loadProjectsToLibrary(): Promise<void> {
  try {
    const { projectLibraryManager } = await import('@/components/hero/ProjectLibrary')
    const projectConfigs = await getProjectConfigs()

    // 加载到项目库管理器
    projectLibraryManager.loadYamlProjects(projectConfigs)

    console.log(`Loaded ${projectConfigs.length} projects from YAML configuration`)
  } catch (error) {
    console.error('Failed to load projects to library:', error)
  }
}
