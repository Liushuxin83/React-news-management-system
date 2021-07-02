import React, { useEffect, useState } from 'react'
import { message, Table, Tooltip, Button, notification } from 'antd'
import { DeleteOutlined, EditOutlined, VerticalAlignTopOutlined } from '@ant-design/icons';
import { getDraft, deleteDraft, uploadDraft } from '../../../../network/newManage'
export default function Draft(props) {
	const [dataSource, setDataSource] = useState([])
	const deleteDratf = (item) => {
		// console.log(item);
		setDataSource(dataSource.filter(value => value.id !== item.id))
		deleteDraft(item.id)
	}
	// 点击了上传新闻  处方此函数
	const handelCheck = async (id) => {
		// console.log(id);
		const { status } = await uploadDraft(id)
		if (status === 200) {
			props.history.push('/audit-manage/list')
			notification.info({
				message: `通知`,
				description: `上传草稿成功，您可以到审核列表中查看您的新闻`,
				placement: 'topRight'
			});
		} else {
			message.error('服务器错误，上传草稿失败！')
		}
	}
	const columns = [
		{
			title: 'ID',
			dataIndex: 'id',
			render: (id) => {
				return <b>{id}</b>
			}
		},
		{
			title: '新闻标题',
			dataIndex: 'title',
			render: (title, item) => {
				return <Tooltip title="查看详情">
					<span style={{ color: '#33a3dc', cursor: 'pointer' }} onClick={() => props.history.push(`/news-manage/preview/${item.id}`)}>{title}</span>
				</Tooltip>
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
				return category.title
			}
		},
		{
			title: '操作',
			render: (item) => {
				return <>
					<>
						<Tooltip title="删除草稿">
							<Button type="danger" shape="circle" icon={<DeleteOutlined />} onClick={() => deleteDratf(item)} />
						</Tooltip>
						&nbsp;	&nbsp;	&nbsp;
						<Tooltip title="更新草稿">
							<Button type="primary" shape="circle" icon={<EditOutlined />} onClick={() => props.history.push(`/news-manage/update/${item.id}`)} />
						</Tooltip>
						&nbsp;	&nbsp;	&nbsp;
						<Tooltip title="上传草稿">
							<Button type="primary" shape="circle" icon={<VerticalAlignTopOutlined />} onClick={() => handelCheck(item.id)} />
						</Tooltip>
					</>
				</>
			}
		}
	]
	useEffect(() => {
		const { username } = JSON.parse(localStorage.getItem('token'))
		getDraft(username).then(res => {
			if (res.status === 200) {
				message.success(`获取${username}的草稿箱信息成功！`)
				setDataSource(res.data)
			} else {
				message.error(`获取${username}的草稿箱信息失败！`)
			}
			console.log(res);
		})
	}, [])
	return (
		<Table dataSource={dataSource} columns={columns} rowKey={(item) => item.id} pagination={{ pageSize: 5 }}></Table>
	)
}
