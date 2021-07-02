import React, { useEffect, useState } from 'react'
import { PageHeader, Descriptions } from 'antd';
import { getNewsPreview } from '../../../../network/newManage'
import moment from 'moment'
export default function NewsPreview(props) {
	// console.log(props.match.params.id);
	const [newsPreview, setNewsPreview] = useState(null)
	useEffect(() => {
		getNewsPreview(props.match.params.id).then(res => {
			console.log(res.data);
			setNewsPreview(res.data)
		})
	}, [props.match.params.id])
	const auditStateList = ['未审核', '审核中', '已通过', '未通过']
	const publishStateList = ['未发布', '待发布', '已上线', '已下线']
	return (
		<>
			{
				newsPreview &&
				<>
					<PageHeader
						ghost={false}
						onBack={() => window.history.back()}
						title={newsPreview.title}
						subTitle={newsPreview.category.title}
					>
						<Descriptions size="small" column={3}>
							<Descriptions.Item label="创建者">{newsPreview.author}</Descriptions.Item>
							<Descriptions.Item label="创建时间">{moment(newsPreview.createTime).format('YYYY-MM-DD HH:mm:ss')}	</Descriptions.Item>
							<Descriptions.Item label="发布时间">{newsPreview.publishTime ? moment(newsPreview.publishTime).format('YYYY-MM-DD HH:mm:ss') : '-'}</Descriptions.Item>
							<Descriptions.Item label="区域">{newsPreview.region}</Descriptions.Item>
							<Descriptions.Item label="审核状态">
								<span style={{ color: 'red' }}>{auditStateList[newsPreview.auditState]}</span>
							</Descriptions.Item>
							<Descriptions.Item label="发布状态">
								<span style={{ color: 'red' }}>{publishStateList[newsPreview.publishState]}</span>
							</Descriptions.Item>
							<Descriptions.Item label="访问数量">{newsPreview.view}</Descriptions.Item>
							<Descriptions.Item label="点赞数量">{newsPreview.star}</Descriptions.Item>
							<Descriptions.Item label="评论数量">{0}	</Descriptions.Item>
						</Descriptions>
					</PageHeader>
					<h3 style={{ fontWeight: '700' }}>新闻内容</h3>
					<div style={{ border: '1px solid #000', margin: '10px 24px' }} dangerouslySetInnerHTML={{
						__html: newsPreview.content
					}}></div>
				</>
			}
		</>
	)
}
