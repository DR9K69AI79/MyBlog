/**
 * 路径配置
 * 解决循环依赖问题
 */

import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// 项目根目录（MyBlog）
export const PROJECT_ROOT = path.resolve(__dirname, '../../..')
export const CONTENT_DIR = path.join(PROJECT_ROOT, 'src/content/projects')
export const PUBLIC_DIR = path.join(PROJECT_ROOT, 'public')
export const RAW_IMAGES_DIR = path.join(PUBLIC_DIR, 'raw-images')
export const PROJECTS_DIR = path.join(PUBLIC_DIR, 'projects')
