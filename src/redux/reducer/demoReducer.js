import { DECELERATION, ACCELERATE, SPEED, LOADINGSTART, LOADINGEND, ASYNCDATA } from '../actions/demoAction';
import Type from '../types/redux-type';
import Immutable from 'immutable';
const initState = Immutable.fromJS({
    isLoading: false,
    speed: 0,
    message: ''
});
const reducer = (state = initState, action) => {
    switch (action.type) {
        case ACCELERATE: // 加速
            return state.update('speed', val => val + 1); // 更新
        case DECELERATION: // 减速
            return state.update('speed', val => (val - 1 < 0 ? 0 : val - 1)); // 更新
        case ASYNCDATA: // 开始loding
            return state.set('isLoading', true); // 更新
        case Type.FETCH_START: // 异步加速
            return state.set('isLoading', true); // 更新
        case Type.FETCH_SUCCESS: //结束请求
            return state.merge({
                isLoading: false,
                message: action.payload.data
            }); // 更新
        default:
            return state;
    }
};

export default reducer;
