import { request } from './request'
export function getSideMenu() {
	return request({
		method: 'GET',
		url: 'rights?_embed=children'
	})
}