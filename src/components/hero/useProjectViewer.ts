import { useRef, useState, useCallback, useEffect } from 'react'
import { useAtomValue } from 'jotai'
import { isMobileAtom } from '@/store/viewport'
import { withBase } from '@/utils/path'
import { debugPathResolution, validateModelPath } from '@/utils/debugPath'
import type { ModelParams } from './ProjectLibrary'

interface ModelViewerState {
  isDragging: boolean
  lastMouseX: number
  lastMouseY: number
}

interface ViewerDimensions {
  width: number
  height: number
}

export const useProjectViewer = (modelParams?: ModelParams, dimensions?: ViewerDimensions) => {
  const mountRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [mouseState, setMouseState] = useState<ModelViewerState>({
    isDragging: false,
    lastMouseX: 0,
    lastMouseY: 0,
  })

  // 检测是否为移动端
  const isMobile = useAtomValue(isMobileAtom)

  // 设置默认尺寸，如果没有传入则使用响应式默认值
  const defaultDimensions = {
    width: isMobile ? 320 : 420,
    height: isMobile ? 240 : 315,
  }
  const rendererDimensions = dimensions || defaultDimensions

  const sceneRef = useRef<any>(null)
  const cameraRef = useRef<any>(null)
  const rendererRef = useRef<any>(null)
  const modelRef = useRef<any>(null)
  const animationIdRef = useRef<number | null>(null)

  // 当前模型的参数
  const currentModelParams = useRef<ModelParams>(
    modelParams || {
      scale: 1.0,
      rotation: { x: 0, y: 0, z: 0 },
      position: { x: 0, y: 0, z: 0 },
      material: {
        metalness: 0.5,
        roughness: 0.5,
        opacity: 1.0,
        transparent: false,
        wireframe: false,
      },
      lighting: { intensity: 1.0, ambientIntensity: 0.4, enableShadows: false },
      animation: { autoRotate: false, rotationSpeed: 1.0, bounceEnabled: true },
    },
  )

  // 使用 ref 来保存旋转状态，避免闭包问题
  const rotationRef = useRef({
    x: 0,
    y: 0,
    baseX: 0,
    baseY: 0,
    targetX: 0, // 目标旋转角度
    targetY: 0,
    initialRotationX: 0, // 从project.yaml读取的初始旋转X
    initialRotationY: 0, // 从project.yaml读取的初始旋转Y
    isReturning: false, // 是否正在回归原位
  })

  // 初始化Three.js场景
  const initScene = useCallback(async () => {
    try {
      console.log('开始初始化Three.js场景...')
      const THREE = await import('three')
      console.log('Three.js导入成功')

      // 创建场景
      const scene = new THREE.Scene()
      sceneRef.current = scene
      console.log('场景创建成功')

      // 创建相机 - 4:3比例
      const camera = new THREE.PerspectiveCamera(50, 4 / 3, 0.1, 1000)
      camera.position.z = 5
      cameraRef.current = camera
      console.log('相机创建成功')

      // 创建渲染器 - 使用传入的尺寸或响应式默认值
      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
      })
      renderer.setSize(rendererDimensions.width, rendererDimensions.height)
      renderer.setClearColor(0x000000, 0)
      renderer.outputColorSpace = THREE.SRGBColorSpace
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      renderer.toneMappingExposure = 1.0

      if (mountRef.current) {
        mountRef.current.appendChild(renderer.domElement)
        console.log('渲染器DOM元素添加成功')
      }
      rendererRef.current = renderer

      // 更新灯光设置
      updateLighting(THREE, scene)
      console.log('灯光设置完成')

      // 启动动画循环
      startAnimation()
      console.log('动画循环启动')

      setIsLoading(false)
      return true
    } catch (error) {
      console.error('Failed to initialize scene:', error)
      setHasError(true)
      setIsLoading(false)
      return false
    }
  }, [])

  // 更新渲染器尺寸
  const updateRendererSize = useCallback((newDimensions: ViewerDimensions) => {
    if (rendererRef.current && cameraRef.current) {
      rendererRef.current.setSize(newDimensions.width, newDimensions.height)
      cameraRef.current.aspect = newDimensions.width / newDimensions.height
      cameraRef.current.updateProjectionMatrix()
      console.log('渲染器尺寸已更新:', newDimensions)
    }
  }, [])

  // 更新灯光设置
  const updateLighting = (THREE: any, scene: any) => {
    // 清除现有灯光
    scene.children = scene.children.filter((child: any) => !child.isLight)

    const params = currentModelParams.current.lighting

    // 增强环境光 - 确保基础亮度
    const ambientLight = new THREE.AmbientLight(0xffffff, params.ambientIntensity * 0.5)
    scene.add(ambientLight)

    // 主方向光 - 模拟太阳光
    const directionalLight = new THREE.DirectionalLight(0xffffff, params.intensity)
    directionalLight.position.set(5, 5, 5)
    directionalLight.castShadow = params.enableShadows
    if (params.enableShadows) {
      directionalLight.shadow.mapSize.width = 1024
      directionalLight.shadow.mapSize.height = 1024
      directionalLight.shadow.camera.near = 0.1
      directionalLight.shadow.camera.far = 50
    }
    scene.add(directionalLight)

    // 补充点光源 - 增强金属质感
    const pointLight1 = new THREE.PointLight(0x4f46e5, params.intensity * 0.3, 100)
    pointLight1.position.set(-5, 3, 5)
    scene.add(pointLight1)

    // 背光 - 增加轮廓
    const pointLight2 = new THREE.PointLight(0xff6b6b, params.intensity * 0.2, 100)
    pointLight2.position.set(3, -3, -5)
    scene.add(pointLight2)

    // 半球光（模拟天空和地面反射）- 增强自然感
    const hemiLight = new THREE.HemisphereLight(0x87ceeb, 0x8b4513, params.intensity * 0.3)
    hemiLight.position.set(0, 10, 0)
    scene.add(hemiLight)

    // 添加额外的柔和填充光
    const fillLight = new THREE.DirectionalLight(0xffffff, params.intensity * 0.2)
    fillLight.position.set(-3, 2, -3)
    scene.add(fillLight)

    console.log('灯光设置完成:', {
      ambient: params.ambientIntensity,
      directional: params.intensity,
      points: [params.intensity * 0.3, params.intensity * 0.2],
      hemisphere: params.intensity * 0.3,
    })
  }

  // 启动动画循环的函数
  const startAnimation = () => {
    const animateFrame = () => {
      animationIdRef.current = requestAnimationFrame(animateFrame)

      if (!rendererRef.current || !sceneRef.current || !cameraRef.current) {
        return
      }

      const time = Date.now() * 0.001

      if (modelRef.current) {
        const params = currentModelParams.current.animation

        // 自动旋转
        if (params.autoRotate && !mouseState.isDragging) {
          modelRef.current.rotation.y += 0.01 * params.rotationSpeed
          rotationRef.current.y = modelRef.current.rotation.y
        }

        // 如果正在回归原位，应用弹性动画
        if (rotationRef.current.isReturning && params.bounceEnabled) {
          const easing = 0.08 // 弹性系数，值越小越慢
          const threshold = 0.01 // 停止阈值

          // 计算距离目标的差值
          const deltaX = rotationRef.current.targetX - rotationRef.current.x
          const deltaY = rotationRef.current.targetY - rotationRef.current.y

          // 应用弹性动画
          rotationRef.current.x += deltaX * easing
          rotationRef.current.y += deltaY * easing

          // 应用到模型
          modelRef.current.rotation.x = rotationRef.current.x
          modelRef.current.rotation.y = rotationRef.current.y

          // 检查是否已经足够接近目标
          if (Math.abs(deltaX) < threshold && Math.abs(deltaY) < threshold) {
            rotationRef.current.x = rotationRef.current.targetX
            rotationRef.current.y = rotationRef.current.targetY
            rotationRef.current.isReturning = false
            console.log('回归动画完成')
          }
        }
        // 如果不在拖拽状态且不在回归状态，保持静止
      }

      rendererRef.current.render(sceneRef.current, cameraRef.current)
    }
    animateFrame()
  }

  // 加载外部3D模型
  const loadExternalModel = useCallback(async (modelPath: string) => {
    try {
      console.log('开始加载外部模型:', modelPath)

      // 调试路径解析
      debugPathResolution(modelPath)

      // 验证模型路径
      if (!validateModelPath(modelPath)) {
        throw new Error(`无效的模型路径: ${modelPath}`)
      }

      // 处理模型路径，确保使用正确的base路径
      const resolvedPath = withBase(modelPath)
      console.log('解析后的模型路径:', resolvedPath)

      // 动态导入THREE和GLTFLoader
      const THREE = await import('three')
      const threeStdlib = await import('three-stdlib')
      const GLTFLoader = threeStdlib.GLTFLoader
      const loader = new GLTFLoader()

      return new Promise((resolve, reject) => {
        loader.load(
          resolvedPath,
          (gltf: any) => {
            console.log('外部模型加载成功:', resolvedPath)
            const model = gltf.scene

            // 优化材质
            model.traverse((child: any) => {
              if (child.isMesh && child.material) {
                const material = child.material
                const matParams = currentModelParams.current.material

                // 确保材质是标准材质
                if (material.type !== 'MeshStandardMaterial') {
                  // 将非标准材质转换为标准材质
                  const newMaterial = new THREE.MeshStandardMaterial({
                    color: material.color || 0xffffff,
                    map: material.map,
                    normalMap: material.normalMap,
                    roughnessMap: material.roughnessMap,
                    metalnessMap: material.metalnessMap,
                    emissiveMap: material.emissiveMap,
                    emissive: material.emissive || 0x000000,
                    transparent: material.transparent || matParams.transparent,
                    opacity: material.opacity || matParams.opacity,
                    roughness:
                      material.roughness !== undefined ? material.roughness : matParams.roughness,
                    metalness:
                      material.metalness !== undefined ? material.metalness : matParams.metalness,
                  })
                  child.material = newMaterial
                  console.log('材质已转换为标准材质')
                } else {
                  // 标准材质的优化

                  // 确保材质正确配置
                  if (material.map) {
                    material.map.colorSpace = THREE.SRGBColorSpace
                    material.map.anisotropy = 4
                  }

                  if (material.normalMap) {
                    material.normalMap.anisotropy = 4
                  }

                  if (material.roughnessMap) {
                    material.roughnessMap.anisotropy = 4
                  }

                  if (material.metalnessMap) {
                    material.metalnessMap.anisotropy = 4
                  }

                  // 保留原始颜色
                  if (!material.color) {
                    material.color = new THREE.Color(0xffffff)
                  }

                  // 应用模型参数中的材质设置
                  if (material.metalness !== undefined) {
                    material.metalness = matParams.metalness
                  } else {
                    material.metalness = matParams.metalness
                  }
                  if (material.roughness !== undefined) {
                    material.roughness = matParams.roughness
                  } else {
                    material.roughness = matParams.roughness
                  }
                  material.transparent = matParams.transparent
                  material.opacity = matParams.opacity
                  material.wireframe = matParams.wireframe
                }

                // 确保材质能正确渲染
                material.needsUpdate = true
              }

              // 启用阴影
              if (child.isMesh && currentModelParams.current.lighting.enableShadows) {
                child.castShadow = true
                child.receiveShadow = true
              }
            })

            // 调整模型大小和位置
            const box = new THREE.Box3().setFromObject(model)
            const center = box.getCenter(new THREE.Vector3())
            const size = box.getSize(new THREE.Vector3())

            // 应用模型参数中的缩放
            const params = currentModelParams.current
            const baseScale = params.scale
            const maxDim = Math.max(size.x, size.y, size.z)
            const autoScale = maxDim > 0 ? 2 / maxDim : 1

            model.scale.setScalar(baseScale * autoScale)
            model.position.sub(center.multiplyScalar(baseScale * autoScale))

            // 应用位置偏移
            model.position.x += params.position.x
            model.position.y += params.position.y
            model.position.z += params.position.z

            // 应用初始旋转
            model.rotation.x = params.rotation.x
            model.rotation.y = params.rotation.y
            model.rotation.z = params.rotation.z

            resolve(model)
          },
          (progress: any) => {
            console.log('加载进度:', progress)
          },
          (error: any) => {
            console.error('外部模型加载失败:', error)
            reject(error)
          },
        )
      })
    } catch (error) {
      console.error('加载外部模型时发生错误:', error)
      throw error
    }
  }, [])

  // 创建模型
  const createModel = useCallback(
    async (modelType: string) => {
      if (!sceneRef.current) {
        console.log('场景未初始化，无法创建模型')
        return false
      }

      try {
        console.log('开始创建模型:', modelType)
        const THREE = await import('three')

        // 清除现有模型
        if (modelRef.current) {
          // 递归清理模型的所有子对象和材质
          const disposeModel = (model: any) => {
            if (model.geometry) {
              model.geometry.dispose()
            }
            if (model.material) {
              if (Array.isArray(model.material)) {
                model.material.forEach((mat: any) => mat.dispose())
              } else {
                model.material.dispose()
              }
            }
            if (model.children) {
              model.children.forEach((child: any) => disposeModel(child))
            }
          }

          disposeModel(modelRef.current)
          sceneRef.current.remove(modelRef.current)
          modelRef.current = null
          console.log('清除现有模型并释放资源')
        }

        // 更新灯光设置
        updateLighting(THREE, sceneRef.current)

        let model: any

        // 检查是否为外部模型路径
        if (
          modelType.startsWith('http') ||
          modelType.startsWith('/') ||
          modelType.startsWith('.')
        ) {
          try {
            model = await loadExternalModel(modelType)
            console.log('加载外部模型:', modelType)
          } catch (error) {
            console.error('外部模型加载失败，使用默认球体:', error)
            model = createSphereModel(THREE)
          }
        } else {
          // 内置几何体模型
          switch (modelType) {
            case 'sphere':
              model = createSphereModel(THREE)
              console.log('创建球体模型')
              break
            case 'cube':
              model = createCubeModel(THREE)
              console.log('创建立方体模型')
              break
            case 'torus':
              model = createTorusModel(THREE)
              console.log('创建圆环模型')
              break
            case 'pyramid':
              model = createPyramidModel(THREE)
              console.log('创建金字塔模型')
              break
            default:
              console.log('未知模型类型，使用默认球体')
              model = createSphereModel(THREE)
          }
        }

        if (model) {
          sceneRef.current.add(model)
          modelRef.current = model

          // 重置旋转状态，使用配置的初始旋转
          const params = currentModelParams.current
          rotationRef.current = {
            x: params.rotation.x,
            y: params.rotation.y,
            baseX: params.rotation.x,
            baseY: params.rotation.y,
            targetX: params.rotation.x,
            targetY: params.rotation.y,
            initialRotationX: params.rotation.x,
            initialRotationY: params.rotation.y,
            isReturning: false,
          }

          console.log('模型创建并添加到场景成功:', modelType)

          // 立即渲染一次
          if (rendererRef.current && cameraRef.current) {
            rendererRef.current.render(sceneRef.current, cameraRef.current)
          }

          return true
        }
        console.log('模型创建失败')
        return false
      } catch (error) {
        console.error('Failed to create model:', error)
        return false
      }
    },
    [loadExternalModel],
  )

  // 创建球体模型
  const createSphereModel = (THREE: any) => {
    const params = currentModelParams.current
    const geometry = new THREE.SphereGeometry(1.5 * params.scale, 32, 32)
    const material = new THREE.MeshPhongMaterial({
      color: 0x4f46e5,
      shininess: 100,
      transparent: params.material.transparent,
      opacity: params.material.opacity,
      specular: 0x8888ff,
      wireframe: params.material.wireframe,
    })

    const sphere = new THREE.Mesh(geometry, material)

    // 应用位置偏移
    sphere.position.set(params.position.x, params.position.y, params.position.z)

    // 应用初始旋转
    sphere.rotation.set(params.rotation.x, params.rotation.y, params.rotation.z)

    // 添加线框（如果不是线框模式）
    if (!params.material.wireframe) {
      const wireframeGeometry = new THREE.SphereGeometry(1.52 * params.scale, 16, 16)
      const wireframeMaterial = new THREE.MeshBasicMaterial({
        color: 0x8888ff,
        wireframe: true,
        transparent: true,
        opacity: 0.3,
      })
      const wireframeSphere = new THREE.Mesh(wireframeGeometry, wireframeMaterial)
      sphere.add(wireframeSphere)

      // 添加标记点
      const markerGeometry = new THREE.SphereGeometry(0.1 * params.scale, 8, 8)
      const markerMaterial = new THREE.MeshPhongMaterial({
        color: 0xff6b6b,
        emissive: 0x330000,
      })

      for (let i = 0; i < 5; i++) {
        const marker = new THREE.Mesh(markerGeometry, markerMaterial)
        const angle = (i / 5) * Math.PI * 2
        marker.position.set(
          Math.cos(angle) * 1.6 * params.scale,
          Math.sin(angle * 1.5) * 0.8 * params.scale,
          Math.sin(angle) * 1.6 * params.scale,
        )
        sphere.add(marker)
      }
    }

    return sphere
  }

  // 创建立方体模型
  const createCubeModel = (THREE: any) => {
    const params = currentModelParams.current
    const geometry = new THREE.BoxGeometry(2 * params.scale, 2 * params.scale, 2 * params.scale)
    const material = new THREE.MeshPhongMaterial({
      color: 0x059669,
      shininess: 100,
      transparent: params.material.transparent,
      opacity: params.material.opacity,
      wireframe: params.material.wireframe,
    })

    const cube = new THREE.Mesh(geometry, material)

    // 应用位置偏移
    cube.position.set(params.position.x, params.position.y, params.position.z)

    // 应用初始旋转
    cube.rotation.set(params.rotation.x, params.rotation.y, params.rotation.z)

    // 添加边框（如果不是线框模式）
    if (!params.material.wireframe) {
      const edges = new THREE.EdgesGeometry(geometry)
      const lineMaterial = new THREE.LineBasicMaterial({ color: 0x10b981 })
      const wireframe = new THREE.LineSegments(edges, lineMaterial)
      cube.add(wireframe)
    }

    return cube
  }

  // 创建圆环模型
  const createTorusModel = (THREE: any) => {
    const params = currentModelParams.current
    const geometry = new THREE.TorusGeometry(1.2 * params.scale, 0.4 * params.scale, 16, 100)
    const material = new THREE.MeshPhongMaterial({
      color: 0xdc2626,
      shininess: 100,
      transparent: params.material.transparent,
      opacity: params.material.opacity,
      wireframe: params.material.wireframe,
    })

    const torus = new THREE.Mesh(geometry, material)

    // 应用位置偏移
    torus.position.set(params.position.x, params.position.y, params.position.z)

    // 应用初始旋转
    torus.rotation.set(params.rotation.x, params.rotation.y, params.rotation.z)

    return torus
  }

  // 创建金字塔模型
  const createPyramidModel = (THREE: any) => {
    const params = currentModelParams.current
    const geometry = new THREE.ConeGeometry(1.5 * params.scale, 2 * params.scale, 4)
    const material = new THREE.MeshPhongMaterial({
      color: 0x7c3aed,
      shininess: 100,
      transparent: params.material.transparent,
      opacity: params.material.opacity,
      wireframe: params.material.wireframe,
    })

    const pyramid = new THREE.Mesh(geometry, material)

    // 应用位置偏移
    pyramid.position.set(params.position.x, params.position.y, params.position.z)

    // 应用初始旋转
    pyramid.rotation.set(params.rotation.x, params.rotation.y, params.rotation.z)

    return pyramid
  }

  // 统一的拖拽开始处理
  const handleDragStart = useCallback((clientX: number, clientY: number) => {
    console.log('Drag start')
    setMouseState((prev) => ({
      ...prev,
      isDragging: true,
      lastMouseX: clientX,
      lastMouseY: clientY,
    }))

    // 记录拖拽开始时的基础旋转
    rotationRef.current.baseX = rotationRef.current.x
    rotationRef.current.baseY = rotationRef.current.y
  }, [])

  // 鼠标事件处理
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (isMobile) return // 移动端不使用鼠标事件
      e.preventDefault()
      handleDragStart(e.clientX, e.clientY)
    },
    [isMobile, handleDragStart],
  )

  // 触摸事件处理
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (!isMobile) return // 桌面端不使用触摸事件
      // 不在这里调用 preventDefault，让全局事件处理器处理
      const touch = e.touches[0]
      if (touch) {
        handleDragStart(touch.clientX, touch.clientY)
      }
    },
    [isMobile, handleDragStart],
  )

  // 使用全局事件处理拖拽和触摸
  useEffect(() => {
    // 统一的拖拽移动处理
    const handleDragMove = (clientX: number, clientY: number) => {
      if (!mouseState.isDragging || !modelRef.current) return

      const deltaX = clientX - mouseState.lastMouseX
      const deltaY = clientY - mouseState.lastMouseY

      // 直接更新旋转值
      rotationRef.current.x = rotationRef.current.baseX + deltaY * 0.01
      rotationRef.current.y = rotationRef.current.baseY + deltaX * 0.01

      // 立即应用到模型
      modelRef.current.rotation.x = rotationRef.current.x
      modelRef.current.rotation.y = rotationRef.current.y

      console.log('Rotating:', rotationRef.current.x, rotationRef.current.y)
    }

    // 统一的拖拽结束处理
    const handleDragEnd = () => {
      if (!mouseState.isDragging) return

      console.log('Drag end - 开始回归动画到初始位置:', {
        initialX: rotationRef.current.initialRotationX,
        initialY: rotationRef.current.initialRotationY,
      })

      // 设置目标位置为配置的初始旋转位置
      rotationRef.current.targetX = rotationRef.current.initialRotationX
      rotationRef.current.targetY = rotationRef.current.initialRotationY
      rotationRef.current.isReturning = true

      setMouseState((prev) => ({
        ...prev,
        isDragging: false,
      }))
    }

    // 鼠标事件
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isMobile) return // 移动端不处理鼠标事件
      handleDragMove(e.clientX, e.clientY)
    }

    const handleGlobalMouseUp = () => {
      if (isMobile) return // 移动端不处理鼠标事件
      handleDragEnd()
    }

    // 触摸事件
    const handleGlobalTouchMove = (e: TouchEvent) => {
      if (!isMobile) return // 桌面端不处理触摸事件
      // 只在拖拽时防止页面滚动
      if (mouseState.isDragging) {
        e.preventDefault()
      }
      const touch = e.touches[0]
      if (touch) {
        handleDragMove(touch.clientX, touch.clientY)
      }
    }

    const handleGlobalTouchEnd = () => {
      if (!isMobile) return // 桌面端不处理触摸事件
      handleDragEnd()
    }

    if (mouseState.isDragging) {
      // 根据设备类型添加相应的事件监听器
      if (isMobile) {
        // 对于 touchmove，我们需要非被动监听器来调用 preventDefault
        document.addEventListener('touchmove', handleGlobalTouchMove, { passive: false })
        document.addEventListener('touchend', handleGlobalTouchEnd, { passive: true })
      } else {
        document.addEventListener('mousemove', handleGlobalMouseMove)
        document.addEventListener('mouseup', handleGlobalMouseUp)
      }
    }

    return () => {
      // 清理所有事件监听器，确保选项匹配
      document.removeEventListener('mousemove', handleGlobalMouseMove)
      document.removeEventListener('mouseup', handleGlobalMouseUp)
      // 移除触摸事件时也要匹配添加时的选项
      document.removeEventListener('touchmove', handleGlobalTouchMove)
      document.removeEventListener('touchend', handleGlobalTouchEnd)
    }
  }, [mouseState.isDragging, mouseState.lastMouseX, mouseState.lastMouseY, isMobile])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    // 这个函数现在不需要做任何事，因为我们使用全局事件
  }, [])

  const handleMouseUp = useCallback(() => {
    // 这个函数也可以保持空，因为全局事件会处理
  }, [])

  // 更新当前模型参数（不重新创建模型）
  const updateCurrentModelParams = useCallback((newParams: ModelParams) => {
    currentModelParams.current = { ...newParams } // 创建新的对象引用
    console.log('更新当前模型参数:', {
      modelParams: currentModelParams.current,
    })

    // 更新旋转状态的初始值
    if (rotationRef.current) {
      rotationRef.current.initialRotationX = newParams.rotation.x
      rotationRef.current.initialRotationY = newParams.rotation.y
      rotationRef.current.targetX = newParams.rotation.x
      rotationRef.current.targetY = newParams.rotation.y
    }
  }, [])

  // 切换项目
  const switchProject = useCallback(
    async (projectType: string) => {
      if (!sceneRef.current) return false

      // 更新当前模型参数 - 每次切换都更新
      if (modelParams) {
        currentModelParams.current = { ...modelParams } // 创建新的对象引用
        console.log('切换项目 - 更新模型参数:', {
          projectType,
          modelParams: currentModelParams.current,
        })
      } else {
        // 如果没有modelParams，重置为默认值
        currentModelParams.current = {
          scale: 1.0,
          rotation: { x: 0, y: 0, z: 0 },
          position: { x: 0, y: 0, z: 0 },
          material: {
            metalness: 0.5,
            roughness: 0.5,
            opacity: 1.0,
            transparent: false,
            wireframe: false,
          },
          lighting: { intensity: 1.0, ambientIntensity: 0.4, enableShadows: false },
          animation: { autoRotate: false, rotationSpeed: 1.0, bounceEnabled: true },
        }
        console.log('切换项目 - 重置模型参数为默认值:', {
          projectType,
          modelParams: currentModelParams.current,
        })
      }

      return await createModel(projectType)
    },
    [modelParams, createModel],
  )

  // 清理资源
  const cleanup = () => {
    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current)
    }
    if (rendererRef.current && mountRef.current && rendererRef.current.domElement) {
      // 检查DOM元素是否仍然存在于父容器中
      if (mountRef.current.contains(rendererRef.current.domElement)) {
        mountRef.current.removeChild(rendererRef.current.domElement)
      }
      rendererRef.current.dispose()
    }
  }

  return {
    mountRef,
    isLoading,
    hasError,
    mouseState,
    initScene,
    switchProject,
    updateCurrentModelParams,
    updateRendererSize,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleTouchStart,
    cleanup,
  }
}
