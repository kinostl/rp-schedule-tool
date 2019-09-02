import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import Loading from './Loading'
import * as serviceWorker from './serviceWorker'
import 'bootstrap'
import api from './api'
import axios from 'axios'

ReactDOM.render(<Loading />, document.getElementById('root'));
if (window.location.href.indexOf("auth") > -1) {
    let token = "Bearer "+window.location.hash.substr(1)
    //window.location.hash=""
    console.log(token)
    axios.get('http://localhost:8080/me',{
        'headers':{
            'X-Authorization':token
        }
    }).then((user)=>{
        ReactDOM.render(<App token={token} user={user.data}/>, document.getElementById('root'));
    })
}else{
    ReactDOM.render(<App />, document.getElementById('root'));
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
