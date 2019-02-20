const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(proxy('/edusoho', {
        target: 'http://chenyufen1.edusoho.cn',
        changeOrigin: true,
        pathRewrite: {
            '^/edusoho' : '',     // 重写请求，比如我们源访问的是api/old-path，那么请求会被解析为/api/new-path
        }   
    }));
};