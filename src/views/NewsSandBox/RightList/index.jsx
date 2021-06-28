import React, { useEffect, useState } from 'react'
import { Table, Tag, Tooltip, Button, Breadcrumb, Modal, Popover, Switch, message } from 'antd'
import {
	EditOutlined,
	DeleteOutlined,
	ExclamationCircleOutlined
} from '@ant-design/icons';
import {
	getRightList,
	deleteRightItem,
	deleteChildRightItem,
	changeChildPagepermission,
	changePagepermission
} from '../../../network/right.js'
// 发布订阅模式 通信
import PubSub from 'pubsub-js'
const { confirm } = Modal;
export default function RightList(props) {
	const [dataSource, setDataSource] = useState([])
	const columns = [
		{
			title: 'ID',
			dataIndex: 'id',
			render: (id) => {
				return <b>{id}</b>
			}
		},
		{
			title: '权限名称',
			dataIndex: 'title',
			render: (title) => {
				return <Tag color="processing">{title}</Tag>
			}
		},
		{
			title: '权限路径',
			dataIndex: 'key',
			render: (key) => {
				return <Tag color="orange">{key}</Tag>
			}
		},
		{
			title: '操作',
			render: (item) => {
				return (
					<>
						<Tooltip title="删除权限">
							<Button type="danger" shape="circle" icon={<DeleteOutlined />} onClick={() => onIsDelete(item)} />
						</Tooltip>
						&nbsp;	&nbsp;	&nbsp;
						<Popover title="配置项" content={<div style={{ textAlign: 'center' }}>
							<Switch checked={item.pagepermisson} onChange={() => changeSwitch(item)}></Switch>
						</div>} trigger={item.pagepermisson === undefined ? '' : 'click'}>
							<Button type="primary" shape="circle" icon={<EditOutlined />} disabled={item.pagepermisson === undefined} />
						</Popover>
					</>
				)
			},
		}
	];
	//点击switch开关
	const changeSwitch = async (item) => {
		item.pagepermisson = item.pagepermisson === 1 ? 0 : 1
		// console.log(item);
		// 渲染前端页面
		setDataSource([...dataSource])
		//更改后端数据
		if (item.grade === 1) {
			const { status } = await changePagepermission(item.id, { pagepermisson: item.pagepermisson })
			// console.log(status);
			if (status === 200) {
				PubSub.publish('updataSideMenuData')
				return message.success(`更改权限配置成功，侧边栏将${item.pagepermisson === 1 ? '拥有' : '失去'}${item.title}权限功能!`, 5);
			}
			return message.error('更改权限配置失败！', 5);
		} else {
			const { status } = await changeChildPagepermission(item.id, { pagepermisson: item.pagepermisson })
			// console.log(status);
			if (status === 200) {
				PubSub.publish('updataSideMenuData')
				return message.success(`更改权限配置成功，侧边栏将${item.pagepermisson === 1 ? '拥有' : '失去'}${item.title}权限功能!`, 5);
			}
			return message.error('更改权限配置失败！', 5);
		}
	}
	// 点击删除按钮
	const onIsDelete = (item) => {
		console.log(item);
		confirm({
			title: '你确定要删除该项吗?',
			icon: <ExclamationCircleOutlined />,
			// content: 'When clicked the OK button, this dialog will be closed after 1 second',
			async onOk() {
				if (item.grade === 1) {
					//这个语句只是同步了前端
					setDataSource(dataSource.filter(dataItem => dataItem.id !== item.id))
					//还需要同步后端
					await deleteRightItem(item.id)
					PubSub.publish('updataSideMenuData')
				} else {
					console.log(item.rightId);
					let list = dataSource.filter((dataItem) => dataItem.id === item.rightId)
					list[0].children = list[0].children.filter((dataItem) => dataItem.id !== item.id)
					//此时DataSource已经收到影响了 filter和浅拷贝差不多
					console.log(list);
					// 这里需要展开 DataSource不然页面不更新
					setDataSource([...dataSource])
					await deleteChildRightItem(item.id)
				}
				// return new Promise((resolve, reject) => {
				// 	setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
				// }).catch(() => console.log('Oops errors!'));
			},
			onCancel() {
				return false
			},
		});
	}
	async function getRightListData() {
		const { data } = await getRightList()
		const list = data
		list.forEach((item) => {
			if (item.children.length === 0) item.children = ''
		})
		setDataSource(list)
		// console.log(data);
	}
	useEffect(() => {
		getRightListData()
	}, [])
	return (
		<>
			<Breadcrumb>
				<Breadcrumb.Item onClick={() => props.history.push('/home')}>
					<span style={{ fontWeight: 700, fontSize: '20px', color: '#000' }}>Home</span>
				</Breadcrumb.Item>
				{dataSource.map((item) => {
					if (item.key === '/' + props.location.pathname.split('/')[1]) {
						return <Breadcrumb.Item key={item.id}>{item.title}</Breadcrumb.Item>
					} else {
						return null
					}
				})}
				{
					dataSource.map(item => {
						return item.children && item.children.map((itemy) => {
							if (itemy.key === props.location.pathname) {
								return <Breadcrumb.Item key={itemy.id}>{itemy.title}</Breadcrumb.Item>
							}
							return null
						})
					})
				}
			</Breadcrumb>
			<Table dataSource={dataSource} columns={columns} style={{ marginTop: '30px' }} pagination={{ pageSize: 5 }} />
		</>
	)
}
