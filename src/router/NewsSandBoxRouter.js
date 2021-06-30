import React, { useEffect, useState } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import Home from '../views/NewsSandBox/Home'
import UserList from '../views/NewsSandBox/UserList'
import RoleList from '../views/NewsSandBox/RoleList'
import RightList from '../views/NewsSandBox/RightList'
import NoPermission from '../views/NewsSandBox/NoPermission'
import WrittenNews from '../views/NewsSandBox/newsManage/WrittenNews'
import Draft from '../views/NewsSandBox/newsManage/Draft'
import NewsCategory from '../views/NewsSandBox/newsManage/NewsCategory'
import ExamineNews from '../views/NewsSandBox/examineManage/ExamineNews'
import ExamineList from '../views/NewsSandBox/examineManage/ExamineList'
import ToBePublish from '../views/NewsSandBox/publishManage/ToBePublish'
import Published from '../views/NewsSandBox/publishManage/Published'
import OffLine from '../views/NewsSandBox/publishManage/OffLine'
import { getRightAnd, getChildrenAnd } from '../network/right'
export default function NewsSandBoxRouter() {
	const [backRoute, setBackRoute] = useState([])
	const routerMap = {
		"/home": Home,
		"/user-manage/list": UserList,
		"/right-manage/role/list": RoleList,
		"/right-manage/right/list": RightList,
		"/news-manage/add": WrittenNews,
		"/news-manage/draft": Draft,
		"/news-manage/category": NewsCategory,
		"/audit-manage/audit": ExamineNews,
		"/audit-manage/list": ExamineList,
		"/publish-manage/unpublished": ToBePublish,
		"/publish-manage/published": Published,
		"/publish-manage/sunset": OffLine
	}
	useEffect(() => {
		Promise.all([getRightAnd(), getChildrenAnd()]).then(res => {
			// console.log(res);
			setBackRoute([...res[0].data, ...res[1].data])
			console.log([...res[0].data, ...res[1].data]);
		})
	}, [])
	const checkRoute = (item) => {
		return routerMap[item.key] && item.pagepermisson
	}
	const { role: { rights } } = JSON.parse(localStorage.getItem('token'))
	const checkUserPermission = (item) => {
		return rights.includes(item.key)
	}
	return (
		<Switch>
			{backRoute.map(item => {
				// if(有权限){可以访问路由}else不可以访问路由 
				if (checkRoute(item) && checkUserPermission(item)) {
					// 这里得精确匹配 
					return <Route path={item.key} key={item.key} component={routerMap[item.key]} exact />
				} else {
					return null
				}
			})}
			{/* 如果此时是  / 重定向到/home */}
			<Redirect from="/" to="/home" exact />
			{/* 因为最开始的时候backRoute是空数组所有一刷新页面就会NoPermission  所以当backRoute有值后才渲染 */}
			{backRoute.length > 0 && <Route path="*" component={NoPermission} />}

		</Switch>
	)
}
