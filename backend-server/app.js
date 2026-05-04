var express = require('express');
var app = express();
var mysql = require('mysql');
var fileUpload = require('express-fileupload');
var path = require('path');
var fs = require('fs');

const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(fileUpload());

// CORS para permitir peticiones desde el frontend Angular
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// Carpeta para almacenar imágenes subidas
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Servir imágenes estáticamente
app.use('/uploads', express.static(uploadDir));

const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'bddacme'
});

conn.connect((err) => {
    if (err) {
        console.error('Error conectando a MySQL:', err.message);
    } else {
        console.log('Conectado a MySQL correctamente.');
    }
});

// GET - Ruta raíz
app.get('/', (req, res) => {
    res.status(200).json({
        ok: true,
        mensaje: 'Servidor backend ACME funcionando'
    });
});

// GET - Obtener todos los productos
app.get('/productos', (req, res) => {
    const sql = 'SELECT * FROM productos';
    conn.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ ok: false, mensaje: err.message });
        }
        res.status(200).json({
            ok: true,
            productos: results
        });
    });
});

// GET - Obtener producto por id
app.get('/producto/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM productos WHERE productId = ?';
    conn.query(sql, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ ok: false, mensaje: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ ok: false, mensaje: 'Producto no encontrado' });
        }
        res.status(200).json({ ok: true, producto: results[0] });
    });
});

// POST - Agregar producto
app.post('/producto', (req, res) => {
    const { name, code, date, price, description, rate, image } = req.body;
    const sql = `INSERT INTO productos
        (productName, productCode, releaseDate, price, description, starRating, imageUrl)
        VALUES (?, ?, ?, ?, ?, ?, ?)`;
    conn.query(
        sql,
        [name, code, date, parseFloat(price), description, parseFloat(rate), image],
        (err, result) => {
            if (err) {
                return res.status(500).json({ ok: false, mensaje: err.message });
            }
            res.status(201).json({
                ok: true,
                mensaje: 'Producto añadido correctamente',
                id: result.insertId
            });
        }
    );
});

// PUT - Subir imagen de producto
app.put('/upload/productos/:id', (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ ok: false, mensaje: 'No se ha seleccionado archivo' });
    }

    const file = req.files.image;
    const fileExtension = file.name.split('.').pop().toLowerCase();
    const allowedExtensions = ['png', 'jpg', 'jpeg', 'gif'];

    if (!allowedExtensions.includes(fileExtension)) {
        return res.status(400).json({ ok: false, mensaje: 'Tipo de extensión no permitido' });
    }

    const productId = req.params.id;
    const fileName = `producto_${productId}.${fileExtension}`;
    const uploadPath = path.join(uploadDir, fileName);

    file.mv(uploadPath, (err) => {
        if (err) {
            return res.status(500).json({ ok: false, mensaje: err.message });
        }

        const imageUrl = `http://localhost:3000/uploads/${fileName}`;
        const sql = 'UPDATE productos SET imageUrl = ? WHERE productId = ?';
        conn.query(sql, [imageUrl, productId], (err2) => {
            if (err2) {
                return res.status(500).json({ ok: false, mensaje: err2.message });
            }
            res.status(200).json({
                ok: true,
                mensaje: 'Imagen subida y producto actualizado correctamente',
                imageUrl
            });
        });
    });
});

// PUT - Actualizar datos de producto
app.put('/producto/:id', (req, res) => {
    const { id } = req.params;
    const { name, code, date, price, description, rate, image } = req.body;
    const sql = `UPDATE productos SET
        productName = ?, productCode = ?, releaseDate = ?,
        price = ?, description = ?, starRating = ?, imageUrl = ?
        WHERE productId = ?`;
    conn.query(
        sql,
        [name, code, date, parseFloat(price), description, parseFloat(rate), image, id],
        (err, result) => {
            if (err) {
                return res.status(500).json({ ok: false, mensaje: err.message });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ ok: false, mensaje: 'Producto no encontrado' });
            }
            res.status(200).json({ ok: true, mensaje: 'Producto actualizado correctamente' });
        }
    );
});

// DELETE - Eliminar producto
app.delete('/producto/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM productos WHERE productId = ?';
    conn.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ ok: false, mensaje: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ ok: false, mensaje: 'Producto no encontrado' });
        }
        res.status(200).json({ ok: true, mensaje: 'Producto eliminado correctamente' });
    });
});

// GET - Verificar si existe producto por código
app.get('/existeproducto/:code', (req, res) => {
    const sql = 'SELECT * FROM productos WHERE productCode = ?';
    conn.query(sql, [req.params.code], (err, results) => {
        if (err) throw err;
        res.status(200).json({
            ok: true,
            data: results[0],
            existe: results.length > 0
        });
    });
});

// Escuchar peticiones
app.listen(3000, function () {
    console.log('Servidor backend escuchando en puerto 3000');
});
