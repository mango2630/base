# 0. 问题记录

1. npx tsc --init npx 是什么，为什么要 npx ？

2. npx tsc index.ts 为什么要用 npx 运行？

3. 使用 tsc 或 npx tsc, 后面不要加文件，默认全部编译


# 1. 初始化 ts 项目

https://zhuanlan.zhihu.com/p/601222960

# 2. 资料

https://wangdoc.com/typescript/intro

# chapter 1 简介

## 1.1 类型
- 类型（type）指的是一组具有相同特征的值。如果两个值具有某种共同的特征，就可以说，它们属于同一种类型。
- 举例来说，123和456这两个值，共同特征是都能进行数值运算，所以都属于“数值”（number）这个类型。
- 类型是人为添加的一种编程约束和用法提示。


# 让 ts 工程跑起来？
npm i webpack webpack-cli webpack-dev-server -D     

## 开发环境配置
npm run start

## 生产环境配置
npm run build 会自动生成 dist 文件

