var app = require('app');  // 控制应用生命周期的模块。
var open = require("open");
var BrowserWindow = require('browser-window');  // 创建原生浏览器窗口的模块

var ServerIndexURL = "https://news.net9.org/index.html";

// 保持一个对于 window 对象的全局引用，不然，当 JavaScript 被 GC，
// window 会被自动地关闭
MainWindow = null;

// 当所有窗口被关闭了，退出。
app.on('window-all-closed', function() {
    // 在 OS X 上，通常用户在明确地按下 Cmd + Q 之前
    // 应用会保持活动状态
    if (process.platform != 'darwin') {
        app.quit();
    }
});

// 当 Electron 完成了初始化并且准备创建浏览器窗口的时候
// 这个方法就被调用
app.on('ready', function() {
    // 创建浏览器窗口。
    MainWindow = new BrowserWindow({
        width: 1024, 
        height: 768,
        nodeIntegration: false, 
        'node-integration': false 
    });

    // 加载应用的 index.html
    if (MainWindow['loadURL']) {
        MainWindow.loadURL(ServerIndexURL);
    }
    else {
        MainWindow.loadUrl(ServerIndexURL);
    }

    // 打开开发工具
    // MainWindow.openDevTools();

    // 当 window 被关闭，这个事件会被发出
    MainWindow.on('closed', function() {
        // 取消引用 window 对象，如果你的应用支持多窗口的话，
        // 通常会把多个 window 对象存放在一个数组里面，
        // 但这次不是。
        mainWindow = null;
    });
    MainWindow.webContents.on('new-window', function(event, url){
        event.preventDefault();
        open(url);
    });
});
