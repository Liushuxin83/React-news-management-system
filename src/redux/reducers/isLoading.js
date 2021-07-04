const initState = {
	isLoading: false
}
export function loadingReducer(preState = initState, action) {
	switch (action.type) {
		case 'change_loading':
			// 先对老的状态做一个深复制
			let newState = { ...preState }
			newState.isLoading = action.payload
			return newState
		default:
			return preState
	}
}