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

    // 显示控制
    showOnHomepage: z.boolean().default(true),

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

    // 链接配置
    projectUrl: z.string().optional(),
    postUrl: z.string().optional(),

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
