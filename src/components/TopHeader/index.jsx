import React, { useState } from 'react'
import { Layout } from 'antd';
import { Menu, Dropdown } from 'antd';
import { Avatar } from 'antd';
import { withRouter } from 'react-router-dom'
import {
	MenuUnfoldOutlined,
	MenuFoldOutlined,
	UserOutlined
} from '@ant-design/icons';
const { Header } = Layout;
function TopHeader(props) {
	const onQuitLogin = () => {
		// console.log(props);
		localStorage.removeItem('token')
		props.history.replace('/login')
	}
	const user = JSON.parse(localStorage.getItem('token'))
	const menu = (
		<Menu>
			<Menu.Item key={1}>
				{user.role.roleName}
			</Menu.Item>
			<Menu.Item danger key={2} onClick={onQuitLogin}>退出</Menu.Item>
		</Menu>
	);
	const [collapsed, setCollapsed] = useState(false)
	const onChangeCollapsed = () => {
		setCollapsed(!collapsed)
	}
	return (
		<Header className="site-layout-background" style={{ padding: '0 16px', fontSize: '30px' }}>
			{/* {React.createElement(this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
				className: 'trigger',
				onClick: this.toggle,
			})} */}
			{collapsed ? <MenuUnfoldOutlined onClick={onChangeCollapsed} /> : <MenuFoldOutlined onClick={onChangeCollapsed} />}
			<div style={{ float: 'right', lineHeight: '56px' }}>
				<span style={{ fontSize: '20px' }}>欢迎<span style={{ color: '#33a3dc' }}>{user.username}</span>回来</span>
				<Dropdown overlay={menu}>
					<Avatar size={50} icon={<UserOutlined />} />
				</Dropdown>
			</div>
		</Header>
	)
}
export default withRouter(TopHeader)