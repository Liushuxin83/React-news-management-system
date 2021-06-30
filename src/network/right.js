import { request } from './request'
import axios from 'axios'
export function getRightList() {
	return request({
		method: 'GET',
		url: 'rights?_embed=children'
	})
}
export function getRightAnd() {
	return request({
		method: 'GET',
		url: 'rights'
	})
}
export function getChildrenAnd() {
	return request({
		method: 'GET',
		url: 'children'
	})
}

export function deleteRightItem(id) {
	return request({
		method: 'DELETE',
		url: `rights/${id}`,
	})
}

export function deleteChildRightItem(id) {
	return request({
		method: 'DELETE',
		url: `children/${id}`,
	})
}

export function changePagepermission(id, params = {}) {
	console.log(id, params);
	return new Promise((resolve, reject) => {
		axios.patch(`http://localhost:5000/rights/${id}`, params).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}

export function changeChildPagepermission(id, params = {}) {
	return new Promise((resolve, reject) => {
		axios.patch(`http://localhost:5000/children/${id}`, params).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}

export function getRoleList() {
	return request({
		method: 'GET',
		url: `roles`,
	})
}

export function changeRoleRights(id, params = {}) {
	return new Promise((resolve, reject) => {
		axios.patch(`http://localhost:5000/roles/${id}`, params).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}
