import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router-dom'
import './index.scss'
import { Layout, Menu } from 'antd';
import {
	HomeOutlined,
	UserOutlined,
	AppstoreOutlined,
	RadiusBottomrightOutlined,
	FileDoneOutlined,
	FileSyncOutlined,
	AppstoreAddOutlined
} from '@ant-design/icons';
import { getSideMenu } from '../../network/sideMenu.js'
// 发布订阅模式 通信
import PubSub from 'pubsub-js'
const { Sider } = Layout;
const { SubMenu } = Menu;
function SideMenu(props) {
	const [menuList, setMenuList] = useState([])
	const iconList = {
		'/home': <HomeOutlined />,
		'/user-manage': <UserOutlined />,
		'/user-manage/list': <AppstoreOutlined />,
		'/right-manage': <RadiusBottomrightOutlined />,
		'/right-manage/role/list': <AppstoreOutlined />,
		'/right-manage/right/list': <AppstoreOutlined />,
		'/news-manage': <FileDoneOutlined />,
		'/news-manage/add': <AppstoreOutlined />,
		'/news-manage/draft': <AppstoreOutlined />,
		'/news-manage/category': <AppstoreOutlined />,
		'/audit-manage': <FileSyncOutlined />,
		'/audit-manage/audit': <AppstoreOutlined />,
		'/audit-manage/list': <AppstoreOutlined />,
		'/publish-manage': <AppstoreAddOutlined />,
		'/publish-manage/unpublished': <AppstoreOutlined />,
		'/publish-manage/published': <AppstoreOutlined />,
		'/publish-manage/sunset': <AppstoreOutlined />,
	}
	/**
	 * 这里用一个isPermission函数来判断此用户是否有权限访问一些侧边栏!!!!!!!!!!!!
	 */
	const { role: { rights } } = JSON.parse(localStorage.getItem('token'))
	const isPermission = (item) => {
		// 当前登录用户的权限列表如果包括侧边栏列表时  才会显示相应的本用户侧边栏
		return item.pagepermisson === 1 && rights.includes(item.key)
	}
	const renderMenu = (menuList) => {
		return menuList.map((item) => {
			// 如果item.children为假就不会.length了  一个好用的小技巧
			if (item.children?.length > 0 && isPermission(item)) {
				return <SubMenu key={item.key} icon={iconList[item.key]} title={item.title}>
					{/* 递归 */}
					{renderMenu(item.children)}
				</SubMenu>
			}
			return isPermission(item) && <Menu.Item key={item.key} icon={iconList[item.key]} onClick={() => props.history.push(item.key)}>{item.title}</Menu.Item>
		})
	}
	async function getSideMenuData() {
		const { data } = await getSideMenu()
		// console.log(data);
		setMenuList(data)
	}
	useEffect(() => {
		getSideMenuData()
		PubSub.subscribe('updataSideMenuData', () => {
			getSideMenuData()
		})
	}, [])
	const selectKeys = [props.location.pathname]
	const openKeys = [`/${props.location.pathname.split('/')[1]}`]
	return (
		<Sider trigger={null} collapsible>
			{/* 样式用来控制滚动条的位置在侧边栏 */}
			<div style={{ display: 'flex', height: '100%', flexDirection: 'column' }}>
				<div className="logo">新闻发布系统</div>
				<Menu theme="dark" mode="inline" selectedKeys={selectKeys} defaultOpenKeys={openKeys} style={{ flex: 1, overflow: 'auto' }}>
					{renderMenu(menuList)}
				</Menu>
			</div>
		</Sider>
	)
}
export default withRouter(SideMenu)
