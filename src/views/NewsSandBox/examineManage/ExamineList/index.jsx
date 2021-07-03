import React, { useEffect, useState } from 'react'
import { getAuditList, updateAuditState, updatePublisState } from '../../../../network/auditManage.js'
import { Table, Button, Tag, notification } from 'antd'
export default function ExaminList(props) {
	const [auditList, setAuditList] = useState([])
	const columns = [
		{
			title: '新闻标题',
			dataIndex: 'title',
			render: (title, item) => {
				return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
			}
		},
		{
			title: '作者',
			dataIndex: 'author'
		},
		{
			title: '区域',
			dataIndex: 'region'
		},
		{
			title: '新闻分类',
			dataIndex: 'category',
			render: (category) => {
				return <span>{category.title}</span>
			}
		},
		{
			title: '审核状态',
			dataIndex: 'auditState',
			render: (auditState) => {
				const colorList = ['', 'orange', 'green', 'red']
				const auditList = ['草稿箱', '审核中', '已通过', '未通过']
				return <Tag color={colorList[auditState]}>{auditList[auditState]}</Tag>
			}
		},
		{
			title: '操作',
			render: (item) => {
				return (
					<>
						{item.auditState === 1 && <Button type="primary" onClick={() => onRervert(item)}>撤销</Button>}
						{item.auditState === 2 && <Button type="primary" onClick={() => onPublish(item)}>发布</Button>}
						{item.auditState === 3 && <Button type="primary" onClick={() => props.history.push(`/news-manage/update/${item.id}`)}>更新</Button>}
					</>
				)
			},
		}
	];
	useEffect(() => {
		const { username } = JSON.parse(localStorage.getItem('token'))
		getAuditList(username).then(res => {
			console.log(res.data);
			setAuditList(res.data)
		})
	}, [])
	// 撤销
	const onRervert = (item) => {
		// console.log(item);
		setAuditList(auditList.filter(val => val.id !== item.id))
		updateAuditState(item.id).then(() => {
			notification.info({
				message: `通知`,
				description: `撤销成功，您可以到草稿箱中查看您的新闻`,
				placement: 'topRight'
			});
		})
	}
	// 发布
	const onPublish = (item) => {
		updatePublisState(item.id).then(() => {
			notification.info({
				message: `通知`,
				description: `发布成功，您可以到发布管理中的已经发布中查看您的新闻`,
				placement: 'topRight'
			});
		})
	}
	return (
		<div>
			<Table dataSource={auditList} columns={columns} pagination={{ pageSize: 5 }} rowKey={item => item.id}></Table>
		</div>
	)
}
