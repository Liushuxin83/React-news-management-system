import { createStore, combineReducers } from 'redux'
import { collapsedReducer } from './reducers/collapsedReducer'
import { loadingReducer } from './reducers/isLoading'
// 引入redux-devtools-extension
import { composeWithDevTools } from 'redux-devtools-extension'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
const persistConfig = {
	key: 'lsx',
	storage,
	// 用来定制哪些状态需要持久化
	blacklist: ['loadingReducer']
}
const reducer = combineReducers({
	collapsedReducer,
	loadingReducer
})
const persistedReducer = persistReducer(persistConfig, reducer)
let store = createStore(persistedReducer, composeWithDevTools())
let persistor = persistStore(store)

export { store, persistor }

/**
 store.dispatch()

 store.subscribe()
 */
