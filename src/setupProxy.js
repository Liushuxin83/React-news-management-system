const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function (app) {
	app.use(
		'/ajax',
		createProxyMiddleware({// 遇见  /api1前缀的请求，就会触发该代理配置
			target: 'https://m.maoyan.com',//请求转发给谁
			changeOrigin: true,// 控制服务器收到的响应头中Host字段的值   为true可以完美的欺骗下服务器
			//	pathRewrite: { '^/ajax': '' } // 重写请求路径
		})
	)
}

