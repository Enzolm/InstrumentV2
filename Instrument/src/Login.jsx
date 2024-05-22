import React from 'react';
import { useState, useEffect } from 'react';
import App from './App'; 


function Login() {
    const [Login, setLogin] = useState('')
    useEffect(() => {
        console.log(Login)       
    }, [Login])

    const [Password, setPassword] = useState('')
    useEffect(() => {
        console.log(Password)       
    }, [Password])

    const log = ()=>{
        console.log(JSON.stringify({Login, Password}))
    }

    const inputLogin = (e) => {
        setLogin(e.target.value)
    }
    const inputPassword = (e) => {
        setPassword(e.target.value)
    }

    const adduser = () => {
        console.log(JSON.stringify({Login, Password}))
        fetch('http://localhost:3000/add/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({Login, Password})
        })
        .then(response => response.json())
        .then(data => {
            console.log(data)
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }

    const login = () => {
        console.log(JSON.stringify({Login, Password}))
        fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({Login, Password})
        })
        .then(response => response.json())
        .then(data => {
            console.log(data)
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }

    const createToken = () => {
        console.log(JSON.stringify({Login}))
        fetch('http://localhost:3000/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({Login, Password})
        })
        .then(response => response.json())
        .then(data => {
            console.log(data)
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }


  return (
    <>
      <h1>Login</h1>
      <br />
      <input onInput={(e) => inputLogin(e)} type="text" placeholder="Login" /> <br /> <br />
      <input onInput={(e) => inputPassword(e)} type="password" placeholder="Pasword" /> <br /> <br />
      <button onClick={login}>Login</button>
      <button onClick={createToken}>Cookie</button>
    </>
  );
}

export default Login;