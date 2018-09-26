import React from 'react';
import ReactDom from 'react-dom';
import Routers from 'routers/router';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';
import store from '@/redux/store';
import colorfulConsole from 'utils/colorfulConsole.js';
import '@/assets/css/public/index.scss';
// console.log(动画)
colorfulConsole(require('assets/images/logo_g.gif'), 50);
renderWithHotReload(Routers());
if (module.hot) {
    module.hot.accept('@/routers/router', () => {
        const Routers = require('@/routers/router').default;
        renderWithHotReload(Routers());
    });
}
function renderWithHotReload(RootElement) {
    ReactDom.render(
        <AppContainer>
            <Provider store={store}>{RootElement}</Provider>
        </AppContainer>,
        document.getElementById('app')
    );
}
