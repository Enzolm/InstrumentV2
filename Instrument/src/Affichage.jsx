    import React, { useState, useEffect } from "react";
    import './App.css'
    import { NavLink, useNavigate } from 'react-router-dom'

    function Affichage() {

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







        const [instruments, setInstruments] = useState([]);

        const navigateedit = () => {
            navigate('/edit');
          };


        useEffect(() => {
            fetch("http://localhost:3000/instrument")
                .then((response) => response.json())
                .then((data) => setInstruments(data));
        }, []);


        if (user)
            return (
            <>
                <h1 className=" mb-5  font-bold font">Liste des Instruments</h1>
                <div className=" flex row-span-3">
                    {instruments.map((instrument) => (
                            <div className=" bg- mx-4 rounded-lg p-2 border-solid border-2 border-black" key={instrument.Id_instrument}>
                                <h2>{instrument.Nom}</h2>
                                <p>{instrument.Categorie}</p>
                                <p>{instrument.Prix}€</p>
                                <NavLink to={`/edit/${instrument.Id_instrument}`}>Modifier                </NavLink>
                                <NavLink to={`/delete/${instrument.Id_instrument}`}>                                  Supprimer</NavLink>
                            </div>
                    ))}
                </div>
            </>
        );
        else
            return (
                <>
                <h1 className=" mb-5  font-bold font">Liste des Instruments</h1>
                <div className=" flex row-span-3">
                    {instruments.map((instrument) => (
                            <div className=" bg- mx-4 rounded-lg p-2 border-solid border-2 border-black" key={instrument.Id_instrument}>
                                <h2>{instrument.Nom}</h2>
                                <p>{instrument.Categorie}</p>
                                <p>{instrument.Prix}€</p>
                            </div>
                    ))}
                </div>
            </>
            );
    }

    export default Affichage