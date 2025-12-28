/**
 * API 客户端
 * 封装所有后端 API 调用
 */

const API_BASE = '/api'

// 通用请求方法
async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: '请求失败' }))
    throw new Error(error.error || `HTTP ${response.status}`)
  }

  return response.json()
}

// ========== 类型定义 ==========
export interface ImageInfo {
  filename: string
  path: string
  url: string
  size: number
  dimensions: { width: number; height: number }
  modifiedTime?: string
  index?: number
  caption?: string | null // 标注信息
}

export interface ProjectImages {
  cover: ImageInfo | null
  gallery: ImageInfo[]
}

export interface Project {
  id: string
  displayName: string
  description: string
  visibility: { homepage: boolean; portfolio: boolean }
  hasPublishedAssets: boolean
  publishedCover: string | null
  publishedGallery: string[]
  configCover: string | null
  rawImages: ProjectImages
}

export interface CropData {
  x: number
  y: number
  width: number
  height: number
  rotate?: number
}

export interface Config {
  version: number
  settings: {
    quality: number
    defaultCrop: string
    maxWidth: number
  }
  cropData: Record<string, CropData>
  lastPublish: string | null
}

// ========== API 方法 ==========

// 项目相关
export const projectsApi = {
  getAll: () => request<Project[]>('/projects'),
  getById: (id: string) => request<Project>(`/projects/${id}`),
}

// 图片相关
export const imagesApi = {
  getPending: () => request<ImageInfo[]>('/images/pending'),
  getAll: () =>
    request<{ pending: ImageInfo[]; assigned: Record<string, ProjectImages> }>('/images/all'),

  upload: async (files: FileList) => {
    const formData = new FormData()
    Array.from(files).forEach((file) => formData.append('images', file))

    const response = await fetch(`${API_BASE}/images/upload`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: '上传失败' }))
      throw new Error(error.error)
    }

    return response.json()
  },

  assign: (filename: string, projectId: string, slot: 'cover' | 'gallery') =>
    request<{ success: boolean; newFilename: string }>('/images/assign', {
      method: 'POST',
      body: JSON.stringify({ filename, projectId, slot }),
    }),

  unassign: (filename: string) =>
    request<{ success: boolean; newFilename: string }>('/images/unassign', {
      method: 'POST',
      body: JSON.stringify({ filename }),
    }),

  delete: (filename: string) =>
    request<{ success: boolean }>(`/images/${encodeURIComponent(filename)}`, {
      method: 'DELETE',
    }),

  getCrop: (filename: string) =>
    request<{ filename: string; cropData: CropData | null }>(
      `/images/crop/${encodeURIComponent(filename)}`,
    ),

  saveCrop: (filename: string, cropData: CropData) =>
    request<{ success: boolean }>('/images/crop', {
      method: 'POST',
      body: JSON.stringify({ filename, cropData }),
    }),

  publish: (options?: { quality?: number; maxWidth?: number }) =>
    request<{ success: boolean; published: number; failed: number; details: any }>(
      '/images/publish',
      {
        method: 'POST',
        body: JSON.stringify(options || {}),
      },
    ),

  // Gallery 排序
  reorder: (projectId: string, newOrder: Array<{ filename: string; newIndex: number }>) =>
    request<{
      success: boolean
      reordered: number
      files: Array<{ oldFilename: string; newFilename: string }>
    }>('/images/reorder', {
      method: 'POST',
      body: JSON.stringify({ projectId, newOrder }),
    }),

  // 更新 Gallery 图片标注
  updateCaption: (filename: string, caption: string) =>
    request<{ success: boolean; oldFilename: string; newFilename: string; caption: string | null }>(
      '/images/caption',
      {
        method: 'POST',
        body: JSON.stringify({ filename, caption }),
      },
    ),
}

// 配置相关
export const configApi = {
  get: () => request<Config>('/images/config'),
  update: (settings: Partial<Config['settings']>) =>
    request<{ success: boolean; settings: Config['settings'] }>('/images/config', {
      method: 'POST',
      body: JSON.stringify({ settings }),
    }),
}

// 健康检查
export const healthCheck = () => request<{ status: string; projectRoot: string }>('/health')
