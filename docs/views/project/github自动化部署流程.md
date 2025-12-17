## 背景
由于博客搭建在服务器上，每次手动部署不方便，于是想每次更新代码时，网站也同步更新部署，于是乎想到了 github Action 自动部署项目,利用工作流 workflows 来实现 打包 发布 部署

## 环境
- 一台远程服务器
- github项目

## 服务器安装git
现在服务器安装git后才能生成ssh
```shell
yum install git
```

## 添加服务器工具 rsync
rsync:rsync的目的是实现本地主机和远程主机上的文件同步(包括本地推到远程，远程拉到本地两种同步方式)
```shell
yum install rsync
```

## 生成ssh
```shell
ssh-keygen -t rsa -C "your_email@youremail.com"
```

生成的 公钥和私钥保存在 /root/.ssh

id_rsa :公钥

id_rsa.pub：私钥

![image-20231208171108918](http://47.108.95.38:9001/images/image-20231208171108918.png)

## 服务器配置公钥
将服务器生成的公钥复制添加到同级目录文件名称 authorized_keys 里面

![image-20231208172046960](http://47.108.95.38:9001/images/image-20231208172046960.png)


## github配置私钥
在项目所在的仓库中配置私钥：打开项目settings > Secrets and variables > New repository secret
新增 secrets ， 并把服务器生成的私钥复制添加进去

![image-20231208171826256](http://47.108.95.38:9001/images/image-20231208171826256.png)


到这里 环境就基本配置好了，现在开始配置 action workflows工作流
## 配置workFlows
点击项目 actions > 点击new Workflow
选择 Publish Node.js Package

![image-20231208173230819](http://47.108.95.38:9001/images/image-20231208173230819.png)

创建 yml 并配置 yml

```yml
   # 发布项目到自己的服务器上的配置
   name: DeployServer
  # on 表示触发actions的条件
on:
    push:
        branches: [main] #main分支在push的时候会触发
    pull_request:
        branches: [main] #main分支在PR的时候会触发
 
jobs:
    build:
        runs-on: ubuntu-latest #nodejs执行的操作系统
   steps:
        - uses: actions/checkout@v3 #拉取你的最新代码
        - name: Use Node.js
          uses: actions/setup-node@v3
          with:
              node-version: "14.x"  # 指定你的node版本
        # 安装依赖
        - name: yarn install
          run: yarn install
        # 打包
        - name: build
          run: yarn run docs:build
          
        #部署到服务器
        - name: Deploy to Staging My server
          uses: easingthemes/ssh-deploy@v2.1.6
          env:
            #私钥
            SSH_PRIVATE_KEY: ${{ secrets.MY_SERVER_PRIVATE_KEY }} #后面指定为该仓库配置的私钥
            ARGS: "-rltgoDzvO"
            # 源目录，编译后生成的文件目录
            SOURCE: '/dist/'
            #服务器公网地址
            REMOTE_HOST: '47.108.95.38'
            #服务器用户名-一般默认root
            REMOTE_USER: 'root'
            #服务器中，代码部署的位置
            TARGET: '/www/client/daohang/'
            #去除的文件
            EXCLUDE: "/dist/, /node_modules/" 
```
最后就可以 更新仓库，触发workflows ，看看是否工作正常
