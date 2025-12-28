/**
 * 图片处理器
 * 使用 Sharp 进行图片裁剪、压缩、格式转换
 */

import fs from 'fs/promises'
import path from 'path'
import sharp from 'sharp'
import { RAW_IMAGES_DIR, PROJECTS_DIR } from '../config.js'

// 配置文件路径
const CONFIG_PATH = path.join(RAW_IMAGES_DIR, '.image-manager.json')

// 文件名解析正则
// 支持格式：projectId__cover.ext 或 projectId__gallery_1.ext 或 projectId__gallery_1_标注.ext
const FILENAME_PATTERN = /^(.+?)__(cover|gallery_(\d+)(?:_(.+?))?)\.(.+)$/
const PENDING_PREFIX = '_pending_'

/**
 * 加载配置文件
 */
export async function loadConfig() {
  try {
    const content = await fs.readFile(CONFIG_PATH, 'utf-8')
    return JSON.parse(content)
  } catch {
    return {
      version: 2,
      settings: { quality: 80, defaultCrop: '16:9', maxWidth: 1920 },
      cropData: {},
      lastPublish: null,
    }
  }
}

/**
 * 保存配置文件
 */
export async function saveConfig(config) {
  await fs.writeFile(CONFIG_PATH, JSON.stringify(config, null, 2))
}

/**
 * 解析文件名
 * 支持格式：
 *   - projectId__cover.ext
 *   - projectId__gallery_1.ext
 *   - projectId__gallery_1_标注文字.ext
 */
export function parseFilename(filename) {
  const match = filename.match(FILENAME_PATTERN)
  if (!match) return null

  const isGallery = match[2].startsWith('gallery')

  return {
    projectId: match[1],
    type: isGallery ? 'gallery' : 'cover',
    index: match[3] ? parseInt(match[3]) : null,
    caption: isGallery ? match[4] || null : null, // 标注信息
    ext: match[5],
  }
}

/**
 * 判断是否为待分配图片
 */
export function isPendingImage(filename) {
  return filename.startsWith(PENDING_PREFIX)
}

/**
 * 判断是否为图片文件
 */
export function isImageFile(filename) {
  const ext = filename.split('.').pop()?.toLowerCase()
  return ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp'].includes(ext)
}

/**
 * 扫描原始图片目录
 * @returns {Promise<Object>} { pending: [], assigned: { projectId: { cover, gallery } } }
 */
export async function scanRawImages() {
  // 确保目录存在
  try {
    await fs.access(RAW_IMAGES_DIR)
  } catch {
    await fs.mkdir(RAW_IMAGES_DIR, { recursive: true })
  }

  const files = await fs.readdir(RAW_IMAGES_DIR)
  const result = {
    pending: [],
    assigned: {},
  }

  for (const filename of files) {
    if (filename.startsWith('.') || !isImageFile(filename)) continue

    const filePath = path.join(RAW_IMAGES_DIR, filename)
    const stats = await fs.stat(filePath)

    // 获取图片尺寸
    let dimensions = { width: 0, height: 0 }
    try {
      const metadata = await sharp(filePath).metadata()
      dimensions = { width: metadata.width, height: metadata.height }
    } catch {}

    const imageInfo = {
      filename,
      path: filePath,
      url: `/preview/${filename}`,
      size: stats.size,
      dimensions,
      modifiedTime: stats.mtime.toISOString(),
    }

    const parsed = parseFilename(filename)

    if (parsed) {
      // 已分配图片
      if (!result.assigned[parsed.projectId]) {
        result.assigned[parsed.projectId] = { cover: null, gallery: [] }
      }

      if (parsed.type === 'cover') {
        result.assigned[parsed.projectId].cover = imageInfo
      } else {
        result.assigned[parsed.projectId].gallery.push({
          ...imageInfo,
          index: parsed.index,
          caption: parsed.caption, // 添加标注信息
        })
      }
    } else {
      // 待分配图片
      result.pending.push(imageInfo)
    }
  }

  // 对 gallery 按 index 排序
  for (const projectId of Object.keys(result.assigned)) {
    result.assigned[projectId].gallery.sort((a, b) => a.index - b.index)
  }

  return result
}

/**
 * 分配图片到项目
 * @param {string} filename 原始文件名
 * @param {string} projectId 目标项目 ID
 * @param {'cover'|'gallery'} slot 槽位类型
 * @returns {Promise<string>} 新文件名
 */
export async function assignImage(filename, projectId, slot) {
  const srcPath = path.join(RAW_IMAGES_DIR, filename)
  const ext = filename.split('.').pop()

  let newFilename

  if (slot === 'cover') {
    newFilename = `${projectId}__cover.${ext}`

    // 检查是否已有封面，如果有则先取消分配
    const existing = await findExistingCover(projectId)
    if (existing) {
      await unassignImage(existing)
    }
  } else {
    // 查找下一个可用的 gallery 索引
    const nextIndex = await getNextGalleryIndex(projectId)
    newFilename = `${projectId}__gallery_${nextIndex}.${ext}`
  }

  const destPath = path.join(RAW_IMAGES_DIR, newFilename)

  // 重命名文件
  await fs.rename(srcPath, destPath)

  return newFilename
}

/**
 * 取消分配图片
 * @param {string} filename 已分配的文件名
 * @returns {Promise<string>} 新文件名（待分配格式）
 */
export async function unassignImage(filename) {
  const srcPath = path.join(RAW_IMAGES_DIR, filename)
  const ext = filename.split('.').pop()
  const newFilename = `${PENDING_PREFIX}${Date.now()}.${ext}`
  const destPath = path.join(RAW_IMAGES_DIR, newFilename)

  await fs.rename(srcPath, destPath)

  return newFilename
}

/**
 * 查找项目现有的封面
 */
async function findExistingCover(projectId) {
  const files = await fs.readdir(RAW_IMAGES_DIR)
  return files.find((f) => f.startsWith(`${projectId}__cover.`))
}

/**
 * 获取下一个可用的 gallery 索引
 */
async function getNextGalleryIndex(projectId) {
  const files = await fs.readdir(RAW_IMAGES_DIR)
  const indices = files
    .filter((f) => f.startsWith(`${projectId}__gallery_`))
    .map((f) => {
      const match = f.match(/__gallery_(\d+)\./)
      return match ? parseInt(match[1]) : 0
    })

  return indices.length > 0 ? Math.max(...indices) + 1 : 1
}

/**
 * 处理并发布单张图片
 * @param {string} filename 原始文件名
 * @param {Object} options 处理选项
 * @returns {Promise<string>} 发布后的路径
 */
export async function processAndPublish(filename, options = {}) {
  const { quality = 80, maxWidth = 1920, cropData = null } = options

  const parsed = parseFilename(filename)
  if (!parsed) throw new Error(`无效的文件名格式: ${filename}`)

  const srcPath = path.join(RAW_IMAGES_DIR, filename)
  const projectDir = path.join(PROJECTS_DIR, parsed.projectId)

  // 确保项目目录存在
  await fs.mkdir(projectDir, { recursive: true })

  let destPath
  if (parsed.type === 'cover') {
    destPath = path.join(projectDir, 'cover.webp')
  } else {
    const galleryDir = path.join(projectDir, 'gallery')
    await fs.mkdir(galleryDir, { recursive: true })
    // 发布时将 caption 包含在文件名中（格式：1-标注.webp）
    const captionPart = parsed.caption ? `-${parsed.caption}` : ''
    destPath = path.join(galleryDir, `${parsed.index}${captionPart}.webp`)
  }

  // 使用 Sharp 处理图片
  let pipeline = sharp(srcPath)

  // 应用裁剪
  if (cropData) {
    pipeline = pipeline.extract({
      left: Math.round(cropData.x),
      top: Math.round(cropData.y),
      width: Math.round(cropData.width),
      height: Math.round(cropData.height),
    })
  }

  // 调整尺寸并转换为 WebP
  await pipeline
    .resize({ width: maxWidth, withoutEnlargement: true })
    .webp({ quality })
    .toFile(destPath)

  return destPath
}

/**
 * 发布所有已分配的图片
 * @param {Object} options 处理选项
 * @returns {Promise<Object>} 发布结果
 */
export async function publishAll(options = {}) {
  const config = await loadConfig()
  const { quality = config.settings.quality, maxWidth = config.settings.maxWidth } = options

  const { assigned } = await scanRawImages()
  const results = { success: [], failed: [] }

  for (const [projectId, images] of Object.entries(assigned)) {
    // 发布封面
    if (images.cover) {
      try {
        const cropData = config.cropData[images.cover.filename]
        await processAndPublish(images.cover.filename, { quality, maxWidth, cropData })
        results.success.push({ projectId, type: 'cover', filename: images.cover.filename })
      } catch (err) {
        results.failed.push({
          projectId,
          type: 'cover',
          filename: images.cover.filename,
          error: err.message,
        })
      }
    }

    // 发布 gallery
    for (const img of images.gallery) {
      try {
        const cropData = config.cropData[img.filename]
        await processAndPublish(img.filename, { quality, maxWidth, cropData })
        results.success.push({ projectId, type: 'gallery', filename: img.filename })
      } catch (err) {
        results.failed.push({
          projectId,
          type: 'gallery',
          filename: img.filename,
          error: err.message,
        })
      }
    }
  }

  // 更新配置
  config.lastPublish = new Date().toISOString()
  await saveConfig(config)

  return results
}

/**
 * 重新排序 Gallery 图片
 * @param {string} projectId 项目 ID
 * @param {Array<{filename: string, newIndex: number}>} newOrder 新顺序
 * @returns {Promise<Array>} 重命名后的文件列表
 */
export async function reorderGallery(projectId, newOrder) {
  const config = await loadConfig()
  const renamedFiles = []

  // 第一步：将所有文件重命名为临时名称，避免冲突
  const tempFiles = []
  for (const item of newOrder) {
    const parsed = parseFilename(item.filename)
    if (!parsed || parsed.projectId !== projectId) continue

    const tempName = `_temp_${Date.now()}_${item.newIndex}_${parsed.caption || ''}.${parsed.ext}`
    const srcPath = path.join(RAW_IMAGES_DIR, item.filename)
    const tempPath = path.join(RAW_IMAGES_DIR, tempName)

    await fs.rename(srcPath, tempPath)
    tempFiles.push({
      tempName,
      newIndex: item.newIndex,
      caption: parsed.caption,
      ext: parsed.ext,
      oldFilename: item.filename,
    })

    // 更新 cropData 中的键名（临时）
    if (config.cropData[item.filename]) {
      config.cropData[tempName] = config.cropData[item.filename]
      delete config.cropData[item.filename]
    }
  }

  // 第二步：按新顺序重命名为最终名称
  for (const item of tempFiles) {
    const captionPart = item.caption ? `_${item.caption}` : ''
    const finalName = `${projectId}__gallery_${item.newIndex}${captionPart}.${item.ext}`
    const tempPath = path.join(RAW_IMAGES_DIR, item.tempName)
    const finalPath = path.join(RAW_IMAGES_DIR, finalName)

    await fs.rename(tempPath, finalPath)
    renamedFiles.push({
      oldFilename: item.oldFilename,
      newFilename: finalName,
      newIndex: item.newIndex,
    })

    // 更新 cropData 中的键名（最终）
    if (config.cropData[item.tempName]) {
      config.cropData[finalName] = config.cropData[item.tempName]
      delete config.cropData[item.tempName]
    }
  }

  await saveConfig(config)
  return renamedFiles
}

/**
 * 更新 Gallery 图片的标注信息
 * @param {string} filename 当前文件名
 * @param {string} newCaption 新的标注（空字符串表示无标注）
 * @returns {Promise<string>} 新文件名
 */
export async function updateGalleryCaption(filename, newCaption) {
  const parsed = parseFilename(filename)
  if (!parsed || parsed.type !== 'gallery') {
    throw new Error('无效的 gallery 文件')
  }

  const config = await loadConfig()

  // 清理标注中的特殊字符（保留中文、英文、数字、空格、下划线、连字符）
  const cleanCaption = newCaption
    ? newCaption.replace(/[^\u4e00-\u9fa5a-zA-Z0-9\s_-]/g, '').trim()
    : ''

  // 构建新文件名
  const captionPart = cleanCaption ? `_${cleanCaption}` : ''
  const newFilename = `${parsed.projectId}__gallery_${parsed.index}${captionPart}.${parsed.ext}`

  if (newFilename === filename) {
    return filename // 无需更改
  }

  const srcPath = path.join(RAW_IMAGES_DIR, filename)
  const destPath = path.join(RAW_IMAGES_DIR, newFilename)

  await fs.rename(srcPath, destPath)

  // 更新 cropData 中的键名
  if (config.cropData[filename]) {
    config.cropData[newFilename] = config.cropData[filename]
    delete config.cropData[filename]
  }
  await saveConfig(config)

  return newFilename
}
