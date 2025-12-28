/**
 * 项目加载器
 * 从 src/content/projects/*.yaml 读取项目配置
 */

import fs from 'fs/promises'
import path from 'path'
import YAML from 'yaml'
import { CONTENT_DIR, PROJECTS_DIR } from '../config.js'

/**
 * 获取所有项目列表
 * @returns {Promise<Array>} 项目列表
 */
export async function getAllProjects() {
  const files = await fs.readdir(CONTENT_DIR)
  const yamlFiles = files.filter((f) => f.endsWith('.yaml'))

  const projects = await Promise.all(
    yamlFiles.map(async (filename) => {
      const filePath = path.join(CONTENT_DIR, filename)
      const content = await fs.readFile(filePath, 'utf-8')
      const data = YAML.parse(content)

      // 检查项目发布目录是否存在
      const projectDir = path.join(PROJECTS_DIR, data.id)
      let hasPublishedAssets = false
      let publishedCover = null
      let publishedGallery = []

      try {
        await fs.access(projectDir)
        hasPublishedAssets = true

        // 检查 cover.webp
        try {
          await fs.access(path.join(projectDir, 'cover.webp'))
          publishedCover = `/projects/${data.id}/cover.webp`
        } catch {}

        // 检查 gallery 目录
        try {
          const galleryDir = path.join(projectDir, 'gallery')
          const galleryFiles = await fs.readdir(galleryDir)
          publishedGallery = galleryFiles
            .filter((f) => f.endsWith('.webp'))
            .sort((a, b) => parseInt(a) - parseInt(b))
            .map((f) => `/projects/${data.id}/gallery/${f}`)
        } catch {}
      } catch {}

      return {
        id: data.id,
        displayName: data.displayName,
        description: data.description,
        visibility: data.visibility || { homepage: true, portfolio: true },
        hasPublishedAssets,
        publishedCover,
        publishedGallery,
        // 原始配置中的 cover（可能是外部 URL）
        configCover: data.cover || null,
      }
    }),
  )

  // 按 id 字母顺序排序
  return projects.sort((a, b) => a.id.localeCompare(b.id))
}

/**
 * 获取单个项目详情
 * @param {string} projectId 项目 ID
 * @returns {Promise<Object|null>} 项目详情
 */
export async function getProjectById(projectId) {
  const projects = await getAllProjects()
  return projects.find((p) => p.id === projectId) || null
}
