import { createStore, applyMiddleware } from 'redux';
import combineReducers from './reducer';
import logger from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
// import thunkMiddleware from 'redux-thunk';
import rootSaga from './saga'; // 引入saga文件
const sagaMiddleware = createSagaMiddleware(); // 创建saga中间件
const store = createStore(combineReducers, applyMiddleware(sagaMiddleware, logger));
// let store = createStore(combineReducers, applyMiddleware(thunkMiddleware));
export default store;
sagaMiddleware.run(rootSaga); // 运行saga, 这个要放在applyMiddleware后面
