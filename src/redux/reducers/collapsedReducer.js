const initState = {
	isCollapsed: false
}
export function collapsedReducer(preState = initState, action) {
	switch (action.type) {
		case 'change_collapsed':
			// 先对老的状态做一个深复制
			let newState = { ...preState }
			newState.isCollapsed = !newState.isCollapsed
			return newState
		default:
			return preState
	}
}