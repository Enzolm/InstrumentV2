import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function Nav() {

  useEffect(() => {
    newverifToken()
}
, [])


const [user, setUser] = useState(false)

const newverifToken = () => {
  const token = localStorage.getItem('token')
  if (token) {
      verifToken()
  }
  else {
      console.log("Pas de token")
      setUser(false)
  }
}

const verifToken = () => {
  const token = localStorage.getItem('token')
  console.log(token)
  fetch('http://localhost:3000/check/token', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({token})
  })
  .then(response => response.json())
  .then(data => {
      console.log("Token bien vérifié");
      setUser(true)
  })
  .catch((error) => {
      setUser(false)
      console.error('Error:', error);
  });
}



  if (user)
    return (
        <>
            <Link to="/">Home                  </Link>
            <Link to="/login">              Logout                               </Link>
            <Link to="/new">               Ajouter un Instrument</Link>
        </>
    );
    else
      return (
        <>
            <Link to="/">Home                </Link>
            <Link to="/login">              Login</Link>
        </>
      );
}

export default Nav