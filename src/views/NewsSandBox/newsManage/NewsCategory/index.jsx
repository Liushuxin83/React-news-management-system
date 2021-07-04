import React, { useEffect, useState, useRef, useContext } from 'react'
import { Table, Tag, Tooltip, Button, Form, Input } from 'antd'
import {
	DeleteOutlined,
} from '@ant-design/icons';
import {
	getNewsCategories,
	deleteNewsCategories,
	updateNewsCategories
} from '../../../../network/newManage'
export default function NewsCategory(props) {
	const [dataSource, setDataSource] = useState([])
	const columns = [
		{
			title: 'ID',
			dataIndex: 'id',
			render: (id) => {
				return <b>{id}</b>
			}
		},
		{
			title: '栏目名称',
			dataIndex: 'title',
			render: (title) => {
				return <Tag color="processing">{title}</Tag>
			},
			onCell: (record) => ({
				record,
				editable: true,
				dataIndex: 'title',
				title: '栏目名称',
				handleSave: handleSave,
			})
		},
		{
			title: '操作',
			render: (item) => {
				return (
					<>
						<Tooltip title="删除分类">
							<Button type="danger" shape="circle" icon={<DeleteOutlined />} onClick={() => deleteNewsCategory(item)} />
						</Tooltip>
					</>
				)
			},
		}
	];
	const deleteNewsCategory = (item) => {
		// console.log(item.id); 
		setDataSource(dataSource.filter(val => val.id !== item.id))
		deleteNewsCategories(item.id)
	}
	async function getRightListData() {
		const { data } = await getNewsCategories()
		console.log(data);
		setDataSource(data)
		// console.log(data);
	}
	useEffect(() => {
		getRightListData()
	}, [])
	const handleSave = (value) => {
		console.log(value);
		setDataSource(dataSource.map(item => {
			if (item.id === value.id) {
				return {
					id: item.id,
					title: value.title,
					value: value.title
				}
			}
			return item
		}))
		updateNewsCategories(value.id, {
			title: value.title,
			value: value.title
		})
	}


	const EditableContext = React.createContext(null);
	const EditableRow = ({ index, ...props }) => {
		const [form] = Form.useForm();
		return (
			<Form form={form} component={false}>
				<EditableContext.Provider value={form}>
					<tr {...props} />
				</EditableContext.Provider>
			</Form>
		);
	};

	const EditableCell = ({
		title,
		editable,
		children,
		dataIndex,
		record,
		handleSave,
		...restProps
	}) => {
		const [editing, setEditing] = useState(false);
		const inputRef = useRef(null);
		const form = useContext(EditableContext);
		useEffect(() => {
			if (editing) {
				inputRef.current.focus();
			}
		}, [editing])
		const toggleEdit = () => {
			setEditing(!editing);
			form.setFieldsValue({
				[dataIndex]: record[dataIndex],
			});
		};

		const save = async () => {
			try {
				const values = await form.validateFields();
				toggleEdit();
				handleSave({ ...record, ...values });
			} catch (errInfo) {
				console.log('Save failed:', errInfo);
			}
		}

		let childNode = children;

		if (editable) {
			childNode = editing ? (
				<Form.Item
					style={{
						margin: 0,
					}}
					name={dataIndex}
					rules={[
						{
							required: true,
							message: `${title} is required.`,
						},
					]}
				>
					<Input ref={inputRef} onPressEnter={save} onBlur={save} />
				</Form.Item>
			) : (
				<div
					className="editable-cell-value-wrap"
					style={{
						paddingRight: 24,
					}}
					onClick={toggleEdit}
				>
					{children}
				</div>
			);
		}

		return <td {...restProps}>{childNode}</td>;
	}
	return (
		<>
			<Table
				dataSource={dataSource}
				columns={columns}
				style={{ marginTop: '30px' }}
				pagination={{ pageSize: 5 }}
				rowKey={item => item.id}
				components={{
					body: {
						row: EditableRow,
						cell: EditableCell,
					},
				}}
			/>
		</>
	)
}
