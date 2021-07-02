import React, { useEffect, useRef, useState } from 'react'
import { PageHeader, Steps, Button, Form, Input, Select, message, notification } from 'antd';
import { getNewsCategories, updateNewsPreview, getNewsPreview } from '../../../../network/newManage'
import NewsEditor from '../WrittenNews/NewsEditor';
import { withRouter } from 'react-router-dom'
import '../WrittenNews/index.scss'
const { Step } = Steps;
const { Option } = Select
function UpdateNewsPreview(props) {
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
	useEffect(() => {
		// 根据id获取新闻详情
		getNewsPreview(props.match.params.id).then(res => {
			// console.log(res.data);
			let { title, categoryId, content } = res.data
			newsFormRef.current.setFieldsValue({
				title,
				categoryId
			})
			setNewContent(content)
		})
	}, [props.match.params.id])
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
		// console.log(content);
		setNewContent(content)
	}
	const handelSave = async (auditState) => {
		// console.log(auditState);
		const newsObj = {
			...newFormInfo,
			"content": newContent,
			auditState
		}
		const { status } = await updateNewsPreview(props.match.params.id, newsObj)
		// console.log(status);
		// console.log(data, status);
		if (status === 200) {
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
				title="更新新闻"
				onBack={() => props.history.goBack()}
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
					<NewsEditor getNewsContent={getNewsContent} content={newContent} />
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
export default withRouter(UpdateNewsPreview)