// 用于发布管理的hooks  公用代码
import { useEffect, useState } from 'react'
import { getPublishedList, deleteNews, updatePublisStateSunset } from '../network/publishManage'
import { updatePublisState } from '../network/auditManage'
import { notification } from 'antd'
export function usePublish(publishState) {
	const [data, setData] = useState([])
	useEffect(() => {
		const { username } = JSON.parse(localStorage.getItem('token'))
		getPublishedList(username, publishState).then(res => {
			// console.log(res);
			setData(res.data)
		})
	}, [publishState])
	const handelPublish = (item) => {
		setData(data.filter(val => val.id !== item.id))
		// 发布
		updatePublisState(item.id).then(() => {
			notification.info({
				message: `通知`,
				description: `发布成功，您可以到发布管理中的已经发布中查看您的新闻`,
				placement: 'topRight'
			});
		})
	}
	const handelSunset = (item) => {
		setData(data.filter(val => val.id !== item.id))
		updatePublisStateSunset(item.id).then((res) => {
			console.log(res);
			notification.info({
				message: `通知`,
				description: `下线成功，您可以到发布管理中的已下线中查看您的新闻`,
				placement: 'topRight'
			});
		})

	}
	const handelDelete = (item) => {
		setData(data.filter(val => val.id !== item.id))
		deleteNews(item.id).then(() => {
			notification.info({
				message: `通知`,
				description: `您已经删除了已下线的新闻`,
				placement: 'topRight'
			});
		})
	}
	return {
		data,
		handelPublish,
		handelSunset,
		handelDelete
	}
}