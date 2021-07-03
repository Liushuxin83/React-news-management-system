import React, { useEffect, useState } from 'react'
import { Table, Button, message } from 'antd'
import { getAuditNews, updatePublisStateAndAuditState } from '../../../../network/auditManage.js'
export default function ExamineNews() {
	const [dataSource, setDataSource] = useState([])
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
			title: '新闻分类',
			dataIndex: 'category',
			render: (category) => {
				return <span>{category.title}</span>
			}
		},
		{
			title: '操作',
			render: (item) => {
				return <>
					<Button type="primary" onClick={() => handelAuditState(item, 2, 1)}>通过</Button>
					&nbsp;&nbsp;&nbsp;
					<Button type="danger" onClick={() => handelAuditState(item, 3, 0)}>驳回</Button>
				</>
			}
		}
	]
	const handelAuditState = async (item, auditStata, publihState) => {
		// console.log(item);
		// 同步前端
		setDataSource(dataSource.filter(val => val.id !== item.id))
		// 同步后端
		const { status } = await updatePublisStateAndAuditState(item.id, auditStata, publihState)
		if (status === 200 && auditStata === 2 && publihState === 1) {
			message.success(`${item.author}的${item.title}文章已经通过审核`)
		} else if (status === 200 && auditStata === 3 && publihState === 0) {
			message.success(`${item.author}的${item.title}文章已经被驳回`)
		} else {
			message.error('服务器错误，操作失败')
		}
	}
	useEffect(() => {
		const { role: { roleType }, region, username } = JSON.parse(localStorage.getItem('token'))
		const roleObj = {
			"1": 'superadmin',
			"2": 'admin',
			"3": 'editor'
		}
		getAuditNews().then(res => {
			console.log(res);
			setDataSource(roleObj[roleType] === 'superadmin' ? res.data : [
				// 如果是管理员 先把自己过滤出来然后再把管理员旗下的用户过滤出来  编辑是看不到用户列表的所以不应管了
				...res.data.filter(item => item.author === username),
				...res.data.filter(item => item.region === region && roleObj[item.roleId] === 'editor')
			])
		})
	}, [])
	return (
		<Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} rowKey={item => item.id}></Table>
	)
}
