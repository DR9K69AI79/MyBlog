---
title: CG-08-OpenGL函数参考
date: 2024-06-13
summary: 本文档总结了常用的OpenGL函数，包括窗口创建、矩阵操作、绘制设置、光照材质等核心功能函数的详细说明和参数解释。
category: DMT201_Computer Graphics
tags:
  - 课程笔记
  - 计算机图形学
  - OpenGL
  - 函数参考
comments: true
draft: false
sticky: 0
---
# OpenGL 函数总结

1. `#include <windows.h>` 
   - **用途**: 包含Windows操作系统的头文件，用于Windows平台上的开发。
   - **参数**: 无。

2. `glClearColor(0.0, 0.0, 0.0, 1.0);`
   - **用途**: 设置清除颜色缓冲区时使用的颜色。
   - **参数**: 
     - `GLclampf red`: 红色分量（0.0-1.0）。
     - `GLclampf green`: 绿色分量（0.0-1.0）。
     - `GLclampf blue`: 蓝色分量（0.0-1.0）。
     - `GLclampf alpha`: 透明度分量（0.0-1.0）。

3. `glutInit(&argc, argv);`
   - **用途**: 初始化GLUT库。
   - **参数**: 
     - `int *argc`: 参数个数。
     - `char **argv`: 参数数组。

4. `glutCreateWindow("Window Title");`
   - **用途**: 创建一个有指定标题的窗口。
   - **参数**: 
     - `const char *title`: 窗口标题。

5. `glutInitWindowSize(640, 480);`
   - **用途**: 设置窗口的初始宽度和高度。
   - **参数**: 
     - `int width`: 窗口宽度。
     - `int height`: 窗口高度。

6. `glutInitWindowPosition(100, 100);`
   - **用途**: 设置窗口的初始位置。
   - **参数**: 
     - `int x`: 窗口左上角的x坐标。
     - `int y`: 窗口左上角的y坐标。

7. `glutDisplayFunc(display);`
   - **用途**: 注册窗口重绘事件的回调函数。
   - **参数**: 
     - `void (*func)(void)`: 回调函数。

8. `initGL();`
   - **用途**: 自定义的OpenGL初始化函数。
   - **参数**: 无。

9. `glutMainLoop();`
   - **用途**: 进入事件处理循环。
   - **参数**: 无。

10. `#include <GL/gl.h>`
    - **用途**: 包含OpenGL库的头文件。
    - **参数**: 无。

11. `glClear(GL_COLOR_BUFFER_BIT);`
    - **用途**: 清除颜色缓冲区。
    - **参数**: 
      - `GLbitfield mask`: 指定要清除的缓冲区。

12. `glColor3f(1.0, 0.0, 0.0);`
    - **用途**: 设置当前颜色为红色。
    - **参数**: 
      - `GLfloat red`: 红色分量。
      - `GLfloat green`: 绿色分量。
      - `GLfloat blue`: 蓝色分量。

13. `glShadeModel(GL_SMOOTH);`
    - **用途**: 设置平滑着色模型（Gouraud着色）。
    - **参数**: 
    - `GLenum mode`: 着色模型。

14. `glClear(GL_DEPTH_BUFFER_BIT);`
    - **用途**: 清除深度缓冲区。
    - **参数**: 
      - `GLbitfield mask`: 指定要清除的缓冲区。

15. `glMatrixMode(GL_PROJECTION);`
    - **用途**: 设置当前操作的矩阵为投影矩阵。
    - **参数**: 
      - `GLenum mode`: 矩阵模式。

16. `glutTimerFunc(100, timer, 0);`
    - **用途**: 注册一个计时器回调函数。
    - **参数**: 
      - `unsigned int millis`: 毫秒数。
      - `void (*func)(int)`: 回调函数。
      - `int value`: 传递给回调函数的值。

17. `glEnable(GL_DEPTH_TEST);`
    - **用途**: 启用深度测试。
    - **参数**: 
      - `GLenum cap`: 要启用的功能。

18. `glMatrixMode(GL_MODELVIEW);`
    - **用途**: 设置当前操作的矩阵为模型视图矩阵。
    - **参数**: 
      - `GLenum mode`: 矩阵模式。

19. `glTranslatef(-0.5, 0.0, 0.0);`
    - **用途**: 将场景沿x轴移动-0.5个单位。
    - **参数**: 
      - `GLfloat x`: x轴上的平移。
      - `GLfloat y`: y轴上的平移。
      - `GLfloat z`: z轴上的平移。

20. `glutSwapBuffers();`
    - **用途**: 交换前后缓冲区（用于双缓冲）。
    - **参数**: 无。

21. `glutPostRedisplay();`
    - **用途**: 请求重绘窗口。
    - **参数**: 无。

22. `glutTimerFunc(33, timer, 0);`
    - **用途**: 下次计时器回调函数在33毫秒后调用。
    - **参数**: 
      - `unsigned int millis`: 毫秒数。
      - `void (*func)(int)`: 回调函数。
      - `int value`: 传递给回调函数的值。

23. `glViewport(0, 0, windowWidth, windowHeight);`
    - **用途**: 设置视口大小以覆盖新窗口。
    - **参数**: 
      - `GLint x`: 左下角的x坐标。
      - `GLint y`: 左下角的y坐标。
      - `GLsizei width`: 视口的宽度。
      - `GLsizei height`: 视口的高度。

24. `glMatrixMode(GL_PROJECTION);`
    - **用途**: 设置当前操作的矩阵为投影矩阵。
    - **参数**: 
      - `GLenum mode`: 矩阵模式。

25. `glOrtho(0.0, 1.0, 0.0, 1.0, -1.0, 1.0);`
    - **用途**: 设置正交投影矩阵。
    - **参数**: 
      - `GLdouble left`: 左裁剪面。
      - `GLdouble right`: 右裁剪面。
      - `GLdouble bottom`: 下裁剪面。
      - `GLdouble top`: 上裁剪面。
      - `GLdouble zNear`: 近裁剪面。
      - `GLdouble zFar`: 远裁剪面。

```cpp
#include <windows.h> // for MS Windows
glClearColor(0.0, 0.0, 0.0, 1.0); // Set "clearing" or background color Black and opaque
glutInit(&argc, argv); // Initialize GLUT
glutCreateWindow("Window Title"); // Create window with the given title
glutInitWindowSize(640, 480); // Set the window's initial width & height
glutInitWindowPosition(100, 100); // Position the window's initial top-left corner
glutDisplayFunc(display); // Register callback handler for window re-paint event
initGL(); // Our own OpenGL initialization
glutMainLoop(); // Enter the event-processing loop
#include <GL/glut.h> // GLUT, include glu.h and gl.h
glClear(GL_COLOR_BUFFER_BIT); // Clear the color buffer with current clearing color
glColor3f(1.0, 0.0, 0.0); // Red color
glShadeModel(GL_SMOOTH); // Smooth shading- Gouraud shading
glClear(GL_DEPTH_BUFFER_BIT); // Clear the depth buffer
glMatrixMode(GL_PROJECTION); // Set the matrix mode to projection
glutTimerFunc(100, timer, 0); // Registers a timer callback
glEnable(GL_DEPTH_TEST); // Enable depth testing
glMatrixMode(GL_MODELVIEW); // To operate on model-view matrix
glTranslatef(-0.5, 0.0, 0.0); // Move left and into the screen
glutSwapBuffers(); // Swap the front and back frame buffers (double buffering)
glutPostRedisplay(); // Post re-paint request to activate display()
glutTimerFunc(33, timer, 0); // Next timer call 33 milliseconds later
glViewport(0, 0, windowWidth, windowHeight); // Set the viewport to cover the new window
glMatrixMode(GL_PROJECTION); // To operate on the Projection matrix
glOrtho(0.0, 1.0, 0.0, 1.0, -1.0, 1.0); // Set up orthographic projection view 2D

```