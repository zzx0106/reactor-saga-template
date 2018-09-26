import React, { Component } from 'react';
import 'assets/css/components/Loading.scss';
export default class Loading extends Component {
    render() {
        return (
            <div className="loading-box">
                <img src={require('assets/images/loading.svg')} alt="" />
            </div>
        );
    }
}
