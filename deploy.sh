#!/bin/bash

# 导航到项目目录
cd "D:/桌面/图片压缩"

# 初始化Git仓库
git init

# 添加所有文件
git add .

# 提交更改
git commit -m "初始化项目"

# 添加远程仓库
git remote add origin https://github.com/11049981/Jtupianyasuo.git

# 推送到GitHub
git push -u origin main