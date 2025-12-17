#!/usr/bin/env sh
 
# 忽略错误
set -e  #有错误抛出错误
 
# 构建
yarn run docs:build  #然后执行打包命令
 
# 进入待发布的目录
cd ./dist  #进到dist目录
 
git add -A

git commit -m 'deploy'

git push origin master  #提交到这个分支
 
cd -
 
rm -rf ./dist  #删除dist文件夹