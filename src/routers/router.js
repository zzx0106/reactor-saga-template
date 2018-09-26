import React from 'react';

import {BrowserRouter as Router, Route, Switch, Link} from 'react-router-dom';
// 路由懒加载
import AsyncRouter from '@/utils/asyncRouter';

// import Home from 'bundle-loader?lazy&name=home!pages/Home/Home';
import Home from '../pages/Home/Home'; // 在webpack中配置了bundle-loader
import Demo from '@/pages/Demo/Demo'; // 在webpack中配置了bundle-loader
import Loading from '@/components/Loading';
const createComponent = (component) => (props) => (
    <AsyncRouter load={component}>
        {
            (Component) => Component ? <Component {...props} /> : <Loading/>
        }
    </AsyncRouter>
);
const getRouter = () => {
    return (
        <Router>
            <Switch>
                <Route exact path="/" component={createComponent(Home)}/>
                <Route path="/demo" component={createComponent(Demo)}/>
            </Switch>
        </Router>
    )
};

export default getRouter;