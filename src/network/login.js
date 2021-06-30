import { request } from './request'
export function getLogin(values = {}) {
	return request({
		method: 'GET',
		url: `users?username=${values.username}&password=${values.password}&roleType=true&_expand=role`
	})
}