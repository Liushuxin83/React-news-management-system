import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import SideMenu from '../../components/SideMenu'
import TopHeader from '../../components/TopHeader'
import Home from './Home'
import UserList from './UserList'
import RoleList from './RoleList'
import RightList from './RightList'
import NoPermission from './NoPermission'
export default function NewsSandBox() {
	return (
		<div>
			NewsSandBox
			<SideMenu />
			<TopHeader />
			<Switch>
				<Route path="/home" component={Home} />
				<Route path="/user-manage/list" component={UserList} />
				<Route path="/right-manage/role/list" component={RoleList} />
				<Route path="/right-manage/right/list" component={RightList} />
				{/* 如果此时是  / 重定向到/home */}
				<Redirect from="/" to="/home" exact />
				<Route path="*" component={NoPermission} />
			</Switch>
		</div>
	)
}
