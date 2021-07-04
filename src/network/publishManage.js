import { request } from './request'
import axios from 'axios'
export function getPublishedList(username, publishState) {
	return request({
		method: 'GET',
		url: `news?author=${username}&publishState=${publishState}&_expand=category`
	})
}

//下线处理  改publishState为e
export function updatePublisStateSunset(id) {
	return new Promise((resolve, reject) => {
		axios.patch(`http://localhost:5000/news/${id}`, { publishState: 3 }).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}

// 删除已经下线的新闻
export function deleteNews(id) {
	return request({
		method: 'DELETE',
		url: `news/${id}`
	})
}