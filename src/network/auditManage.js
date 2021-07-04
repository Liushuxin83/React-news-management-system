import { request } from "./request";
import axios from 'axios'
// 获取审核列表
export function getAuditList(author) {
	//在json-serve中  _ne 是不等于      _lte是小于等于
	return request({
		method: "GET",
		url: `news?author=${author}&auditState_ne=0&publishState_lte=1&_expand=category`
	})
}

//撤销处理  改auditState为0
export function updateAuditState(id) {
	return new Promise((resolve, reject) => {
		axios.patch(`http://localhost:5000/news/${id}`, { auditState: 0 }).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}

//发布处理  改publishState为2
export function updatePublisState(id) {
	return new Promise((resolve, reject) => {
		axios.patch(`http://localhost:5000/news/${id}`, { publishState: 2, publishTime: Date.now() }).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}

export function getAuditNews() {
	return request({
		method: 'GET',
		url: `news?auditState=1&_expand=category`
	})
}

export function updatePublisStateAndAuditState(id, auditState, publishState) {
	return new Promise((resolve, reject) => {
		axios.patch(`http://localhost:5000/news/${id}`, { auditState, publishState }).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}