import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import Loading from './Loading'
import * as serviceWorker from './serviceWorker'
import 'bootstrap'
import axios from 'axios'

ReactDOM.render(<Loading />, document.getElementById('root'));
if (window.location.hash.length > 0) {
    let token = "Bearer " + window.location.hash.substr(1)
    window.localStorage.setItem('token', token)
    document.location.replace(process.env.REACT_APP_CLIENT_URL)
} else if (window.localStorage.getItem('token')) {
    let token = window.localStorage.getItem('token')
    axios.get(`${process.env.REACT_APP_API_URL}/api/records/me`, {
        'headers': {
            'X-Authorization': token
        }
    }).then((user) => {
        const api = axios.create({
            baseURL: `${process.env.REACT_APP_API_URL}/api/records`,
            'headers': {
                'X-Authorization': token
            },
            timeout: 3000,
        });
        ReactDOM.render(<App api={api} user={user.data} />, document.getElementById('root'));
    })
} else {
    const api = axios.create({
        baseURL: `${process.env.REACT_APP_API_URL}/api/records`,
        timeout: 3000,
    });
    ReactDOM.render(<App api={api} />, document.getElementById('root'));
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
