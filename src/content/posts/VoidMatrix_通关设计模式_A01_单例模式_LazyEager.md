---
title: VoidMatrix_通关设计模式-附01-单例模式：Lazy&Eager
date: 2025-05-19
summary: 分析单例模式的两种实现方式：饿汉式（Eager）和懒汉式（Lazy）
category: VoidMatrix_通关设计模式
tags:
  - 课程笔记
  - 单例模式
  - 设计模式
  - 创建型模式
  - 多线程
comments: true
draft: false
sticky: 0
---
其中“饿汉”式在类的初始阶段就实例化单例对象；“懒汉”式则在初次使用时实例化，按需实例的策略在节省资源的同时也造成了潜在的多线程问题：两个线程同时初次调用单例对象时，存在创建多个单例对象的可能，因此“懒汉式“在多线程环境中需要加锁。