import React, { useEffect } from 'react'
import { Form, Button, Input, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import Particles from 'react-particles-js';
import { getLogin } from '../../network/login'
import { withRouter } from 'react-router-dom'
import './index.scss'
function Login(props) {
	// console.log(props.location.pathname);
	useEffect(() => {
		if (props.location.pathname === '/login') localStorage.removeItem('token')
	}, [props.location.pathname])
	const onFinish = async (value) => {
		// value为收集的登录表单数据
		console.log(value);
		const { data } = await getLogin(value)
		console.log(data);
		if (data.length > 0) {
			localStorage.setItem('token', JSON.stringify(data[0]))
			props.history.push('/')
			return message.success('登录成功！')
		}
		return message.error('登录失败，用户名或密码错误！')
	}
	return (
		<div style={{ backgroundColor: 'rgb(35,39,65)', height: '100%', overflow: 'hidden' }}>
			<Particles height={document.documentElement.clientHeight} />
			<div className="form-container">
				<div className="form-title">全球新闻发布管理系统</div>
				<Form
					className="login-form"
					onFinish={onFinish}
				>
					<Form.Item
						name="username"
						rules={[{ required: true, message: 'Please input your Username!' }]}
					>
						<Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
					</Form.Item>
					<Form.Item
						name="password"
						rules={[{ required: true, message: 'Please input your Password!' }]}
					>
						<Input
							prefix={<LockOutlined className="site-form-item-icon" />}
							type="password"
							placeholder="Password"
						/>
					</Form.Item>
					{/* <Form.Item name="remember" valuePropName="checked" noStyle>
					<Checkbox>Remember me</Checkbox>
				</Form.Item> */}
					<Form.Item>
						<Button type="primary" htmlType="submit" className="login-form-button">
							Log in
						</Button>
					</Form.Item>
				</Form>
			</div>
		</div>
	)
}
export default withRouter(Login)
