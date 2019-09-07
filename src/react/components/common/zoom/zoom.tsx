// 控制滚轮缩放
const zoom = (onWheelEvent, callback) => {
    console.log(onWheelEvent);
    console.log(`啦啦: ${onWheelEvent.deltaX}, ${onWheelEvent.deltaY}, ${onWheelEvent.deltaZ}`);
    // // console.log("zoom: width" + dom.style.width +" left" +dom.style.left);
    let e = onWheelEvent;
    callback(e.deltaY);
    // let imageModalWidth = parseInt(dom.style.width);
    // let modalLeft = parseInt(dom.style.left);
    // // 计算缩放后的大小 每一次滚轮 100px
    // let calcWidth = imageModalWidth - e.deltaY;
    // // 限制最小 width = 400
    // if (calcWidth <= 300) {
    //     return;
    // }
    // console.log("zoom:" + calcWidth);
    // // 不让modal由于缩小消失在视野中
    // if (modalLeft + calcWidth < 50) {
    //     return;
    // }
    // dom.style.width = `${calcWidth}px`;
};
export default zoom;
