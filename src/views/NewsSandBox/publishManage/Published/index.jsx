import React from 'react'
import { Button } from 'antd'
import NewsPublish from '../../../../components/NewsPublish'
import { usePublish } from '../../../../hooks/usePublish.js'
export default function Published() {
	const { data, handelSunset } = usePublish(2)
	return (
		<div>
			<NewsPublish data={data} publishState={2} button={(item) => <Button type="danger" onClick={() => handelSunset(item)}>下线</Button>}></NewsPublish>
		</div>
	)
}