import React from 'react'
import SideMenu from '../../components/SideMenu'
import TopHeader from '../../components/TopHeader'
import NewsSandBoxRouter from '../../router/NewsSandBoxRouter.js'
import './newsSandBox.scss'
import { Layout } from 'antd';
const { Content } = Layout;
export default function NewsSandBox() {
	return (
		<Layout>
			<SideMenu />
			<Layout className="site-layout">
				<TopHeader />
				<Content
					className="site-layout-background"
					style={{
						margin: '24px 16px',
						padding: 24,
						minHeight: 280,
						overflow: 'auto'
					}}
				>
					<NewsSandBoxRouter />
				</Content>
			</Layout>
		</Layout>
	)
}
