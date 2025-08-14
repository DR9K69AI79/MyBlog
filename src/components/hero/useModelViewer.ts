import { useRef, useState, useCallback, useEffect } from 'react'
import { useAtomValue } from 'jotai'
import { isMobileAtom } from '@/store/viewport'

interface ModelViewerState {
  isDragging: boolean
  lastMouseX: number
  lastMouseY: number
}

export const useModelViewer = () => {
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

  const sceneRef = useRef<any>(null)
  const cameraRef = useRef<any>(null)
  const rendererRef = useRef<any>(null)
  const modelRef = useRef<any>(null)
  const animationIdRef = useRef<number | null>(null)

  // 使用 ref 来保存旋转状态，避免闭包问题
  const rotationRef = useRef({
    x: 0,
    y: 0,
    baseX: 0,
    baseY: 0,
    targetX: 0, // 目标旋转角度
    targetY: 0,
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

      // 创建相机
      const camera = new THREE.PerspectiveCamera(50, 200 / 200, 0.1, 1000)
      camera.position.z = 5
      cameraRef.current = camera
      console.log('相机创建成功')

      // 创建渲染器
      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
      })
      renderer.setSize(200, 200)
      renderer.setClearColor(0x000000, 0)

      if (mountRef.current) {
        mountRef.current.appendChild(renderer.domElement)
        console.log('渲染器DOM元素添加成功')
      }
      rendererRef.current = renderer

      // 添加灯光
      const ambientLight = new THREE.AmbientLight(0x404040, 0.4)
      scene.add(ambientLight)

      const pointLight1 = new THREE.PointLight(0xffffff, 1, 100)
      pointLight1.position.set(10, 10, 10)
      scene.add(pointLight1)

      const pointLight2 = new THREE.PointLight(0x4f46e5, 0.5, 100)
      pointLight2.position.set(-10, -10, 5)
      scene.add(pointLight2)
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

  // 启动动画循环的函数
  const startAnimation = () => {
    const animateFrame = () => {
      animationIdRef.current = requestAnimationFrame(animateFrame)

      if (!rendererRef.current || !sceneRef.current || !cameraRef.current) {
        return
      }

      if (modelRef.current) {
        // 如果正在回归原位，应用弹性动画
        if (rotationRef.current.isReturning) {
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

  // 创建模型
  const createModel = useCallback(async (modelType: string) => {
    if (!sceneRef.current) {
      console.log('场景未初始化，无法创建模型')
      return false
    }

    try {
      console.log('开始创建模型:', modelType)
      const THREE = await import('three')

      // 清除现有模型
      if (modelRef.current) {
        sceneRef.current.remove(modelRef.current)
        console.log('清除现有模型')
      }

      let model: any

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

      if (model) {
        sceneRef.current.add(model)
        modelRef.current = model

        // 重置旋转状态
        rotationRef.current = {
          x: 0,
          y: 0,
          baseX: 0,
          baseY: 0,
          targetX: 0,
          targetY: 0,
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
  }, [])

  // 创建球体模型
  const createSphereModel = (THREE: any) => {
    const geometry = new THREE.SphereGeometry(1.5, 32, 32)
    const material = new THREE.MeshPhongMaterial({
      color: 0x4f46e5,
      shininess: 100,
      transparent: true,
      opacity: 0.9,
      specular: 0x8888ff,
    })

    const sphere = new THREE.Mesh(geometry, material)

    // 添加线框
    const wireframeGeometry = new THREE.SphereGeometry(1.52, 16, 16)
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0x8888ff,
      wireframe: true,
      transparent: true,
      opacity: 0.3,
    })
    const wireframeSphere = new THREE.Mesh(wireframeGeometry, wireframeMaterial)
    sphere.add(wireframeSphere)

    // 添加标记点
    const markerGeometry = new THREE.SphereGeometry(0.1, 8, 8)
    const markerMaterial = new THREE.MeshPhongMaterial({
      color: 0xff6b6b,
      emissive: 0x330000,
    })

    for (let i = 0; i < 5; i++) {
      const marker = new THREE.Mesh(markerGeometry, markerMaterial)
      const angle = (i / 5) * Math.PI * 2
      marker.position.set(Math.cos(angle) * 1.6, Math.sin(angle * 1.5) * 0.8, Math.sin(angle) * 1.6)
      sphere.add(marker)
    }

    return sphere
  }

  // 创建立方体模型
  const createCubeModel = (THREE: any) => {
    const geometry = new THREE.BoxGeometry(2, 2, 2)
    const material = new THREE.MeshPhongMaterial({
      color: 0x059669,
      shininess: 100,
      transparent: true,
      opacity: 0.9,
    })

    const cube = new THREE.Mesh(geometry, material)

    // 添加边框
    const edges = new THREE.EdgesGeometry(geometry)
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x10b981 })
    const wireframe = new THREE.LineSegments(edges, lineMaterial)
    cube.add(wireframe)

    return cube
  }

  // 创建圆环模型
  const createTorusModel = (THREE: any) => {
    const geometry = new THREE.TorusGeometry(1.2, 0.4, 16, 100)
    const material = new THREE.MeshPhongMaterial({
      color: 0xdc2626,
      shininess: 100,
      transparent: true,
      opacity: 0.9,
    })

    const torus = new THREE.Mesh(geometry, material)
    return torus
  }

  // 创建金字塔模型
  const createPyramidModel = (THREE: any) => {
    const geometry = new THREE.ConeGeometry(1.5, 2, 4)
    const material = new THREE.MeshPhongMaterial({
      color: 0x7c3aed,
      shininess: 100,
      transparent: true,
      opacity: 0.9,
    })

    const pyramid = new THREE.Mesh(geometry, material)
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

      console.log('Drag end - 开始回归动画')

      // 设置目标位置为原始位置
      rotationRef.current.targetX = 0
      rotationRef.current.targetY = 0
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

  // 切换模型
  const switchModel = useCallback(async (modelType: string) => {
    if (!sceneRef.current) return false
    return await createModel(modelType)
  }, [])

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
    switchModel,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleTouchStart,
    cleanup,
  }
}
