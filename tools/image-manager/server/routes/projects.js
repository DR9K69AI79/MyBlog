/**
 * 项目 API 路由
 * GET /api/projects - 获取所有项目
 * GET /api/projects/:id - 获取单个项目
 */

import express from 'express'
import { getAllProjects, getProjectById } from '../services/projectLoader.js'
import { scanRawImages } from '../services/imageProcessor.js'

const router = express.Router()

/**
 * 获取所有项目列表
 * 包含已分配的原始图片信息
 */
router.get('/', async (req, res) => {
  try {
    const projects = await getAllProjects()
    const { assigned } = await scanRawImages()

    // 合并项目配置和已分配图片
    const result = projects.map((project) => ({
      ...project,
      rawImages: assigned[project.id] || { cover: null, gallery: [] },
    }))

    res.json(result)
  } catch (err) {
    console.error('获取项目列表失败:', err)
    res.status(500).json({ error: err.message })
  }
})

/**
 * 获取单个项目详情
 */
router.get('/:id', async (req, res) => {
  try {
    const project = await getProjectById(req.params.id)
    if (!project) {
      return res.status(404).json({ error: '项目不存在' })
    }

    const { assigned } = await scanRawImages()

    res.json({
      ...project,
      rawImages: assigned[project.id] || { cover: null, gallery: [] },
    })
  } catch (err) {
    console.error('获取项目详情失败:', err)
    res.status(500).json({ error: err.message })
  }
})

export default router
