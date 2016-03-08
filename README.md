## Service Oriented Architecture

## 部署方法

1. 安装node.js
    - sudo apt-get install nodejs
    - npm install express # 安装nodejs快捷版
2. 安装mongodb
    - sudo apt-get install mongodb-server
    - sudo mkdir /data/db
    - sudo chown xxx:xxx /data/db
    - mongod # 启动mongodb服务器
    - npm install mongodb # 安装mongodb的nodejs接口
    - mongo # 进入mongodb shell
        - use newsdb
        - db.createCollection('news') # 创建news表
3. 运行服务器
    - node nodejs/main.js
