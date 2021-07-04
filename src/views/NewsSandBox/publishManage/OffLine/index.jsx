import React from 'react'
import { Button } from 'antd'
import NewsPublish from '../../../../components/NewsPublish'
import { usePublish } from '../../../../hooks/usePublish.js'
export default function Published() {
	const { data, handelDelete } = usePublish(3)
	return (
		<div>
			<NewsPublish data={data} publishState={3} button={(item) => <Button type="danger" onClick={() => handelDelete(item)}>删除</Button>}></NewsPublish>
		</div>
	)
}