/**
 * 图片管理器后端服务
 * 提供项目列表、图片管理、发布等 API
 */

import express from 'express'
import cors from 'cors'
import { RAW_IMAGES_DIR, PROJECTS_DIR, PROJECT_ROOT } from './config.js'
import projectsRouter from './routes/projects.js'
import imagesRouter from './routes/images.js'

const app = express()
const PORT = 3456

// 中间件
app.use(cors())
app.use(express.json())

// 静态文件服务（用于图片预览）
app.use('/preview', express.static(RAW_IMAGES_DIR))
app.use('/projects', express.static(PROJECTS_DIR))

// API 路由
app.use('/api/projects', projectsRouter)
app.use('/api/images', imagesRouter)

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    projectRoot: PROJECT_ROOT,
    timestamp: new Date().toISOString(),
  })
})

// 启动服务器
app.listen(PORT, () => {
  console.log(`\n🖼️  图片管理器后端服务已启动`)
  console.log(`   API 地址: http://localhost:${PORT}`)
  console.log(`   项目目录: ${PROJECT_ROOT}`)
  console.log(`   原始图片: ${RAW_IMAGES_DIR}`)
  console.log(`   发布目录: ${PROJECTS_DIR}\n`)
})
