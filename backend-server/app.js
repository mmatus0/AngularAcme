var express = require('express');
var app = express();
var mysql = require('mysql');
var express = require('express');
var fileUpload = require('express-fileupload');

const bodyParser = require('body-parser');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(fileUpload());

const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'bddacme'
});

//post para agregar datos
app.post('/producto', (req, res) => {
  const { name, code, date, price, description, rate, image } = req.body;

  const sql = `INSERT INTO productos
    (productName, productCode, releaseDate, price, description, starRating, imageUrl)
    VALUES (?, ?, ?, ?, ?, ?, ?)`;

  conn.query(
    sql,
    [name, code, date, parseInt(price), description, parseInt(rate), image],
    (err, result) => {
      if (err) throw err;

      res.status(201).json({
        ok: true,
        mensaje: 'Producto añadido correctamente'
      });
    }
  );
});

//Se recuperan productos desde bdd
app.get('/productos', (req, res) => {
    const sql = 'SELECT * FROM productos';
    conn.query(sql, (err, results) => {
        if (err) throw err;
        res.status(200).json({
            ok: true,
            productos: results
        });
    });
});

// Se recupera producto de bdd según id
app.get('/producto/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM productos WHERE productId = ?';

    conn.query(sql, [id], (err, results) => {
        if (err) throw err;

        if (results.length === 0) {
            return res.status(404).json({
                ok: false,
                mensaje: 'Producto no encontrado'
            });
        }

        res.status(200).json({
            ok: true,
            producto: results[0]
        });
    });
});

//Put para modificar registro y almacenar urlencoded
app.put('/upload/productos/:id', (res, req) => ){
    if(!req.files || Object.keys(req.files).length === 0){
        return res.status(400).json({
            ok: false,
            mensaje: 'No se ha seleccionado archivo'
        });
    }

    const file = req.files.image;
    const fileExtension = file.name.split('.').pop().toLowerCase();
    const allowedExtensions = ['png', 'jpg', 'jpeg', 'gif'];

    if(!allowedExtensions.includes(fileExtension)){
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de extension no permitido'
        });
    }

    const productId = req.params.id;
    const fileName = $
}



// Rutas
app.get('/', (req, res, next) => {
    res.status(200).json({
        ok: true,
        mensaje: 'Petición con éxito'
    })
});

// Escuchar petición
app.listen(3000, function(){
    console.log("Example app listening on port 3000!!!");  
});
