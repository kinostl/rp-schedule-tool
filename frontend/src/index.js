import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import Loading from './Loading'
import * as serviceWorker from './serviceWorker'
import 'bootstrap'
import axios from 'axios'

ReactDOM.render(<Loading />, document.getElementById('root'));
if(window.localStorage.getItem('token')){
    let token = window.localStorage.getItem('token')
    axios.get('http://localhost:8080/me',{
        'headers':{
            'X-Authorization':token
        }
    }).then((user)=>{
        const api = axios.create({
            baseURL: 'http://localhost:8080/api/records',
            'headers': {
                'X-Authorization': token
            },
            timeout: 1000,
        });
        ReactDOM.render(<App api={api} user={user.data}/>, document.getElementById('root'));
    })
}else if (window.location.href.indexOf("auth") > -1) {
    let token = "Bearer "+window.location.hash.substr(1)
    window.localStorage.setItem('token',token)
    document.location.replace('http://localhost:3000/')
}else{
    const api = axios.create({
        baseURL: 'http://localhost:8080/api/records',
        timeout: 1000,
    });
    ReactDOM.render(<App api={api}/>, document.getElementById('root'));
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
