import React from 'react'
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom'
import Login from '../views/Login'
import NewsSandBox from '../views/NewsSandBox'
export default function IndexRouter() {
	return (
		<HashRouter>
			<Switch>
				<Route path='/login' component={Login} />
				{/* 这就相当于vue中的路由拦截  未授权的跳转到登录页 */}
				<Route path='/' render={() =>
					localStorage.getItem('token') ? <NewsSandBox /> : <Redirect to='/login' />}
				/>
			</Switch>
		</HashRouter>
	)
}
