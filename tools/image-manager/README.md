# 📸 项目图片管理器

一个专为 MyBlog 项目设计的图片资源管理工具，用于管理项目的封面图和 Gallery 图片。

## 功能特性

- ✅ **自动读取项目列表** - 从 `src/content/projects/*.yaml` 自动获取所有项目
- ✅ **拖拽分配** - 将图片拖拽到项目卡片分配为封面或 Gallery
- ✅ **图片裁剪** - 使用 Cropper.js 精细裁剪，坐标自动保存
- ✅ **批量发布** - 一键压缩、裁剪、转换为 WebP 并发布
- ✅ **实时预览** - 即时查看分配效果

## 快速开始

### 安装依赖

```bash
cd tools/image-manager
npm install
```

### 启动开发服务器

```bash
npm run dev
```

这会同时启动：

- 后端 API 服务器：`http://localhost:3456`
- 前端开发服务器：`http://localhost:5173`

打开浏览器访问 `http://localhost:5173` 即可使用。

### 单独启动

```bash
# 仅启动后端
npm run server

# 仅启动前端
npm run client
```

## 使用说明

### 1. 添加原始图片

将原始图片放入 `public/raw-images/` 目录，或通过以下方式导入：

- 拖拽图片到「待分配图片」区域
- 点击「选择文件」按钮
- 使用 Ctrl+V 粘贴截图

### 2. 分配图片

将待分配区域的图片拖拽到项目卡片：

- 拖到封面区域设为封面
- 拖到 Gallery 区域添加到 Gallery

### 3. 裁剪图片

点击图片上的 ✂️ 按钮进入裁剪模式：

- 选择比例（16:9、4:3、1:1 或自由）
- 旋转图片
- 保存裁剪坐标

### 4. 发布

点击底部的「发布到 public/projects/」按钮：

- 自动应用裁剪
- 压缩为 WebP 格式
- 输出到对应项目目录

## 目录结构

```
tools/image-manager/
├── server/                 # 后端代码
│   ├── index.js           # 入口
│   ├── routes/            # API 路由
│   └── services/          # 业务逻辑
├── client/                # 前端代码
│   └── src/
│       ├── components/    # React 组件
│       ├── store/         # 状态管理
│       └── api/           # API 客户端
├── package.json
└── vite.config.ts
```

## 文件命名规则

原始图片目录 (`public/raw-images/`) 中的文件命名：

| 状态    | 格式                                 | 示例                         |
| ------- | ------------------------------------ | ---------------------------- |
| 未分配  | `_pending_{timestamp}.{ext}`         | `_pending_1703750400.png`    |
| 封面    | `{projectId}__cover.{ext}`           | `llm-npc-rpg__cover.png`     |
| Gallery | `{projectId}__gallery_{index}.{ext}` | `llm-npc-rpg__gallery_1.png` |

## 配置文件

配置存储在 `public/raw-images/.image-manager.json`：

```json
{
  "version": 2,
  "settings": {
    "quality": 80,
    "maxWidth": 1920
  },
  "cropData": {
    "filename.png": { "x": 0, "y": 0, "width": 1600, "height": 900 }
  }
}
```

## API 接口

| 方法 | 路径                   | 描述           |
| ---- | ---------------------- | -------------- |
| GET  | `/api/projects`        | 获取所有项目   |
| GET  | `/api/images/pending`  | 获取待分配图片 |
| POST | `/api/images/assign`   | 分配图片       |
| POST | `/api/images/unassign` | 取消分配       |
| POST | `/api/images/crop`     | 保存裁剪数据   |
| POST | `/api/images/publish`  | 发布所有图片   |

## 技术栈

- **后端**: Express, Sharp, YAML
- **前端**: React, Zustand, dnd-kit, Cropper.js
- **构建**: Vite
