/**
 * 图片 API 路由
 * GET /api/images/pending - 获取待分配图片
 * POST /api/images/upload - 上传图片
 * POST /api/images/assign - 分配图片
 * POST /api/images/unassign - 取消分配
 * POST /api/images/crop - 保存裁剪数据
 * POST /api/images/publish - 发布图片
 * DELETE /api/images/:filename - 删除图片
 */

import express from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs/promises'
import { RAW_IMAGES_DIR } from '../config.js'
import {
  scanRawImages,
  assignImage,
  unassignImage,
  publishAll,
  loadConfig,
  saveConfig,
  reorderGallery,
  updateGalleryCaption,
  assignMultiple,
  setCover,
} from '../services/imageProcessor.js'

const router = express.Router()

// 配置 multer 用于文件上传
const storage = multer.diskStorage({
  destination: RAW_IMAGES_DIR,
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    const filename = `_pending_${Date.now()}${ext}`
    cb(null, filename)
  },
})

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('不支持的图片格式'))
    }
  },
})

/**
 * 获取待分配图片列表
 */
router.get('/pending', async (req, res) => {
  try {
    const { pending } = await scanRawImages()
    res.json(pending)
  } catch (err) {
    console.error('获取待分配图片失败:', err)
    res.status(500).json({ error: err.message })
  }
})

/**
 * 获取所有图片（包含已分配的）
 */
router.get('/all', async (req, res) => {
  try {
    const result = await scanRawImages()
    res.json(result)
  } catch (err) {
    console.error('获取图片列表失败:', err)
    res.status(500).json({ error: err.message })
  }
})

/**
 * 上传图片
 */
router.post('/upload', upload.array('images', 20), async (req, res) => {
  try {
    const files = req.files.map((f) => ({
      filename: f.filename,
      originalName: f.originalname,
      size: f.size,
      url: `/preview/${f.filename}`,
    }))

    res.json({
      success: true,
      uploaded: files.length,
      files,
    })
  } catch (err) {
    console.error('上传失败:', err)
    res.status(500).json({ error: err.message })
  }
})

/**
 * 分配图片到项目
 */
router.post('/assign', async (req, res) => {
  try {
    const { filename, projectId, slot } = req.body

    if (!filename || !projectId || !slot) {
      return res.status(400).json({ error: '缺少必要参数' })
    }

    if (!['cover', 'gallery'].includes(slot)) {
      return res.status(400).json({ error: '无效的槽位类型' })
    }

    const newFilename = await assignImage(filename, projectId, slot)

    res.json({
      success: true,
      oldFilename: filename,
      newFilename,
      projectId,
      slot,
    })
  } catch (err) {
    console.error('分配失败:', err)
    res.status(500).json({ error: err.message })
  }
})

/**
 * 取消分配图片
 */
router.post('/unassign', async (req, res) => {
  try {
    const { filename } = req.body

    if (!filename) {
      return res.status(400).json({ error: '缺少文件名' })
    }

    const newFilename = await unassignImage(filename)

    res.json({
      success: true,
      oldFilename: filename,
      newFilename,
    })
  } catch (err) {
    console.error('取消分配失败:', err)
    res.status(500).json({ error: err.message })
  }
})

/**
 * 保存裁剪数据
 */
router.post('/crop', async (req, res) => {
  try {
    const { filename, cropData } = req.body

    if (!filename || !cropData) {
      return res.status(400).json({ error: '缺少必要参数' })
    }

    const config = await loadConfig()
    config.cropData[filename] = cropData
    await saveConfig(config)

    res.json({ success: true, filename, cropData })
  } catch (err) {
    console.error('保存裁剪数据失败:', err)
    res.status(500).json({ error: err.message })
  }
})

/**
 * 获取裁剪数据
 */
router.get('/crop/:filename', async (req, res) => {
  try {
    const config = await loadConfig()
    const cropData = config.cropData[req.params.filename] || null
    res.json({ filename: req.params.filename, cropData })
  } catch (err) {
    console.error('获取裁剪数据失败:', err)
    res.status(500).json({ error: err.message })
  }
})

/**
 * 获取配置
 */
router.get('/config', async (req, res) => {
  try {
    const config = await loadConfig()
    res.json(config)
  } catch (err) {
    console.error('获取配置失败:', err)
    res.status(500).json({ error: err.message })
  }
})

/**
 * 更新设置
 */
router.post('/config', async (req, res) => {
  try {
    const { settings } = req.body
    const config = await loadConfig()
    config.settings = { ...config.settings, ...settings }
    await saveConfig(config)
    res.json({ success: true, settings: config.settings })
  } catch (err) {
    console.error('更新设置失败:', err)
    res.status(500).json({ error: err.message })
  }
})

/**
 * 发布所有图片
 */
router.post('/publish', async (req, res) => {
  try {
    const { quality, maxWidth } = req.body
    const results = await publishAll({ quality, maxWidth })

    res.json({
      success: true,
      published: results.success.length,
      failed: results.failed.length,
      details: results,
    })
  } catch (err) {
    console.error('发布失败:', err)
    res.status(500).json({ error: err.message })
  }
})

/**
 * 删除图片
 */
router.delete('/:filename', async (req, res) => {
  try {
    const filename = req.params.filename
    const filePath = path.join(RAW_IMAGES_DIR, filename)

    await fs.unlink(filePath)

    // 同时删除裁剪数据
    const config = await loadConfig()
    if (config.cropData[filename]) {
      delete config.cropData[filename]
      await saveConfig(config)
    }

    res.json({ success: true, deleted: filename })
  } catch (err) {
    console.error('删除失败:', err)
    res.status(500).json({ error: err.message })
  }
})

/**
 * 重新排序 Gallery 图片
 * POST /api/images/reorder
 * Body: { projectId: string, newOrder: [{filename, newIndex}] }
 */
router.post('/reorder', async (req, res) => {
  try {
    const { projectId, newOrder } = req.body

    if (!projectId || !newOrder || !Array.isArray(newOrder)) {
      return res.status(400).json({ error: '缺少必要参数' })
    }

    const result = await reorderGallery(projectId, newOrder)

    res.json({
      success: true,
      projectId,
      reordered: result.length,
      files: result,
    })
  } catch (err) {
    console.error('排序失败:', err)
    res.status(500).json({ error: err.message })
  }
})

/**
 * 更新 Gallery 图片的标注
 * POST /api/images/caption
 * Body: { filename: string, caption: string }
 */
router.post('/caption', async (req, res) => {
  try {
    const { filename, caption } = req.body

    if (!filename) {
      return res.status(400).json({ error: '缺少文件名' })
    }

    const newFilename = await updateGalleryCaption(filename, caption || '')

    res.json({
      success: true,
      oldFilename: filename,
      newFilename,
      caption: caption || null,
    })
  } catch (err) {
    console.error('更新标注失败:', err)
    res.status(500).json({ error: err.message })
  }
})

/**
 * 批量分配图片到项目 Gallery
 * POST /api/images/assign-multiple
 * Body: { filenames: string[], projectId: string }
 */
router.post('/assign-multiple', async (req, res) => {
  try {
    const { filenames, projectId } = req.body

    if (!filenames || !Array.isArray(filenames) || filenames.length === 0) {
      return res.status(400).json({ error: '缺少文件名列表' })
    }

    if (!projectId) {
      return res.status(400).json({ error: '缺少项目 ID' })
    }

    const results = await assignMultiple(filenames, projectId)
    const successCount = results.filter((r) => r.success).length

    res.json({
      success: true,
      projectId,
      total: filenames.length,
      assigned: successCount,
      failed: filenames.length - successCount,
      results,
    })
  } catch (err) {
    console.error('批量分配失败:', err)
    res.status(500).json({ error: err.message })
  }
})

/**
 * 设置项目封面
 * POST /api/images/set-cover
 * Body: { projectId: string, filename: string }
 */
router.post('/set-cover', async (req, res) => {
  try {
    const { projectId, filename } = req.body

    if (!projectId || !filename) {
      return res.status(400).json({ error: '缺少必要参数' })
    }

    const result = await setCover(projectId, filename)

    res.json({
      success: true,
      ...result,
    })
  } catch (err) {
    console.error('设置封面失败:', err)
    res.status(500).json({ error: err.message })
  }
})

export default router
