import React from 'react'
import { Button } from 'antd'
import NewsPublish from '../../../../components/NewsPublish'
import { usePublish } from '../../../../hooks/usePublish.js'
export default function Published() {
	const { data, handelPublish } = usePublish(1)
	return (
		<div>
			<NewsPublish data={data} button={(item) => <Button type="primary" onClick={() => handelPublish(item)}>发布</Button>}></NewsPublish>
		</div>
	)
}
