export const ACCELERATE = 'ACCELERATE'; // 加速
export const ASYNCDATA = 'ASYNCDATA'; // 异步加速
export const DECELERATION = 'DECELERATION'; // 减速
export const SPEED = 'SPEED';
export const LOADINGSTART = 'LOADINGSTART' // loding开始
export const LOADINGEND = 'LOADINGEND' // loding结束

export const accelerate = () => {
    return { type: ACCELERATE };
};
export const asyncData =()=> {
    return { type: ASYNCDATA };
    
}
export const deceleration = () => {
    return { type: DECELERATION };
};
