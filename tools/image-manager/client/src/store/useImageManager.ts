/**
 * 图片管理器状态管理
 * 使用 Zustand 管理全局状态
 */

import { create } from 'zustand'
import { Project, ImageInfo, CropData, projectsApi, imagesApi, configApi } from '../api/client'

interface ImageManagerState {
  // 数据状态
  projects: Project[]
  pendingImages: ImageInfo[]
  isLoading: boolean
  error: string | null

  // 设置
  quality: number
  maxWidth: number
  autoCrop: boolean

  // 裁剪模态框
  cropModal: {
    open: boolean
    image: ImageInfo | null
    projectId: string | null
    slot: 'cover' | 'gallery' | null
  }

  // 操作方法
  fetchData: () => Promise<void>
  refreshPending: () => Promise<void>

  assignImage: (filename: string, projectId: string, slot: 'cover' | 'gallery') => Promise<void>
  unassignImage: (filename: string) => Promise<void>
  deleteImage: (filename: string) => Promise<void>
  uploadImages: (files: FileList) => Promise<void>

  saveCrop: (filename: string, cropData: CropData) => Promise<void>
  openCropModal: (image: ImageInfo, projectId: string, slot: 'cover' | 'gallery') => void
  closeCropModal: () => void

  updateSettings: (settings: { quality?: number; maxWidth?: number; autoCrop?: boolean }) => void
  publish: () => Promise<{ success: boolean; published: number; failed: number }>

  // Gallery 排序和标注
  reorderGallery: (
    projectId: string,
    newOrder: Array<{ filename: string; newIndex: number }>,
  ) => Promise<void>
  updateCaption: (filename: string, caption: string) => Promise<void>

  // 标注编辑模态框
  captionModal: {
    open: boolean
    image: ImageInfo | null
    projectId: string | null
  }
  openCaptionModal: (image: ImageInfo, projectId: string) => void
  closeCaptionModal: () => void
}

export const useImageManager = create<ImageManagerState>((set, get) => ({
  // 初始状态
  projects: [],
  pendingImages: [],
  isLoading: false,
  error: null,

  quality: 80,
  maxWidth: 1920,
  autoCrop: true,

  cropModal: {
    open: false,
    image: null,
    projectId: null,
    slot: null,
  },

  // 获取所有数据
  fetchData: async () => {
    set({ isLoading: true, error: null })
    try {
      const [projects, pending, config] = await Promise.all([
        projectsApi.getAll(),
        imagesApi.getPending(),
        configApi.get(),
      ])

      set({
        projects,
        pendingImages: pending,
        quality: config.settings.quality,
        maxWidth: config.settings.maxWidth,
        isLoading: false,
      })
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false })
    }
  },

  // 刷新待分配图片
  refreshPending: async () => {
    try {
      const pending = await imagesApi.getPending()
      set({ pendingImages: pending })
    } catch (err) {
      set({ error: (err as Error).message })
    }
  },

  // 分配图片
  assignImage: async (filename, projectId, slot) => {
    try {
      await imagesApi.assign(filename, projectId, slot)
      // 重新获取数据以保持同步
      await get().fetchData()
    } catch (err) {
      set({ error: (err as Error).message })
      throw err
    }
  },

  // 取消分配
  unassignImage: async (filename) => {
    try {
      await imagesApi.unassign(filename)
      await get().fetchData()
    } catch (err) {
      set({ error: (err as Error).message })
      throw err
    }
  },

  // 删除图片
  deleteImage: async (filename) => {
    try {
      await imagesApi.delete(filename)
      await get().fetchData()
    } catch (err) {
      set({ error: (err as Error).message })
      throw err
    }
  },

  // 上传图片
  uploadImages: async (files) => {
    try {
      await imagesApi.upload(files)
      await get().refreshPending()
    } catch (err) {
      set({ error: (err as Error).message })
      throw err
    }
  },

  // 保存裁剪数据
  saveCrop: async (filename, cropData) => {
    try {
      await imagesApi.saveCrop(filename, cropData)
    } catch (err) {
      set({ error: (err as Error).message })
      throw err
    }
  },

  // 打开裁剪模态框
  openCropModal: (image, projectId, slot) => {
    set({
      cropModal: { open: true, image, projectId, slot },
    })
  },

  // 关闭裁剪模态框
  closeCropModal: () => {
    set({
      cropModal: { open: false, image: null, projectId: null, slot: null },
    })
  },

  // 更新设置
  updateSettings: (settings) => {
    set((state) => ({
      quality: settings.quality ?? state.quality,
      maxWidth: settings.maxWidth ?? state.maxWidth,
      autoCrop: settings.autoCrop ?? state.autoCrop,
    }))

    // 同步到服务器
    const { quality, maxWidth } = get()
    configApi.update({ quality, maxWidth }).catch(console.error)
  },

  // 发布
  publish: async () => {
    const { quality, maxWidth } = get()
    try {
      const result = await imagesApi.publish({ quality, maxWidth })
      return result
    } catch (err) {
      set({ error: (err as Error).message })
      throw err
    }
  },

  // Gallery 排序
  reorderGallery: async (projectId, newOrder) => {
    try {
      await imagesApi.reorder(projectId, newOrder)
      await get().fetchData()
    } catch (err) {
      set({ error: (err as Error).message })
      throw err
    }
  },

  // 更新标注
  updateCaption: async (filename, caption) => {
    try {
      await imagesApi.updateCaption(filename, caption)
      await get().fetchData()
    } catch (err) {
      set({ error: (err as Error).message })
      throw err
    }
  },

  // 标注编辑模态框状态
  captionModal: {
    open: false,
    image: null,
    projectId: null,
  },

  // 打开标注编辑模态框
  openCaptionModal: (image, projectId) => {
    set({
      captionModal: { open: true, image, projectId },
    })
  },

  // 关闭标注编辑模态框
  closeCaptionModal: () => {
    set({
      captionModal: { open: false, image: null, projectId: null },
    })
  },
}))
