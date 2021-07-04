import React from 'react'
import { Table } from 'antd'
export default function NewsPublish(props) {
	const columns = [
		{
			title: '新闻标题',
			dataIndex: 'title',
			render: (title, item) => {
				return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
			}
		},
		{
			title: '作者',
			dataIndex: 'author'
		},
		{
			title: '新闻分类',
			dataIndex: 'category',
			render: (category) => {
				return <span>{category.title}</span>
			}
		},
		{
			title: '操作',
			render: (item) => {
				return props.button(item)
			}
		}
	]
	// console.log(props.data);
	return (
		<Table dataSource={props.data} columns={columns} pagination={{ pageSize: 5 }} rowKey={item => item.id}></Table>
	)
}
