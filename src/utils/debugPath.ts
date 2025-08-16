/**
 * Debug utility for path resolution
 * 用于调试路径解析的工具函数
 */
import { withBase, getBasePath } from './path'

export function debugPathResolution(originalPath: string): void {
  console.group('Path Resolution Debug')
  console.log('原始路径:', originalPath)
  console.log('Base路径:', getBasePath())
  console.log('解析后路径:', withBase(originalPath))
  console.log('当前环境:', import.meta.env.MODE)
  console.log('BASE_URL:', import.meta.env.BASE_URL)

  if (typeof window !== 'undefined') {
    console.log('当前URL:', window.location.href)
    console.log('Pathname:', window.location.pathname)
  }
  console.groupEnd()
}

export function validateModelPath(modelPath: string): boolean {
  const resolvedPath = withBase(modelPath)

  // 基本路径验证
  if (!resolvedPath || resolvedPath === '/') {
    console.error('模型路径解析失败:', resolvedPath)
    return false
  }

  // 检查路径格式
  if (!resolvedPath.endsWith('.glb') && !resolvedPath.endsWith('.gltf')) {
    console.warn('模型路径可能不是有效的GLTF文件:', resolvedPath)
  }

  console.log('模型路径验证通过:', resolvedPath)
  return true
}
