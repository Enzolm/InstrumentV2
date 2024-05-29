const express = require('express');
const app = express();
const cors = require('cors');
const mariadb = require('mariadb');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

const pool = mariadb.createPool ({
    host: 'localhost', //test
    user: 'root',
    password: '',
    database: 'bts_e5',
});

pool.getConnection()
.then(conn => {
    console.log("Connexion à la base de données réussie")
    conn.end();
})
.catch(err => {
    console.log("Erreur lors de la connexion à la base de données: "+ err)
});

app.get('/instrument', async (req, res) => {
    try {
        console.log('Lancement de la requête');
        const conn = await pool.getConnection();
        const rows = await conn.query('SELECT * FROM instrument');
        conn.release();

        res.status(200).json(rows);
    } catch (err) {
        console.error("Erreur lors de la récupération des données:", err);
        res.status(500).send("Erreur lors de la récupération des données: " + err.message);
    }
});

app.get('/instrument/:id', async (req, res) => {
    let conn;
    
    try {
       
        conn = await pool.getConnection();
        const rows = await conn.query('SELECT Prix, Nom,Categorie  FROM instrument WHERE id_instrument = ?', [req.params.id]);
        
        res.status(200).json(rows);
    } catch (err) {
        console.log("oups")
        res.status(500).send("Erreur lors de la récupération des données: "+ err);
    }
});

app.post('/add/user', async (req, res) => {
    const { Login, Password } = req.body;
    try {
        const hash = await bcrypt.hash(Password, 10);
        const newUser = await pool.query('INSERT INTO Utilisateurs (username, mdp) VALUES (?, ?)', [Login, hash]);
        const userId = newUser.insertId.toString();
        res.status(201).json({ message: "Utilisateur ajouté avec succès.", userId: userId });
    } catch (error) {
        console.error("Erreur lors de l'ajout de l'utilisateur:", error);
        res.status(500).json({ message: "Une erreur s'est produite lors de l'ajout de l'utilisateur." });
    }
});

app.post('/add/instrument', async (req, res) => {
  const { NomInstrument, CategorieInstrument, PrixInstrument} = req.body;

  try {


      const newInstru = await pool.query('INSERT INTO instrument (Nom, Categorie, Prix) VALUES (?, ?, ?)', [NomInstrument, CategorieInstrument, PrixInstrument]);

      const userId = newInstru.insertId.toString();
      res.status(201).json({ message: "Intrument ajouté avec succès.", userId: userId });
  } catch (error) {
      console.error("Erreur lors de l'ajout de l'Intrument:", error);
      res.status(500).json({ message: "Une erreur s'est produite lors de l'ajout de l'Intrument." });
  }
}
);




app.put('/edit/instrument/:id', async (req, res) => {
    console.log(req.body)
    const { Nom, Categorie, Prix } = req.body.instrument;
   console.log(Nom)
    try {
        const updatedInstru = await pool.query('UPDATE instrument SET Nom = ?, Categorie = ?, Prix = ? WHERE id_instrument = ?', [Nom, Categorie, Prix, req.params.id]);
        res.status(200).json({ message: "Instrument modifié avec succès." });
    } catch (error) {
        console.error("Erreur lors de la modification de l'instrument:", error);
        res.status(500).json({ message: "Une erreur s'est produite lors de la modification de l'instrument." });
    }
}
);


app.delete('/delete/instrument/:id', async (req, res) => {
    try {
        const deletedInstru = await pool.query('DELETE FROM instrument WHERE id_instrument = ?', [req.params.id]);
        res.status(200).json({ message: "Instrument supprimé avec succès." });
    } catch (error) {
        console.error("Erreur lors de la suppression de l'instrument:", error);
        res.status(500).json({ message: "Une erreur s'est produite lors de la suppression de l'instrument." });
    }
});

app.post('/login', async (req, res) => {
    const { Login, Password } = req.body;
    try {
        const user = await pool.query('SELECT * FROM Utilisateurs WHERE username = ?', [Login]);
        if (user.length === 0) {
            return res.status(404).json({ message: "Utilisateur non trouvé." });
        }
        const match = await bcrypt.compare(Password, user[0].mdp);
        if (!match) {
            return res.status(401).json({ message: "Mot de passe incorrect." });
        }
        res.status(200).json({ message: "Connexion réussie." });

    } catch (error) {
        console.error("Erreur lors de la connexion:", error);
        res.status(500).json({ message: "Une erreur s'est produite lors de la connexion." });
    }
});

app.post('/create/token', async (req, res) => {
    const { Login } = req.body;
    try {
        const user = await pool.query('SELECT * FROM Utilisateurs WHERE username = ?', [Login]);
        if (user.length === 0) {
            return res.status(404).json({ message: "Utilisateur non trouvé." });
        }
        const token = jwt.sign({ userId: user[0].id }, 'secretKey' , { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (error) {
        console.error("Erreur lors de la création du token:", error);
        res.status(500).json({ message: "Une erreur s'est produite lors de la création du token." });
    }
});

app.post('/check/token', async (req, res) => {
    const token = req.body['token'];
    console.log(token);
    jwt.verify(token, 'secretKey', (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Token invalide." });
        }
        console.log("test");
        res.status(200).json({ message: "Token valide." });
    });
});



app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
