import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Loading from './Loading';
import * as serviceWorker from './serviceWorker';
import 'bootstrap'
import discordAuth from './state';

ReactDOM.render(<Loading />, document.getElementById('root'));
if (window.location.href.indexOf("authorize") > -1) {
    discordAuth.callback(window.location.href).then((user)=>{
        console.log(user)
        ReactDOM.render(<App user={`Bearer ${user.accessToken}`}/>, document.getElementById('root'));
    })
}else{
    ReactDOM.render(<App />, document.getElementById('root'));
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
