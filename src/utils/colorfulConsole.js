
/**
 * 实现将项目的图片转化成base64然后转为console.log
 * @param {String} url 图片路径
 * @param {Number} fontSize console.log尺寸
 */
const colorfulConsole = (url, fontSize) => {
    try {
        if (typeof FileReader == 'undifined') {
            //判断浏览器是否支持filereader
            console.warn('抱歉，你的浏览器不支持 FileReader');
            return false;
        }
        function getImageBlob(url, cb) {
            var xhr = new XMLHttpRequest();
            xhr.open('get', url, true);
            xhr.responseType = 'blob';
            xhr.onload = function() {
                if (this.status == 200) {
                    if (cb) cb(this.response);
                }
            };
            xhr.send();
        }
        var reader = new FileReader();
        getImageBlob(url, function(blob) {
            // 获取图片blob
            reader.readAsDataURL(blob);
        });
        reader.onload = function(e) {
            // 渲染动画
            console.log('%c     ', `background:url('${e.target.result}') left top no-repeat; font-size:${fontSize}px;`);
        };
    } catch (error) {
        console.warn('err->svg->base64', error);
    }
};
export default colorfulConsole;
