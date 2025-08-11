---
title: DMT211_算法-07-搜索策略与图表示
date: 2024-07-02
summary: 深入介绍图的搜索策略，包括深度优先搜索(DFS)和广度优先搜索(BFS)的算法原理、实现和应用，以及图的邻接矩阵和邻接表表示方法。
category: DMT211_ALGORITHM
tags:
  - 课程笔记
  - 图算法
  - 搜索策略
  - 数据结构
comments: true
draft: false
sticky: 0
---
# Search Strategy

## Overview
许多问题需要系统地处理所有图的顶点和边。图遍历算法包括：
- 深度优先搜索(Depth-First Search, DFS)
- 广度优先搜索(Breadth-First Search, BFS)

## Depth-First Search (DFS)
- 通过不断远离上一个访问的顶点到未访问的顶点，如果没有未访问的相邻顶点，则回溯。
- 使用栈(Stack)：
  - 当顶点第一次被访问时，将其压入栈中。
  - 当遇到死胡同时，将顶点弹出栈，即没有相邻的未访问顶点时。

## DFS伪代码
```plaintext
CreateStack(S)
Push (S, v)
Mark v as visited ; found=false   //搜索从顶点v开始
While (not (isempty(S) and not found)) do
Begin
  If (stacktop(s) = destination)  //destination = 正在搜索的顶点
    found = true
  Else
  Begin
    If all vertices adjacent to the vertex on the top of the stack had been visited then
      Pop (S)
    Else
    Begin
      Select an unvisited vertex u adjacent to the vertex on the top of the stack
      Push (S, u)
      Mark u as visited
    End
  End
End
```

## DFS示例
从顶点C开始的深度优先遍历可能会按以下顺序访问节点：C, Y, B, A, M, R, G。

## DFS的节点访问顺序和栈变化
```plaintext
Node visited    Stack (bottom -> top)
C               C
Y               C, Y
B               C, Y, B
A               C, Y, B, A
M               C, Y, B, A, M
Pop             C, Y, B, A
Pop             C, Y, B
Pop             C, Y
R               C, Y, R
G               C, Y, R, G
Pop             C, Y, R
Pop             C, Y
Pop             C
Pop             empty
```

## DFS的应用
- 检查连通性，找到连通分量
- 检查无环性
- 找到关节点和双连通分量
- 在问题的状态空间中搜索解（AI）

## Breadth-First Search (BFS)
- 通过移动到上一个访问顶点的所有邻居来访问图顶点。
- 使用队列(Queue)而不是栈。
- 类似于逐层的树遍历。

## BFS伪代码
```plaintext
CreateQueue(Q)
Add(Q,v)
Mark v as visited   //从顶点v开始遍历
While (not Queueisempty(Q)) do
Begin
  w =  QueueFront(Q)
  Remove (Q)
  For each unvisited vertex u adjacent to w do
  Begin
    Mark u as visited
    Add (Q, u)
  End
End
```

## BFS示例
从顶点C开始的广度优先遍历可能会按以下顺序访问节点：C, Y, R, B, G, A, M。

## BFS的节点访问顺序和队列变化
```plaintext
Node visited    Queue (front -> rear)
C               C
Remove          empty
Y               Y
Remove          empty
B               B
R               B, R
Remove          R
A               R, A
Remove          A
G               A, G
Remove          G
M               G, M
Remove          M
Remove          empty
```

## BFS的应用
- 与DFS相同的应用，但也可以找到从一个顶点到所有其他顶点的最短路径（以边的数量为标准）。

## DFS和BFS的比较
|   | Breadth-First Search | Depth-First Search |
|---|----------------------|--------------------|
| 算法 | 顶点为基础 | 边为基础 |
| 数据结构 | 队列 | 栈 |
| 内存消耗 | 低效 | 高效 |
| 遍历顺序 | 先探索最老的未访问顶点 | 沿边探索顶点 |
| 最优性 | 对于找到最短距离最优 | 不最优 |

## 参考文献
- Anany Levitin, *Introduction to the Design and Analysis of Algorithms*, Chapter 3
- Jon Kleinberg, Éva Tardos, *Algorithm Design*, Chapter 3

## Lecture 13 - Supplementary: Graph Representation

### Overview - Graph
图(Graph)是计算机科学中的基本数据结构，有两种常见的存储图的方法：
- 邻接矩阵(Adjacency Matrix)
- 邻接表(Adjacency List)

### Adjacency Matrix
邻接矩阵是一种用行和列表示图中顶点的矩阵。
- 如果两个顶点之间有边，则对应的矩阵元素为1。
- 如果两个顶点之间没有边，则对应的矩阵元素为0。

#### 邻接矩阵的表示
假设图的顶点集合为 \(\{C, Y, R, G, B, A, M\}\)，其邻接矩阵表示如下：

|   | C | Y | R | G | B | A | M |
|---|---|---|---|---|---|---|---|
| C | 0 | 1 | 1 | 0 | 0 | 0 | 0 |
| Y | 1 | 0 | 0 | 0 | 1 | 0 | 0 |
| R | 1 | 0 | 0 | 1 | 0 | 0 | 0 |
| G | 0 | 0 | 1 | 0 | 0 | 1 | 0 |
| B | 0 | 1 | 0 | 0 | 0 | 1 | 1 |
| A | 0 | 0 | 0 | 1 | 1 | 0 | 0 |
| M | 0 | 0 | 0 | 0 | 1 | 0 | 0 |

### Adjacency List
邻接表表示图的方式是将图表示为一个链表数组。
- 数组索引表示每个顶点。
- 每个数组索引的链表元素表示与该顶点形成边的顶点。

#### 邻接表的表示
假设图的顶点集合为 \(\{C, Y, R, G, B, A, M\}\)，其邻接表表示如下：

```plaintext
C -> Y -> R
Y -> C -> B
R -> C -> G
G -> R -> A
B -> Y -> A -> M
A -> G -> B
M -> B
```

### Exercise - Adjacency Matrix
绘制给定图的邻接矩阵表示：

```plaintext
Vertices: C, Y, R, G, B, A, M
```

### Exercise - Adjacency List
绘制给定图的邻接表表示：

```plaintext
Vertices: C, Y, R, G, B, A, M
```

### Additional Resources
- [Graph representation using adjacency lists](https://www.youtube.com/watch?v=k1wraWzqtvQ)
- [Graph representation using adjacency matrix](https://www.youtube.com/watch?v=9C2cpQZVRBA)