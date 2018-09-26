module.exports = {
    plugins: {
        'postcss-import': {},
        'postcss-preset-env': {},
        cssnano: { // css压缩 混淆
            reduceIdents: true // 不修改keyframe的动画名称
        }
    }
};
