import { call, put, take, takeEvery, select, join, fork } from 'redux-saga/effects'; // 纯函数
import { ASYNCDATA, LOADINGSTART, LOADINGEND } from '../actions/demoAction';
import Type from '../types/redux-type';
function* asyncDataAction(action) {
    const sleep = time => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({
                    data: '欢迎使用reactor'
                });
            }, time);
        });
    };
    yield put({ type: Type.FETCH_START });
    const message = yield call(sleep, 3000);
    if (!message) yield put({ type: Type.FETCH_ERR });
    yield put({ type: Type.FETCH_SUCCESS, payload: message });
}
function* rootSaga() {
    yield takeEvery(ASYNCDATA, asyncDataAction);
}
export default rootSaga;
