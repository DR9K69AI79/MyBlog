/**
 * 项目资源路径解析工具
 *
 * 提供约定式的资源路径解析，简化项目配置。
 * 约定目录结构：
 *   public/projects/{projectId}/
 *   ├── cover.{webp|jpg|png}    # 封面图
 *   ├── gallery/                 # 图库目录
 *   │   ├── 1.jpg
 *   │   └── 2.png
 *   └── model.glb               # 3D 模型
 */

// 支持的图片扩展名（按优先级排序）
const IMAGE_EXTENSIONS = ['webp', 'jpg', 'jpeg', 'png', 'gif']

// 支持的模型扩展名
const MODEL_EXTENSIONS = ['glb', 'gltf']

/**
 * 获取项目资源目录路径
 * @param projectId 项目 ID
 * @param assetsDir 可选的自定义资源目录
 * @returns 资源目录路径（以 / 开头）
 */
export function getProjectAssetsDir(projectId: string, assetsDir?: string): string {
  return assetsDir || `/projects/${projectId}`
}

/**
 * 获取项目封面图路径
 * 优先使用 YAML 中配置的 cover，否则尝试约定路径
 * @param projectId 项目 ID
 * @param configuredCover YAML 中配置的 cover 路径
 * @param assetsDir 可选的自定义资源目录
 * @returns 封面图路径
 */
export function getProjectCover(
  projectId: string,
  configuredCover?: string,
  assetsDir?: string,
): string {
  // 如果已配置，直接返回
  if (configuredCover) {
    return configuredCover
  }

  // 使用约定路径（默认 webp）
  const dir = getProjectAssetsDir(projectId, assetsDir)
  return `${dir}/cover.webp`
}

/**
 * 获取项目封面图的多格式备选路径
 * 用于在模板中使用 <picture> 元素提供多格式支持
 * @param projectId 项目 ID
 * @param assetsDir 可选的自定义资源目录
 * @returns 各格式的路径对象
 */
export function getProjectCoverSources(
  projectId: string,
  assetsDir?: string,
): { webp: string; jpg: string; fallback: string } {
  const dir = getProjectAssetsDir(projectId, assetsDir)
  return {
    webp: `${dir}/cover.webp`,
    jpg: `${dir}/cover.jpg`,
    fallback: `${dir}/cover.jpg`, // 兜底
  }
}

/**
 * 获取项目 3D 模型路径
 * 优先使用 YAML 中配置的 modelPath，否则尝试约定路径
 * @param projectId 项目 ID
 * @param configuredModelPath YAML 中配置的 modelPath
 * @param assetsDir 可选的自定义资源目录
 * @returns 模型路径或 undefined
 */
export function getProjectModelPath(
  projectId: string,
  configuredModelPath?: string,
  assetsDir?: string,
): string | undefined {
  if (configuredModelPath) {
    return configuredModelPath
  }

  // 尝试约定路径
  const dir = getProjectAssetsDir(projectId, assetsDir)
  return `${dir}/model.glb`
}

/**
 * 生成图库图片路径列表
 * 由于 Astro 静态构建无法运行时扫描目录，此函数需要配合配置使用
 * @param projectId 项目 ID
 * @param configuredGallery YAML 中配置的 gallery 数组
 * @param assetsDir 可选的自定义资源目录
 * @returns 图库配置数组
 */
export function getProjectGallery(
  projectId: string,
  configuredGallery?: Array<{ url: string; caption?: string; type?: string }>,
  assetsDir?: string,
): Array<{ url: string; caption?: string; type: string }> {
  if (configuredGallery && configuredGallery.length > 0) {
    return configuredGallery.map((item) => ({
      url: item.url,
      caption: item.caption,
      type: item.type || 'image',
    }))
  }

  // 如果没有配置，返回空数组
  // 注意：由于静态构建限制，无法自动扫描目录
  // 用户需要在 YAML 中显式配置 gallery，或使用编号约定（需要知道数量）
  return []
}

/**
 * 生成约定式图库路径（辅助函数）
 * 用于用户按编号命名图片时，快速生成路径
 * @param projectId 项目 ID
 * @param count 图片数量
 * @param assetsDir 可选的自定义资源目录
 * @param extension 图片扩展名
 * @returns 图库配置数组
 */
export function generateGalleryPaths(
  projectId: string,
  count: number,
  assetsDir?: string,
  extension: string = 'jpg',
): Array<{ url: string; caption?: string; type: string }> {
  const dir = getProjectAssetsDir(projectId, assetsDir)
  const items: Array<{ url: string; caption?: string; type: string }> = []

  for (let i = 1; i <= count; i++) {
    items.push({
      url: `${dir}/gallery/${i}.${extension}`,
      type: 'image',
    })
  }

  return items
}

/**
 * 解析项目可见性配置
 * 兼容新旧两种配置方式
 * @param visibility 新版 visibility 对象
 * @param showOnHomepage 旧版 showOnHomepage 布尔值
 * @returns 标准化的可见性对象
 */
export function resolveVisibility(
  visibility?: { homepage?: boolean; portfolio?: boolean },
  showOnHomepage?: boolean,
): { homepage: boolean; portfolio: boolean } {
  // 如果有新版配置，使用新版
  if (visibility) {
    return {
      homepage: visibility.homepage ?? true,
      portfolio: visibility.portfolio ?? true,
    }
  }

  // 否则 fallback 到旧版
  const show = showOnHomepage ?? true
  return {
    homepage: show,
    portfolio: show,
  }
}
