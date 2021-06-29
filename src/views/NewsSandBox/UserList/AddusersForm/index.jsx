import React, { useEffect, forwardRef, useState, useImperativeHandle } from 'react'
import { Modal, Form, Input, Select, message } from 'antd'
import { getRegionList, getRolesList, addUser } from '../../../../network/users'
const { Option } = Select;
// 这是透传Ref  父组件可以获取子组件的子组件的ref
const AddUsersForm = forwardRef(({ cRef, updateDataSource }, ref) => {
	const [form] = Form.useForm();
	const [isAddModalVisible, setIsAddModalVisible] = useState(false)
	// 角色列表
	const [roleList, setRoleList] = useState([])
	// 区域列表
	const [regionList, setRegionList] = useState([])
	const [isDisableSelect, setIsDisableSelect] = useState(false)
	// 此处注意useImperativeHandle方法的的第一个参数是目标元素的ref引用
	useImperativeHandle(cRef, () => ({
		// changeVal 就是暴露给父组件的方法
		changeVal: (newVal) => {
			setIsAddModalVisible(newVal);
		}
	}))

	useEffect(() => {
		getRegionList().then(res => {
			setRegionList(res.data)
		})
	}, [])
	useEffect(() => {
		getRolesList().then(res => {
			// console.log(res.data)
			setRoleList(res.data)
		})
	}, [])
	return (
		<Modal
			visible={isAddModalVisible}
			title="添加用户"
			okText="确定"
			cancelText="取消"
			onCancel={() => { setIsAddModalVisible(false) }}
			onOk={() => {
				// console.log(ref)
				ref.current.validateFields().then(async (val) => {
					// val就是收集 的表单数据
					console.log(val)
					setIsAddModalVisible(false)
					// 先同步到后端，因为此时添加用户后没有id值，需要后端给
					const { status, data } = await addUser({ ...val, "roleState": true, "default": false })
					// console.log(status)
					if (status === 201) {
						message.success('添加用户成功！')
						updateDataSource(data, val, roleList)
						ref.current.resetFields()
					} else {
						message.error('添加用户失败！')
					}

				}).catch(err => {
					console.log(err)
				})
			}}
		>
			<Form
				form={form}
				ref={ref}
			// layout="vertical"
			>
				<Form.Item
					name="username"
					label="用户名"
					rules={[
						{
							required: true,
							message: '请输入用户名!',
						},
					]}
				>
					<Input />
				</Form.Item>
				<Form.Item
					name="password"
					label="密码"
					rules={[
						{
							required: true,
							message: '请输入密码!',
						},
					]}
				>
					<Input />
				</Form.Item>
				<Form.Item
					name="region"
					label="区域"
					rules={isDisableSelect ? [] : [
						{
							required: true,
							message: '请选择区域!',
						},
					]}
				>
					<Select disabled={isDisableSelect}>
						{
							regionList.map(item => {
								return <Option value={item.value} key={item.id}>{item.title}</Option>
							})
						}
					</Select>
				</Form.Item>
				<Form.Item
					name="roleId"
					label="角色"
					rules={[
						{
							required: true,
							message: '请选择角色!',
						},
					]}
				>
					<Select onChange={(value) => {
						if (value === 1) {
							setIsDisableSelect(true)
							ref.current.setFieldsValue({
								region: ''
							})
						} else { setIsDisableSelect(false) }
					}}>
						{
							roleList.map(item => {
								return <Option value={item.id} key={item.id}>{item.roleName}</Option>
							})
						}
					</Select>
				</Form.Item>
			</Form>
		</Modal>
	)
})
export default AddUsersForm
