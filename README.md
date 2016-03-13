## Service Oriented Architecture

## 部署方法

1. 安装node.js
    ```
    $ sudo apt-get install nodejs
    $ cd ProjectPath/nodejs
    $ npm install
    ```
2. 安装mongodb
    ```
    $ sudo apt-get install mongodb-server
    # 此时应该已经配置好了mongodb, 如果mongodb没启动, 则使用一下命令启动
    # $ sudo mkdir /data/db
    # $ sudo chown xxx:xxx /data/db
    # $ mongod # 启动mongodb服务器
    $ mongo mongodb/create.js
    ```
3. 运行服务器
    ```
    $ cd nodejs
    $ node nodejs/main.js
    使用某种工具维持该进程执行(如果死掉则重启) node nodejs/pull.js
    ```
4. 配置nginx
    ```
    $ sudo apt-get install nginx
    $ sudo cp nginx/news /etc/nginx/sites-enabled/news
    $ sudo service nginx restarts
    ```
5. 客户端启动方法
    ```
    $ sudo npm install electron-prebuilt -g
    $ cd public && npm install
    $ electron .
    ```

## 清数据库重启方法
    $ mongo mongodb/recreate.js
    重启node nodejs/main.js
    重启node nodejs/pull.js

    
## TODOs
* TODO(assigned to huangruihaocst@126.com)
    - 后端(优先级从高到低)
        - ~~从api获取数据这些代码需要非常鲁棒, 现在的情况是偶尔会崩溃(null pointer?)导致整个服务器退出~~
        - 从api获取数据只能获取20条, 应该加两个字段, offset, count
    - 前端(优先级从高到低)
        - ~~图片显示参差不齐, 需要美化~~
        - 分页 
            - GET /api/news?offset=1&count=30
        - 高级搜索 GET /api/news?keywords=KEYWORDS&date=2016-01-01&date-margin=DATE_MARGIN
            - KEYWORDS: json数组, 必须转义
            - DATE_MARGIN: 整数, 天数
            - 每个字段都是可选项_
        - 照片按照比例缩放
        - 不是把没时间的隐去，是把没有时间的时间隐去
    
* TODO(assigned to Alex Wang)
    - ~~使用supervisor维持服务持续运转~~
    - ~~pull获取更多数据(现在是20条)~~
    - 添加根据日期查询的接口(现在能用,但是不会根据日期查询)
    - 尝试将图片也缓存下来
    - 解析时间
    - 按时间排序

* TODO ()
    - 聚合新闻，⑨个，等XX网站均转载此
    - 兼容IE8
    - ~~bootstrap栅格， 图片和文字的相对位置~~
    - ~~url去重~~