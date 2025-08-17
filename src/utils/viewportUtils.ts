/**
 * 视口和渲染器尺寸管理工具
 */

export interface ViewportConstraints {
  maxWidth: number
  maxHeight: number
  containerWidth: number
  containerHeight: number
  rendererWidth: number
  rendererHeight: number
}

/**
 * 计算安全的渲染器尺寸，确保不会导致页面溢出
 */
export function calculateSafeRendererSize(
  isMobile: boolean,
  viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1200,
  viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 800,
): ViewportConstraints {
  // 基础容器尺寸
  const containerWidth = isMobile ? 300 : 420
  const containerHeight = isMobile ? 225 : 315

  // 计算安全的最大尺寸 - 确保不超过视口的80%
  const maxViewportUsage = 0.8
  const maxWidthFromViewport = Math.floor(viewportWidth * maxViewportUsage)
  const maxHeightFromViewport = Math.floor(viewportHeight * maxViewportUsage)

  // 渲染器尺寸 - 比容器大但在安全范围内
  const baseSize = Math.max(containerWidth, containerHeight)
  const idealRendererSize = baseSize * 1.5

  // 应用约束
  const rendererWidth = Math.min(idealRendererSize, maxWidthFromViewport, 600)
  const rendererHeight = Math.min(idealRendererSize, maxHeightFromViewport, 600)

  return {
    maxWidth: maxWidthFromViewport,
    maxHeight: maxHeightFromViewport,
    containerWidth,
    containerHeight,
    rendererWidth,
    rendererHeight,
  }
}

/**
 * 创建防抖函数用于处理窗口调整
 */
export function createDebounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout)
    }

    timeout = setTimeout(() => {
      func(...args)
    }, wait)
  }
}

/**
 * 检测是否支持设备方向变化
 */
export function supportsOrientationChange(): boolean {
  return typeof window !== 'undefined' && 'orientation' in window
}

/**
 * 获取当前设备方向
 */
export function getCurrentOrientation(): 'portrait' | 'landscape' {
  if (typeof window === 'undefined') return 'landscape'

  if (supportsOrientationChange()) {
    return Math.abs(window.orientation as number) === 90 ? 'landscape' : 'portrait'
  }

  return window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
}
