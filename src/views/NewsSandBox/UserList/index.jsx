import React, { useEffect, useRef, useState } from 'react'
import { Table, message, Switch, Button, Tooltip, Modal } from 'antd'
import {
	EditOutlined,
	DeleteOutlined
} from '@ant-design/icons';
import { getUsersList, deleteUser, updateUsersRoleState, updateUserInfo } from '../../../network/users'
import AddUsersForm from './AddusersForm/index';
import UpdateUsersForm from './UpdateUsersForm';
import { getRegionList } from '../../../network/users';
export default function UserList() {
	const [dataSource, setDataSource] = useState([])
	const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false)
	const [isSelectDisable, setIsSelectDisable] = useState(false)
	// 用来保存要更新的数据项
	const [currentUpdateItem, setCurrentUpdateItem] = useState(null)
	const [regionList, setRegionList] = useState([])
	useEffect(() => {
		getRegionList().then(res => {
			setRegionList(res.data)
		})
	}, [])
	const updateUsersFormRef = useRef()
	const cRef = useRef()
	const columns = [
		{
			title: '区域',
			dataIndex: 'region',
			render: (region) => {
				return <b>{region === '' ? '全球' : region}</b>
			},
			// filters是下拉中显示的信息  可筛选项
			filters: [
				...regionList.map(item => ({
					text: item.title,
					value: item.value
				})),
				{
					text: '全球',
					value: '全球'
				}
			],
			//onFilter是满足 条件的filter信息
			onFilter: (value, item) => {
				if (value === '全球') return item.region === ''
				return item.region.includes(value)
			},
		},
		{
			title: '角色名称',
			dataIndex: 'role',
			render: (role) => {
				return role?.roleName
			}
		},
		{
			title: '用户名',
			dataIndex: 'username',
		},
		{
			title: '用户状态',
			dataIndex: 'roleState',
			render: (roleState, item) => {
				// console.log(item);
				return <Switch checked={roleState} disabled={item.default} onChange={() => handelChange(item)}></Switch>
			}
		},
		{
			title: '操作',
			render: (item) => {
				return (
					<>
						<Tooltip title="删除用户">
							<Button type="danger" shape="circle" icon={<DeleteOutlined />} disabled={item.default} onClick={() => onDeleteUser(item)} />
						</Tooltip>
						&nbsp;	&nbsp;	&nbsp;
						<Tooltip title="编辑用户">
							<Button type="primary" shape="circle" icon={<EditOutlined />} disabled={item.default} onClick={() => onUpdateUser(item)} />
						</Tooltip>
					</>
				)
			},
		}
	]
	useEffect(() => {
		getUsersList().then(res => {
			if (res.status === 200) {
				message.success('获取用户列表成功！')
				console.log(res.data);
				setDataSource(res.data)
			} else {
				message.error('获取角色列表失败！')
			}
		})
	}, [])
	const AddUsersFormRef = useRef(null)
	const fromRef = useRef(null)
	const showAddUserModal = () => {
		// console.log(fromRef);
		// console.log(AddUsersFormRef);
		AddUsersFormRef.current.changeVal(true);
	}
	/**
	 * @name: 
	 * @test: test
	 * @msg: 
	 * @param {*} data 添加用户的数据
	 * @param {*} val 收集的表单数据
	 * @param {*} roleList 角色列表数据
	 * @return {*}
	 */
	const updateDataSource = (data, val, roleList) => {
		// 更新DataSource     roleList经过过滤之后会返回一个数组，所以得去下标为0的第一个元素
		setDataSource([...dataSource, { ...data, role: roleList.filter(item => item.id === val.roleId)[0] }])
		// console.log(val);
	}

	//删除用户  点击删除按钮触发此函数
	const onDeleteUser = async (item) => {
		// console.log(item);
		setDataSource(dataSource.filter(val => val.id !== item.id))
		const { status } = await deleteUser(item.id)
		if (status === 200) return message.success('删除此用户成功!')
		return message.error('删除此用户失败!')
	}
	// 更新用户状态
	const handelChange = (item) => {
		// console.log(item);
		item.roleState = !item.roleState
		setDataSource([...dataSource])
		// 同步后端
		updateUsersRoleState(item.id, { roleState: item.roleState })
	}
	//更新用户
	const onUpdateUser = (item) => {
		// console.log(item);
		// 放在异步中  react中状态的更新并不保证是同步的！！！对话框创建之后才设置文本框的值  所以定时器中的语句要同步
		setTimeout(() => {
			setCurrentUpdateItem(item)
			setIsUpdateModalVisible(true)
			if (item.roleId === 1) {
				setIsSelectDisable(true)
			} else {
				setIsSelectDisable(false)
			}
			// console.log(updateUsersFormRef);
			// 显示对话框之后  需要把更新的数据显示到文本框中  对号入座 有座就坐没坐就站着不耽误事  所以把整个item传进setFieldsValue中
			updateUsersFormRef.current.setFieldsValue(item)
		}, 0)
	}
	return (
		<>
			<Button type='primary' onClick={showAddUserModal}>添加用户</Button>
			<Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} rowKey={(item) => item.id}>
			</Table>
			<AddUsersForm cRef={AddUsersFormRef} ref={fromRef} updateDataSource={updateDataSource}></AddUsersForm>
			<Modal
				visible={isUpdateModalVisible}
				title="更新用户"
				okText="更新"
				cancelText="取消"
				onCancel={() => {
					setIsUpdateModalVisible(false)
					setIsSelectDisable(!isSelectDisable)
				}}
				onOk={() => {
					const roleList = cRef.current.getRoleList()
					// console.log(cRef.current.getRoleList())
					// console.log('add')
					// console.log(updateUsersFormRef)
					updateUsersFormRef.current.validateFields().then(value => {
						// value是收集的表单数据
						console.log(value)
						setIsUpdateModalVisible(false)
						// 同步前端
						setDataSource(dataSource.map(item => {
							if (item.id === currentUpdateItem.id) {
								return {
									...item,
									...value,
									role: roleList.filter(val => val.id === value.roleId)[0]
								}
							}
							return item
						}))
						setIsSelectDisable(!isSelectDisable)
						// 同步后端
						updateUserInfo(currentUpdateItem.id, value).then(res => {
							if (res.status === 200) return message.success('更新用户信息成功！')
							return message.error('更新用户信息失败！')
						})
					}).catch(err => {
						console.log(err)
					})
				}}
			>
				<UpdateUsersForm ref={updateUsersFormRef} isSelectDisable={isSelectDisable} cRef={cRef}></UpdateUsersForm>
			</Modal>
		</>
	)
}
