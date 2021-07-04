import React from 'react'
import SideMenu from '../../components/SideMenu'
import TopHeader from '../../components/TopHeader'
import NewsSandBoxRouter from '../../router/NewsSandBoxRouter.js'
import './newsSandBox.scss'
import { Layout, Spin } from 'antd';
import { connect } from 'react-redux'
const { Content } = Layout;
function NewsSandBox(props) {
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
					<Spin size="large" spinning={props.isLoading}>
						<NewsSandBoxRouter />
					</Spin>
				</Content>
			</Layout>
		</Layout>
	)
}
const mapStateToProps = (state) => {
	return {
		isLoading: state.loadingReducer.isLoading
	}
}
export default connect(mapStateToProps)(NewsSandBox)
