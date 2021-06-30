import React, { useEffect, useState } from 'react'
import { Table, message, Tooltip, Button, Modal, Tree } from 'antd'
import { DeleteOutlined, UnorderedListOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { getRoleList, getRightList, changeRoleRights } from '../../../network/right'
const { confirm } = Modal;
export default function RoleList() {
	const [dataSource, setDataSource] = useState([])
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [treeData, setTreeData] = useState([])
	const [currentRights, setCurrentRights] = useState([])
	const [currentId, setCurrentId] = useState(0)
	const columns = [
		{
			title: 'ID',
			dataIndex: 'id',
			render: (id) => {
				return <b>{id}</b>
			}
		},
		{
			title: '角色名称',
			dataIndex: 'roleName'
		},
		{
			title: '操作',
			render: (item) => {
				return (
					<>
						<Tooltip title="删除角色">
							<Button type="danger" shape="circle" icon={<DeleteOutlined />} onClick={() => deleteRole(item)} />
						</Tooltip>
						&nbsp;	&nbsp;	&nbsp;
						<Tooltip title="分配权限">
							<Button type="primary" shape="circle" icon={<UnorderedListOutlined />} onClick={() => showDialog(item)} />
						</Tooltip>
					</>
				)
			},
		}
	]
	const deleteRole = (item) => {
		console.log(item);
		confirm({
			title: '你确定要删除该项吗?',
			icon: <ExclamationCircleOutlined />,
			// content: 'When clicked the OK button, this dialog will be closed after 1 second',
			onOk() {
				console.log('ok');
			},
			onCancel() {
				return false
			},
		});
	}
	useEffect(() => {
		getRoleList().then(res => {
			if (res.status === 200) {
				message.success('获取角色列表成功!');
				console.log(res.data);
				setDataSource(res.data)
			} else {
				message.error('获取角色列表失败！');
			}
		})
		getRightList().then(res => {
			console.log(res);
			if (res.status === 200) {
				setTreeData(res.data)
			}
		})
	}, [currentRights])
	const showDialog = (item) => {
		// console.log(item);
		setCurrentRights(item.rights)
		setIsModalVisible(true)
		setCurrentId(item.id)
	}
	const handleOk = () => {
		console.log(currentRights);
		setIsModalVisible(false)
		// 同步 datDataSource
		setDataSource(dataSource.map((item) => {
			if (item.id === currentId) {
				return {
					...item,
					rights: currentRights
				}
			}
			return item
		}))
		// 同步后端
		changeRoleRights(currentId, { rights: currentRights }).then(res => {
			if (res.status === 200) {
				return message.success('更改角色权限成功！')
			}
			return message.error('更改角色权限失败！')
		})
	}
	const handleCancel = () => {
		setIsModalVisible(false)
	}
	// 树形控件 选择后出发该事件
	const onCheck = (checkedKeys) => {
		console.log(checkedKeys);
		setCurrentRights(checkedKeys.checked)
	}
	return (
		<>
			<Table dataSource={dataSource} columns={columns} rowKey={(item) => item.id}></Table>
			<Modal title="权限分配" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
				<Tree
					checkable
					checkedKeys={currentRights}
					treeData={treeData}
					onCheck={onCheck}
					checkStrictly={true}
				/>
			</Modal>
		</>
	)
}
