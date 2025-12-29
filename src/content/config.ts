import { z, defineCollection } from 'astro:content'

const postsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    lastMod: z.date().optional(),
    summary: z.string().optional(),
    cover: z.string().optional(),
    category: z.string().optional(),
    tags: z.array(z.string()).default([]),
    comments: z.boolean().default(true),
    draft: z.boolean().default(false),
    sticky: z.number().default(0),
  }),
})

const projectsCollection = defineCollection({
  type: 'data',
  schema: z.object({
    // 基本信息
    id: z.string(),
    displayName: z.string(),
    description: z.string().optional(),

    // 显示控制 - 新版：分页面控制
    visibility: z
      .object({
        homepage: z.boolean().default(true), // 是否在首页 3D 展示区显示
        portfolio: z.boolean().default(true), // 是否在 /portfolio 时间线页显示
      })
      .default({ homepage: true, portfolio: true }),

    // 显示控制 - 旧版兼容
    showOnHomepage: z.boolean().default(true),

    // 资源目录配置（相对于 /public）
    assetsDir: z.string().optional(), // 默认为 /projects/{id}

    // 3D模型配置
    modelType: z.enum(['sphere', 'cube', 'torus', 'pyramid', 'custom']).default('sphere'),
    modelPath: z.string().optional(),
    color: z.string().default('#4F46E5'),

    // 模型参数配置
    modelParams: z
      .object({
        // 缩放
        scale: z.number().default(1.0),
        // 旋转 (欧拉角，单位：弧度)
        rotation: z
          .object({
            x: z.number().default(0),
            y: z.number().default(0),
            z: z.number().default(0),
          })
          .default({ x: 0, y: 0, z: 0 }),
        // 位置偏移
        position: z
          .object({
            x: z.number().default(0),
            y: z.number().default(0),
            z: z.number().default(0),
          })
          .default({ x: 0, y: 0, z: 0 }),
        // 材质参数
        material: z
          .object({
            metalness: z.number().min(0).max(1).default(0.5),
            roughness: z.number().min(0).max(1).default(0.5),
            opacity: z.number().min(0).max(1).default(1.0),
            transparent: z.boolean().default(false),
            wireframe: z.boolean().default(false),
          })
          .default({
            metalness: 0.5,
            roughness: 0.5,
            opacity: 1.0,
            transparent: false,
            wireframe: false,
          }),
        // 光照设置
        lighting: z
          .object({
            intensity: z.number().default(1.0),
            ambientIntensity: z.number().default(0.4),
            enableShadows: z.boolean().default(false),
          })
          .default({ intensity: 1.0, ambientIntensity: 0.4, enableShadows: false }),
        // 动画设置
        animation: z
          .object({
            autoRotate: z.boolean().default(false),
            rotationSpeed: z.number().default(1.0),
            bounceEnabled: z.boolean().default(true),
          })
          .default({ autoRotate: false, rotationSpeed: 1.0, bounceEnabled: true }),
      })
      .optional(),

    // 链接配置（旧版兼容）
    projectUrl: z.string().optional(),
    postUrl: z.string().optional(),

    // 动态链接列表（推荐使用）
    links: z
      .array(
        z.object({
          type: z.enum(['github', 'report', 'video', 'demo', 'docs', 'download', 'post']),
          url: z.string(),
          label: z.string().optional(), // 可选自定义标签
        }),
      )
      .optional(),

    // 分类和标签
    category: z.string().optional(),
    tags: z.array(z.string()).default([]),

    // 时间信息
    timeText: z.string().optional(),

    // 兼容性字段
    name: z.string().optional(),
    type: z.enum(['built-in', 'custom']).default('built-in'),
    cover: z.string().optional(),
    link: z.string().optional(),

    // 图库 (用于作品集展示)
    gallery: z
      .array(
        z.object({
          url: z.string(),
          caption: z.string().optional(),
          type: z.enum(['image', 'gif', 'video']).default('image'),
        }),
      )
      .optional(),

    // 详细描述 (用于详情页，支持 Markdown)
    longDescription: z.string().optional(),

    // 技术栈详情
    techStack: z.array(z.string()).optional(),

    // 项目亮点
    highlights: z.array(z.string()).optional(),

    // 项目状态
    status: z.enum(['completed', 'in-progress', 'archived']).default('completed'),
  }),
})

const specCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    comments: z.boolean().default(true),
  }),
})

const friendsCollection = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    avatar: z.string(),
    link: z.string().url(),
  }),
})

export const collections = {
  posts: postsCollection,
  projects: projectsCollection,
  spec: specCollection,
  friends: friendsCollection,
}
