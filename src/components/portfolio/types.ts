// 作品集组件类型定义
export interface GalleryItem {
  url: string
  caption?: string
  type: 'image' | 'gif' | 'video'
}

export interface ProjectLink {
  type: 'github' | 'report' | 'video' | 'demo' | 'docs' | 'download' | 'post'
  url: string
  label?: string
}

export interface ProjectData {
  id: string
  displayName: string
  description?: string
  cover?: string
  color?: string
  gallery?: GalleryItem[]
  longDescription?: string
  techStack?: string[]
  highlights?: string[]
  tags?: string[]
  category?: string
  timeText?: string
  projectUrl?: string
  links?: ProjectLink[]
  status?: 'completed' | 'in-progress' | 'archived'
}
