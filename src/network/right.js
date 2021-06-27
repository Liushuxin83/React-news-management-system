import { request } from './request'
export function getRightList() {
	return request({
		method: 'GET',
		url: 'rights?_embed=children'
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