---
title: DMT211_算法-04-分治算法与排序
date: 2024-04-30
summary: 深入探讨分治算法的设计思想和应用，包括归并排序、快速排序、大整数乘法、最近点对问题、凸包问题、矩阵乘法、二叉树遍历等经典算法及其复杂度分析。
category: DMT211_Algorithm Analysis and Design
tags:
  - 课程笔记
  - 分治算法
  - 排序算法
  - 算法设计
comments: true
draft: false
sticky: 0
---
# 分治算法概述

分治算法(Divide-and-Conquer)是一种最著名的算法设计策略，主要包括三个步骤：

1. 分解(Divide)：将问题实例分解为两个或多个较小的实例
2. 解决(Conquer)：递归地解决较小的实例 
3. 合并(Combine)：将较小实例的解组合成原始实例的解

## 分治算法的应用实例

- 排序：归并排序(Merge sort)和快速排序(Quick sort) 
- 大整数乘法(Multiplication of large integers)
- [最邻近点对问题（Closest-Pair Problem）](/posts/最邻近点对问题-Closest-Pair-Problem)和凸包(Convex-hull)算法
- 矩阵乘法：Strassen算法
- 二叉树遍历

## 分治算法的一般递归关系

对于规模为$n$的问题，将其分解为$a$个规模为$n/b$的子问题。

令$T(n)$表示规模为$n$的问题的时间复杂度，$f(n)$表示分解和合并子问题的时间代价，那么有如下递归关系：

$$T(n) = aT(\frac{n}{b}) + f(n), \text{for } n=b^k, k=1,2,\dots$$
$$T(1) = c$$

其中$a \geq 1, b > 1, c > 0, f(n) \in \Theta(n^d), d \geq 0$。

### 主定理(Master Theorem)

对于上述递归关系，有以下结论：

- 若$a < b^d$，则$T(n) \in \Theta(n^d)$
- 若$a = b^d$，则$T(n) \in \Theta(n^d \log n)$ 
- 若$a > b^d$，则$T(n) \in \Theta(n^{\log_b a})$

注：对于$O$和$\Omega$记号也有类似的结论。

# 排序算法

## Briefing
### Problem
Given a list of 𝑛 orderable items (e.g., numbers, characters from some alphabets, character strings), rearrange them in ascending order.

### Properties
- **Stable**:  preserves relative order of any two equal elements in input.
- **In-place**: not require extra memory, except, possibly, for a few memory units.
### Brute-Force Solutions ($\Theta (n^2)$)
- Selection Sort
- Bubble Sort
## 归并排序(Merge sort)

归并排序由John von Neumann于1945年发明。其基本思想为：

1. 将数组$A[0..n-1]$平均分成两半，分别拷贝到数组$B$和$C$中
2. 递归地对数组$B$进行排序
3. 递归地对数组$C$进行排序 
4. 将排好序的数组$B$和$C$合并到数组$A$中

### 归并两个有序数组

重复以下步骤，直到其中一个数组中没有剩余元素：

- 比较两个数组中当前未处理部分的第一个元素
- 将较小的元素复制到$A$中，同时将该数组的未处理部分索引加1

一旦一个数组的所有元素都已处理完，就将另一个数组中剩余的未处理元素复制到$A$中。

### 归并排序的分析

假设$n$是2的幂（即$n=2^k$），那么在最坏情况下的关键字比较次数$C_{worst}(n)$满足以下递归关系：

$$C_{worst}(n) = 2C_{worst}(\frac{n}{2}) + n - 1, \text{for } n > 1$$
$$C_{worst}(1) = 0$$

通过反向替换法或主定理可求解得：

$$C_{worst}(n) = n\log_2 n - n + 1 \in \Theta(n\log n)$$

归并排序的所有情况（最好、最坏、平均）的时间复杂度都是$\Theta(n\log n)$，但其空间复杂度为$\Theta(n)$，不是In-Place。

### C++ Code

C++ Code:
```cpp
// C++ program for Merge Sort
#include <bits/stdc++.h>
using namespace std;

// Merges two subarrays of array[].
// First subarray is arr[begin..mid]
// Second subarray is arr[mid+1..end]
void merge(int array[], int const left, int const mid,
           int const right)
{
    int const subArrayOne = mid - left + 1;
    int const subArrayTwo = right - mid;

    // Create temp arrays
    auto *leftArray = new int[subArrayOne],
         *rightArray = new int[subArrayTwo];

    // Copy data to temp arrays leftArray[] and rightArray[]
    for (auto i = 0; i < subArrayOne; i++)
        leftArray[i] = array[left + i];
    for (auto j = 0; j < subArrayTwo; j++)
        rightArray[j] = array[mid + 1 + j];

    auto indexOfSubArrayOne = 0, indexOfSubArrayTwo = 0;
    int indexOfMergedArray = left;

    // Merge the temp arrays back into array[left..right]
    while (indexOfSubArrayOne < subArrayOne
           && indexOfSubArrayTwo < subArrayTwo) {
        if (leftArray[indexOfSubArrayOne]
            <= rightArray[indexOfSubArrayTwo]) {
            array[indexOfMergedArray]
                = leftArray[indexOfSubArrayOne];
            indexOfSubArrayOne++;
        }
        else {
            array[indexOfMergedArray]
                = rightArray[indexOfSubArrayTwo];
            indexOfSubArrayTwo++;
        }
        indexOfMergedArray++;
    }

    // Copy the remaining elements of
    // left[], if there are any
    while (indexOfSubArrayOne < subArrayOne) {
        array[indexOfMergedArray]
            = leftArray[indexOfSubArrayOne];
        indexOfSubArrayOne++;
        indexOfMergedArray++;
    }

    // Copy the remaining elements of
    // right[], if there are any
    while (indexOfSubArrayTwo < subArrayTwo) {
        array[indexOfMergedArray]
            = rightArray[indexOfSubArrayTwo];
        indexOfSubArrayTwo++;
        indexOfMergedArray++;
    }
    delete[] leftArray;
    delete[] rightArray;
}

// begin is for left index and end is right index
// of the sub-array of arr to be sorted
void mergeSort(int array[], int const begin, int const end)
{
    if (begin >= end)
        return;

    int mid = begin + (end - begin) / 2;
    mergeSort(array, begin, mid);
    mergeSort(array, mid + 1, end);
    merge(array, begin, mid, end);
}

// UTILITY FUNCTIONS
// Function to print an array
void printArray(int A[], int size)
{
    for (int i = 0; i < size; i++)
        cout << A[i] << " ";
    cout << endl;
}
// This code is contributed by Mayank Tyagi
// This code was revised by Joshua Estes
// [归并排序 - 数据结构和算法教程 - GeeksforGeeks --- Merge Sort - Data Structure and Algorithms Tutorials - GeeksforGeeks](https://www.geeksforgeeks.org/merge-sort/)
```

## 快速排序(Quick sort) 

快速排序由Tony Hoare于1959年发明，1961年发表。其基本思想为：

1. **分解(Divide)**：
   - 选择一个主元(pivot)，这里取第一个元素
   - 重排数组使得主元左边的元素都小于等于它，右边的元素都大于等于它
   - 将主元与第一个子数组的最后一个元素交换，此时主元在其最终位置上
2. **解决(Conquer)**：递归地对两个子数组进行排序
3. **合并(Combine)**：无需额外操作，因为子数组已经有序

### Hoare’s Partitioning算法

Hoare’s Partitioning算法从数组的两端开始扫描，将元素与主元进行比较：

*Note: may also pick last element or random element or median element as pivot*

- 从左到右扫描（索引$i$），直到遇到一个大于等于主元的元素
- 从右到左扫描（索引$j$），直到遇到一个小于等于主元的元素

当两个扫描索引都停止时：

1. Case1: 
	- 若$i < j$，交换$A[i]$和$A[j]$，增加$i$，减少$j$，继续扫描 (*scanning indices have not crossed*)
2. Case2&3: 
	- 若$i \geq j$，将主元与$A[j]$交换 (*scanning indices have crossed over or point to the same element*)

### 快速排序的分析

- 最好情况：每次划分都将数组均匀地一分为二，递归树的高度为$\log n$，总的划分时间为$O(n)$。此时比较次数$C_{best}(n) \in \Theta(n\log n)$。

- 最坏情况：每次划分都将数组分得尽可能不均匀，此时主元是数组中的最大或最小元素。比较次数为：

$$C_{worst}(n) = n + 1 + n + \dots + 3 = \frac{(n+1)(n+2)}{2} - 3 \in \Theta(n^2)$$

- 平均情况：假设每个划分点$s$都以相同的概率$1/n$出现，那么比较次数约为：

$$C_{avg}(n) \approx 2n\ln n \approx 1.39n\log_2 n$$

即平均情况下，快速排序仅比最好情况多39%的比较次数。一些常见的快速排序改进方法包括：

- 更好的主元选取：随机化快速排序、三数取中划分
- 对小子数组切换到插入排序
- 消除递归

这些优化可使快速排序提速20-25%。

# 大整数乘法

给定两个（大）$n$位整数$a$和$b$，计算$a \times b$。

## 常规的逐位相乘算法

逐位相乘需要$n^2$次一位数乘法，其中$n$是要相乘的数字的位数。例如，两个3位数相乘需要9次乘法。

## 第一个分治算法

以相乘两个2位数$a=12,b=34$为例，我们有：

$$\begin{aligned}
a &= 1 \cdot 10^1 + 2 \cdot 10^0 \\
b &= 3 \cdot 10^1 + 4 \cdot 10^0
\end{aligned}$$

$$\begin{aligned}
a \times b &= (1 \cdot 10^1 + 2 \cdot 10^0) \times (3 \cdot 10^1 + 4 \cdot 10^0) \\
           &= 1 \times 3 \cdot 10^2 + (1 \times 4 + 2 \times 3) \cdot 10^1 + 2 \times 4 \cdot 10^0
\end{aligned}$$

一般地，若$a=a_1a_2, b=b_1b_2$，其中$a$和$b$是$n$位数，$a_1,a_2,b_1,b_2$是$n/2$位数，那么有：

$$a \times b = (a_1 \times b_1) \cdot 10^n + (a_1 \times b_2 + a_2 \times b_1) \cdot 10^{n/2} + (a_2 \times b_2)$$

该算法的单位数字乘法次数$M(n)$满足递归关系：

$$M(n) = 4M(\frac{n}{2}), M(1)=1$$

求解得$M(n) = \Theta(n^2)$，与逐位相乘算法的**效率相同**。

## Karatsuba算法

Karatsuba和Ofman在1962年提出了一种更高效的大整数乘法算法。其思想是将乘法转化为加法和减法：
$$a \times b = (a_1 \times b_1) \cdot 10^n + (a_1 \times b_2 + a_2 \times b_1) \cdot 10^{n/2} + (a_2 \times b_2)$$
$$(a_1 \times b_2 + a_2 \times b_1) = (a_1+a_2) \times (b_1+b_2) - a_1 \times b_1 - a_2 \times b_2$$
- *Example:*
	计算 $123 \times 456$: 
	
	首先将两个因数分割成高位和低位:
	- $a_1 = 12, a_2 = 3$  
	- $b_1 = 45, b_2 = 6$
	
	接下来计算:
	- $a_1 \times b_1 = 12 \times 45 = 540$
	- $a_2 \times b_2 = 3 \times 6 = 18$
	- $(a_1 + a_2) \times (b_1 + b_2) = 15 \times 51 = 765$
	
	然后根据公式:
	$(a_1 \times b_2 + a_2 \times b_1) = (a_1 + a_2) \times (b_1 + b_2) - a_1 \times b_1 - a_2 \times b_2$
	                    $= 765 - 540 - 18$
	                    $= 207$
	
	所以最终结果为:
	$123 \times 456 = (540 \times 10^2) + (207 \times 10) + 18$
	           $= 54000 + 2070 + 18$  
	           $= 56088$

这减少了乘法次数，从4次降到3次。Karatsuba算法的单位数字乘法次数$M(n)$满足递归关系：

$$M(n) = 3M(\frac{n}{2}), M(1)=1$$

求解得$M(n) = \Theta(n^{\log_2 3}) = \Theta(n^{1.58496\dots})$。

大整数乘法在密码学、求pi、寻找大素数、几何和代数问题等领域有广泛应用。目前仍有许多研究致力于寻找更高效的大整数乘法算法。

# 最近点对问题(Closest-Pair Problem)

给定二维平面上的$n$个点，找出其中距离最近的两个点。

## 蛮力算法

计算每对不同点之间的欧几里得距离，返回距离最小的点对的索引。该算法的时间复杂度为$\Theta(n^2)$。

## 分治算法

分治算法的基本思想为：

1. 假设点按$x$坐标升序排列，将点集一分为二（$S_l$和$S_r$各有$n/2$个点） 
2. 递归计算$S_l$和$S_r$中的最近点对，设最近距离分别为$d_l$和$d_r$
3. 令$d = \min\{d_l, d_r\}$，但$d$不一定是全局最小距离（最近点对可能跨越$S_l$和$S_r$）
4. 检查宽度为$2d$的垂直条带内的点对，更新$d$

分治算法的时间复杂度$T(n)$满足递归关系：

$$T(n) = 2T(\frac{n}{2}) + f(n)$$

其中$f(n) \in \Theta(n)$，因此$T(n) \in O(n\log n)$。

# 总结

## 主定理的三种情况

- 若$a < b^d$，则$T(n) \in \Theta(n^d)$
- 若$a = b^d$，则$T(n) \in \Theta(n^d \log n)$
- 若$a > b^d$，则$T(n) \in \Theta(n^{\log_b a})$

## 归并排序

- 所有情况的时间复杂度均为$\Theta(n \log n)$
- 缺点：需要显著的额外存储空间

## 快速排序

- 最好情况（每次都从中间划分）：$\Theta(n \log n)$ 
- 最坏情况（已经有序）：$\Theta(n^2)$
- 平均情况（随机数组）：$\Theta(n \log n)$

## Karatsuba大整数乘法算法

时间复杂度为$\Theta(n^{1.58496\dots})$。

## 最近点对问题

分治算法的时间复杂度为$O(n \log n)$。

# 凸包问题(Convex Hull Problem)

在二维平面上给定一个点集$S$，凸包是包含$S$中所有点的最小凸多边形。

## 蛮力算法

1. 生成点集$S$中所有可能的点对 
2. 对于每个点对，检查其他所有点是否都在由该点对形成的直线的同一侧
3. 如果是，则该点对是凸包上的一条边

该算法的时间复杂度为$O(n^4)$。

## 分治算法

1. 将点集$S$按$x$坐标升序排序，分成两个子集$S_1$和$S_2$，分别包含最左边的$\lfloor n/2 \rfloor$个点和最右边的$\lceil n/2 \rceil$个点
2. 递归地计算$S_1$和$S_2$的凸包$H_1$和$H_2$
3. 合并$H_1$和$H_2$以获得$S$的凸包$H$

合并步骤需要找到$H_1$和$H_2$的公共支撑线（上、下各一条）。可以通过在$H_1$和$H_2$的边界上执行平行的扫描来实现，总时间为$O(n)$。

因此，该分治算法的运行时间$T(n)$满足递归关系：

$$T(n) = 2T(\frac{n}{2}) + O(n)$$

根据主定理，$T(n) = O(n \log n)$。

## Graham扫描算法

Graham扫描是另一种求解凸包的有效算法，其时间复杂度为$O(n \log n)$。

1. 选择$y$坐标最小的点$p_0$（如果有多个，则取最左边的）
2. 以$p_0$为原点，按照其他点与$p_0$连线和$x$轴正方向的夹角排序（如果夹角相同，则距离$p_0$较近的点排在前面）
3. 依次考虑排序后的每个点$p_i$，维护一个栈$S$来存储凸包的顶点：
   - 如果$p_i$在栈顶两点所确定的直线上方，则将$p_i$压入栈中
   - 否则，不断弹出栈顶元素，直到$p_i$在栈顶两点所确定的直线上方，然后将$p_i$压入栈中

可以证明，Graham扫描算法的时间复杂度为$O(n \log n)$。

# 矩阵乘法

给定$n \times n$矩阵$A$和$B$，计算它们的乘积$C = AB$。

## 定义

对于$n \times n$矩阵$A = (a_{ij})$和$B = (b_{ij})$，它们的乘积是$n \times n$矩阵$C = (c_{ij})$，其中

$$c_{ij} = \sum_{k=1}^n a_{ik}b_{kj}$$

## 朴素算法

根据定义，直接计算矩阵乘积的朴素算法需要$n^3$次标量乘法和加法运算。

## Strassen算法

Strassen算法是一种使用分治思想的矩阵乘法算法，其时间复杂度优于朴素算法。

1. 将$A$、$B$、$C$分块为等大小的子矩阵（每个子矩阵的大小为原矩阵的一半）：

$$A = \begin{pmatrix} A_{11} & A_{12} \\ A_{21} & A_{22} \end{pmatrix},
B = \begin{pmatrix} B_{11} & B_{12} \\ B_{21} & B_{22} \end{pmatrix},
C = \begin{pmatrix} C_{11} & C_{12} \\ C_{21} & C_{22} \end{pmatrix}$$

2. 递归地计算10个矩阵乘法（每个乘法的规模为原问题的一半）：

$$\begin{aligned}
M_1 &= (A_{11} + A_{22})(B_{11} + B_{22}) \\
M_2 &= (A_{21} + A_{22})B_{11} \\
M_3 &= A_{11}(B_{12} - B_{22}) \\
M_4 &= A_{22}(B_{21} - B_{11}) \\
M_5 &= (A_{11} + A_{12})B_{22} \\
M_6 &= (A_{21} - A_{11})(B_{11} + B_{12}) \\
M_7 &= (A_{12} - A_{22})(B_{21} + B_{22})
\end{aligned}$$

3. 组合子问题的解以获得原问题的解：

$$\begin{aligned}
C_{11} &= M_1 + M_4 - M_5 + M_7 \\
C_{12} &= M_3 + M_5 \\
C_{21} &= M_2 + M_4 \\
C_{22} &= M_1 - M_2 + M_3 + M_6
\end{aligned}$$

Strassen算法的时间复杂度$T(n)$满足递归关系：

$$T(n) = 7T(\frac{n}{2}) + O(n^2)$$

根据主定理，$T(n) = O(n^{\log_2 7}) \approx O(n^{2.81})$。

尽管Strassen算法在理论上优于朴素算法，但由于其较大的常数因子和较差的数值稳定性，在实践中只有当矩阵规模非常大时才能体现出优势。

# 二叉树遍历

二叉树遍历是一类基本的树算法，包括前序、中序、后序遍历。

## 递归算法

以中序遍历为例，递归算法的伪代码如下：

```
function inorder_traversal(node):
    if node is not null:
        inorder_traversal(node.left)
        visit(node)
        inorder_traversal(node.right)
```

对于一棵有$n$个节点的二叉树，遍历的时间复杂度为$O(n)$，空间复杂度（考虑递归调用栈）为$O(h)$，其中$h$是树的高度。

## Morris遍历算法

Morris遍历算法是一种空间复杂度为$O(1)$的二叉树遍历算法，适用于前序、中序、后序遍历。以中序遍历为例，算法步骤如下：

1. 如果当前节点$cur$的左子树为空，则访问$cur$并将$cur$移动到其右子节点
2. 如果$cur$的左子树不为空，则找到$cur$左子树上最右边的节点（即$cur$的前驱$pre$）：
   - 如果$pre$的右子节点为空，则将其右子节点指向$cur$，并将$cur$移动到其左子节点
   - 如果$pre$的右子节点为$cur$，则将$pre$的右子节点重新设为空（恢复树的原状），访问$cur$，并将$cur$移动到其右子节点
3. 重复上述步骤，直到$cur$为空

Morris遍历算法的时间复杂度为$O(n)$，空间复杂度为$O(1)$。

# 分治算法与动态规划的比较

分治算法和动态规划都是解决复杂问题的重要算法范式，它们在某些问题上有相似之处，但也有明显的区别。

## 相似之处

- 都是将原问题分解为若干个规模较小、结构相似的子问题
- 子问题的解可以合并为原问题的解
- 通常使用递归实现

## 区别

- 子问题的独立性：
  - 分治算法通常假设子问题是相互独立的，不包含公共的子问题
  - 动态规划适用于子问题不独立的情况，子问题之间可能有重叠
- 问题的性质：
  - 分治算法更适合于子问题规模大体相同的问题，如排序、线性时间选择等
  - 动态规划更适合于有优子结构和重叠子问题性质的最优化问题，如矩阵链乘、最长公共子序列等
- 自顶向下与自底向上：
  - 分治算法通常采用自顶向下的递归实现
  - 动态规划可以采用自顶向下的记忆化搜索实现，也可以采用自底向上的迭代实现

总之，分治算法与动态规划都是解决问题的重要工具，需要根据具体问题的性质选择合适的算法。在某些情况下，两种算法可以结合使用以发挥各自的优势。

# 参考文献

- Introduction to Algorithms (3rd Edition) by Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein
- Algorithm Design by Jon Kleinberg, Éva Tardos
- Algorithms (4th Edition) by Robert Sedgewick, Kevin Wayne
- The Algorithm Design Manual (2nd Edition) by Steven S Skiena
- Convex Hull (https://en.wikipedia.org/wiki/Convex_hull)
- Strassen Algorithm (https://en.wikipedia.org/wiki/Strassen_algorithm)
- Morris Traversal (https://en.wikipedia.org/wiki/Tree_traversal#Morris_in-order_traversal_using_threading)