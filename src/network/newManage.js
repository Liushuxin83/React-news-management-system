import { request } from './request'
import axios from 'axios'
export function getNewsCategories() {
	return request({
		methdo: "GET",
		url: 'categories'
	})
}

export function saveNews(data) {
	return request({
		method: 'POST',
		url: '/news',
		data
	})
}

export function getDraft(author) {
	return request({
		method: 'GET',
		url: `/news?author=${author}&auditState=0&_expand=category`
	})
}

export function deleteDraft(id) {
	return request({
		method: 'DELETE',
		url: `/news/${id}`
	})
}

export function getNewsPreview(id) {
	return request({
		method: 'GET',
		url: `/news/${id}?_expand=category&_expand=role`
	})
}

export function updateNewsPreview(id, params = {}) {
	return new Promise((resolve, reject) => {
		axios.patch(`http://localhost:5000/news/${id}`, params).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}

export function uploadDraft(id) {
	return new Promise((resolve, reject) => {
		axios.patch(`http://localhost:5000/news/${id}`, { auditState: 1 }).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}