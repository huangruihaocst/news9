## Service Oriented Architecture

## 部署方法

1. 安装node.js
    - sudo apt-get install nodejs
    - cd ProjectPath/nodejs
    - npm install express --save
    - npm install request --save
    - npm install mongodb --save
    - npm install sleep --save
1. 安装redis
    - sudo apt-get install redis-server
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
    - redis-server
    - cd nodejs
    - node main.js
4. 配置nginx
    - sudo apt-get install nginx
    - sudo nginx/news /etc/nginx/sites-enabled/news
    - sudo service nginx restart
    
5. 浏览器打开http://localhost

#  TODO(assigned to huangruihaocst@163.com)
    - 后端(优先级从高到低)
        - 从api获取数据这些代码需要非常鲁棒, 现在的情况是偶尔会崩溃(null pointer?)导致整个服务器退出
        - 聚合数据api
        - show 这个源搜索结果都是无关的
        - 从api获取数据只能获取20条, 应该加两个字段, offset, count
    - 前端(优先级从高到低)
        - 图片显示参差不齐, 需要美化
        - 分页 
            - GET /api/news?offset=1&count=30
        - 高级搜索 GET /api/news?keywords=KEYWORDS&date=2016-01-01&date-margin=DATE_MARGIN
            - KEYWORDS: json数组, 必须转义
            - DATE_MARGIN: 整数, 天数
            - 每个字段都是可选项_
    