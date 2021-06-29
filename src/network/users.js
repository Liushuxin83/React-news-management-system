import { request } from './request'
import axios from 'axios'
export function getUsersList() {
	return request({
		method: 'GET',
		url: 'users?_expand=role'
	})
}

export function getRegionList() {
	return request({
		method: 'GET',
		url: 'regions'
	})
}

export function getRolesList() {
	return request({
		method: 'GET',
		url: 'roles'
	})
}

export function addUser(data) {
	return request({
		method: 'POST',
		url: 'users',
		data
	})
}

export function deleteUser(id) {
	return request({
		method: 'DELETE',
		url: `users/${id}`
	})
}

export function updateUsersRoleState(id, params = {}) {
	return new Promise((resolve, reject) => {
		axios.patch(`http://localhost:5000/users/${id}`, params).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}

export function updateUserInfo(id, params = {}) {
	return new Promise((resolve, reject) => {
		axios.patch(`http://localhost:5000/users/${id}`, params).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}