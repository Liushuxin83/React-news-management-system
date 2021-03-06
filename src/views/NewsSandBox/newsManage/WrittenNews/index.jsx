import React, { useEffect, useRef, useState } from 'react'
import { PageHeader, Steps, Button, Form, Input, Select, message, notification } from 'antd';
import { getNewsCategories, saveNews } from '../../../../network/newManage'
import NewsEditor from './NewsEditor';
import { withRouter } from 'react-router-dom'
import './index.scss'
const { Step } = Steps;
const { Option } = Select
function WrittenNews(props) {
	// 当前步骤条的状态
	const [currentStepsState, setCurrentStepsState] = useState(0)
	const [categoriesList, setCategoriesList] = useState([])
	const newsFormRef = useRef(null)
	const [newFormInfo, setNewFormInfo] = useState({})
	const [newContent, setNewContent] = useState('')
	useEffect(() => {
		getNewsCategories().then(res => {
			// console.log(res);
			setCategoriesList(res.data)
		})
	}, [])
	const handelNext = () => {
		if (currentStepsState === 0) {
			newsFormRef.current.validateFields().then(res => {
				console.log(res);
				setNewFormInfo(res)
				setCurrentStepsState(currentStepsState + 1)
			}).catch(err => {
				console.log(err);
			})
		} else {
			if (newContent === '' || newContent === '<p></p>\n') {
				return message.error('新闻内容不能为空！')
			}
			setCurrentStepsState(currentStepsState + 1)
		}
	}
	const handelPrevious = () => {
		setCurrentStepsState(currentStepsState - 1)
	}
	const getNewsContent = (content) => {
		console.log(content);
		setNewContent(content)
	}
	const user = JSON.parse(localStorage.getItem('token'))
	const handelSave = async (auditState) => {
		// console.log(auditState);
		const newsObj = {
			...newFormInfo,
			"content": newContent,
			"region": user.region ? user.region : '全球',
			"author": user.username,
			"roleId": user.roleId,
			auditState,
			"publishState": 0,
			"createTime": Date.now(),
			"star": 0,
			"view": 0
		}
		const { status } = await saveNews(newsObj)
		// console.log(data, status);
		if (status === 201) {
			props.history.push(auditState === 0 ? '/news-manage/draft' : '/audit-manage/list')
			notification.info({
				message: `通知`,
				description: `您可以到${auditState === 0 ? '草稿箱' : '审核列表'}中查看您的新闻`,
				placement: 'topRight'
			});
		} else {
			message.error('发布新闻失败，服务器错误！')
		}
	}
	return (
		<>
			<PageHeader
				title="撰写新闻"
			/>
			<Steps current={currentStepsState} style={{ marginTop: '30px' }}>
				<Step title="基本信息" description="新闻标题，新闻分类" />
				<Step title="新闻内容" description="新闻主题内容" />
				<Step title="新闻提交" description="保存草稿或提交审核" />
			</Steps>
			<div style={{ marginTop: '50px' }}>
				<div className={currentStepsState === 0 ? '' : 'hidden'}>
					<Form
						labelCol={{ span: 4 }}
						wrapperCol={{ span: 20 }}
						ref={newsFormRef}
					>
						<Form.Item
							label="新闻标题"
							name="title"
							rules={[{ required: true, message: '请输入您的新闻标题！' }]}
						>
							<Input />
						</Form.Item>
						<Form.Item
							label="新闻分类"
							name="categoryId"
							rules={[{ required: true, message: '请选择新闻分类！' }]}
						>
							<Select>
								{
									categoriesList.map(item => {
										return <Option key={item.id}>{item.title}</Option>
									})
								}
							</Select>
						</Form.Item>
					</Form>
				</div>
				<div className={currentStepsState === 1 ? '' : 'hidden'}>
					<NewsEditor getNewsContent={getNewsContent} />
				</div>
				<div className={currentStepsState === 2 ? '' : 'hidden'}>3333333</div>
			</div>
			<div style={{ marginTop: '50px' }}>
				{
					currentStepsState === 2 && <span>
						<Button type="primary" onClick={() => handelSave(0)}>保存到草稿箱</Button>
						<Button type="danger" onClick={() => handelSave(1)}>提交审核</Button>
					</span>
				}
				{
					currentStepsState < 2 && <Button type="primary" onClick={handelNext}>下一步</Button>
				}
				{
					currentStepsState > 0 && <Button type="" onClick={handelPrevious}>上一步</Button>
				}
			</div>
		</>
	)
}
export default withRouter(WrittenNews)