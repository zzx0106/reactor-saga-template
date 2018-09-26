import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
// 组件懒加载
import asyncComponents from '@/utils/asyncComponent';
const Logo = asyncComponents(() => import('components/Logo')); // 懒加载组件
import 'assets/css/pages/Home.scss';
class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            count: 0
        };
    }
    render() {
        return (
            <div className="home-container">
                <Logo />
                <h1 className="router-title">欢迎使用reactor</h1>
                <ul>
                    <li className="home-link">
                        <Link to="/demo">open new world</Link>
                    </li>
                </ul>
            </div>
        );
    }
}
export default Home;
