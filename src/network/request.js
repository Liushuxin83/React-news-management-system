import axios from 'axios'
import { store } from '../redux/store'
// 导入顶部加载条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
export function request(config) {
	const instance = axios.create({
		baseURL: 'http://localhost:5000/',
		timeout: 10000
	})
	// 拦截器
	// Add a request interceptor
	instance.interceptors.request.use(
		function (config) {
			store.dispatch({ type: 'change_loading', payload: true })
			NProgress.start()
			// Do something before request is sent
			// console.log(config)
			return config
		},
		function (error) {
			// Do something with request error
			return Promise.reject(error)
		}
	)

	// Add a response interceptor
	instance.interceptors.response.use(
		function (response) {
			store.dispatch({ type: 'change_loading', payload: false })
			// Any status code that lie within the range of 2xx cause this function to trigger
			// Do something with response data
			// console.log(response);
			NProgress.done()
			return response
		},
		function (error) {
			store.dispatch({ type: 'change_loading', payload: false })
			// Any status codes that falls outside the range of 2xx cause this function to trigger
			// Do something with response error
			return Promise.reject(error)
		}
	)
	return instance(config)
}