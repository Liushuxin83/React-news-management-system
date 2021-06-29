import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { Form, Select, Input } from 'antd'
import { getRegionList, getRolesList } from '../../../../network/users'
const { Option } = Select
const UpdateUsersForm = (props, ref) => {
	// console.log(props.isSelectDisable);
	const [isDisableSelect, setIsDisableSelect] = useState(false)
	// 角色列表
	const [roleList, setRoleList] = useState([])
	// 区域列表
	const [regionList, setRegionList] = useState([])
	useImperativeHandle(props.cRef, () => ({
		getRoleList: () => {
			return roleList
		},
		getRegionList: () => {
			return regionList
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

	useEffect(() => {
		setIsDisableSelect(props.isSelectDisable)
	}, [props.isSelectDisable])
	return (
		<Form
			// layout="vertical"
			ref={ref}
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
	)
}
export default forwardRef(UpdateUsersForm)