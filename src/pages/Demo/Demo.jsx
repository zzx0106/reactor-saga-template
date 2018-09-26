import React, { Component } from 'react';
import { connect } from 'react-redux';
import { accelerate, deceleration, asyncData } from 'actions/demoAction';
import PropTypes from 'prop-types';
import 'assets/css/pages/Demo.scss';
// 装饰器
@connect(
    (state, ownProps) => {
        return {
            demoReducer: state.demoReducer.toJS() // 将immutable转为js
        };
    },
    (dispatch, ownProps) => {
        return {
            accelerateImg: () => {
                dispatch(accelerate());
            },
            asyncData: () => {
                dispatch(asyncData());
            },
            decelerationImg: () => {
                dispatch(deceleration());
            }
        };
    }
)
class Demo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            count: 0,
            face: 0 // 泡泡标签
        };
        this.t = 0; //旋转圈数
    }
    componentDidMount() {
        this.faceTimer = setInterval(() => {
            if (this.t > 0) {
                if (this.state.face === 10) return;
                this.setState({
                    face: this.state.face + 1
                });
            } else {
                this.setState({
                    face: 0
                });
            }
        }, 3000);
    }
    componentWillUnmount() {
        window.clearInterval(this.faceTimer);
        this.faceTimer = null;
    }
    rotateBox = () => {
        let i = 0;
        this.animate_start = true;
        const rotate = () => {
            i += 2.5;
            this.icon_img.style.transform = `rotate3d(0,0,1,${i}deg)`;
            if (this.t <= 0) {
                this.t = 0;
                i = 0;
                window.cancelAnimationFrame(this.RAF);
                this.animate_start = false;
            }
            if (i >= 365) {
                i = 0;
                this.props.decelerationImg(); // -一次
            }
            if (this.animate_start) this.RAF = window.requestAnimationFrame(rotate);
        };
        this.RAF = window.requestAnimationFrame(rotate);
    };
    addRotateNumber = num => {
        this.t = num;
        if (!this.animate_start && num > 0) {
            this.rotateBox();
        }
    };
    render() {
        const { face } = this.state;
        const { accelerateImg, asyncData, decelerationImg, demoReducer } = this.props;
        if (demoReducer.speed >= 0) {
            this.addRotateNumber(demoReducer.speed);
        }
        return (
            <div className="demo-container">
                <span>
                    剩余圈数：
                    {demoReducer.speed}
                </span>
                <div className="icon">
                    <img className="icon-img" ref={imgdom => (this.icon_img = imgdom)} src={require(`assets/images/demo/${face < 10 ? '0' + face : face + ''}.png`)} alt="" />
                </div>
                <div className="title">
                    {demoReducer.isLoading && !demoReducer.message ? <img width="130px" src={require('assets/images/loading.svg')} alt="" /> : null}
                    <p>{demoReducer.message}</p>
                </div>
                <div className="btn-box">
                    <button className="btn-success" onClick={decelerationImg}>
                        减一圈
                    </button>{' '}
                    -----
                    <button className="btn-info" onClick={asyncData}>
                        异步数据
                    </button>
                    -----
                    <button className="btn-primary" onClick={accelerateImg}>
                        加一圈
                    </button>
                </div>
            </div>
        );
    }
}
Demo.propTypes = {
    demoReducer: PropTypes.object
};
export default Demo;
