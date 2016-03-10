## Service Oriented Architecture

## 部署方法

1. 安装node.js
    - sudo apt-get install nodejs
    - cd ProjectPath/nodejs
    - npm install express --save
    - npm install request --save
    - npm install mongodb --save
2. 安装mongodb
    - sudo apt-get install mongodb-server
        此时应该已经配置好了mongodb, 如果mongodb没启动, 则使用一下命令启动
        - sudo mkdir /data/db
        - sudo chown xxx:xxx /data/db
        - mongod # 启动mongodb服务器
    - mongo # 进入mongodb shell
        - use newsdb
        - db.createCollection('news') # 创建news表
3. 运行服务器
    - cd nodejs
    - node main.js
4. 配置nginx
    - sudo apt-get install nginx
    - sudo nginx/news /etc/nginx/sites-enabled/news
    - sudo service nginx restart
    
5. 浏览器打开http://localhost