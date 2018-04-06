// @flow

import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'

import App from './components/App'
import UserInfoWatcher from './containers/UserInfoWatcher'

import store from './store'

const root = document.getElementById('root')

if (root) {
    render(
        <Provider store={store}>
            <UserInfoWatcher>
                <App />
            </UserInfoWatcher>
        </Provider>,
        root,
    )
} else {
    throw new Error('Root element could not be found.')
}
