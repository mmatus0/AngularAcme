var express = require('express');
var app = express();
var mysql = require('mysql');
var fileUpload = require('express-fileupload');
var path = require('path');
var fs = require('fs');
var jwt = require('jsonwebtoken');

const bodyParser = require('body-parser');
const { OAuth2Client } = require('google-auth-library');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(fileUpload());

const SECRET_KEY = 'clave_secreta_acme';
const GOOGLE_CLIENT_ID = '98858807989-051v8qdj86nv2pbpccp1pfdagntdhrpo.apps.googleusercontent.com';

// CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
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

// Middleware para verificar el token JWT
function verificarToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ ok: false, mensaje: 'Token no proporcionado' });
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ ok: false, mensaje: 'Token inválido o expirado' });
        }
        req.usuario = decoded;
        next();
    });
}

// GET - Ruta raíz
app.get('/', (req, res) => {
    res.status(200).json({
        ok: true,
        mensaje: 'Servidor backend ACME funcionando'
    });
});

// POST - Login de usuario
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ ok: false, mensaje: 'Email y password son requeridos' });
    }

    const sql = 'SELECT * FROM usuarios WHERE userEmail = ? AND userPassword = ?';
    conn.query(sql, [email, password], (err, results) => {
        if (err) {
            return res.status(500).json({ ok: false, mensaje: err.message });
        }
        if (results.length === 0) {
            return res.status(401).json({ ok: false, mensaje: 'Credenciales incorrectas' });
        }

        const usuario = results[0];

        const token = jwt.sign(
            { userId: usuario.userId, userEmail: usuario.userEmail, userRole: usuario.userRole },
            SECRET_KEY,
            { expiresIn: '24h' }
        );

        conn.query('UPDATE usuarios SET userToken = ? WHERE userId = ?', [token, usuario.userId]);

        res.status(200).json({
            ok: true,
            token: token,
            usuario: {
                userId:    usuario.userId,
                userName:  usuario.userName,
                userEmail: usuario.userEmail,
                userRole:  usuario.userRole,
                userImg:   usuario.userImg
            }
        });
    });
});

// POST - Login con Google
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

app.post('/google-login', async (req, res) => {
    const { idToken } = req.body;
    if (!idToken) return res.status(400).json({ ok: false, mensaje: 'Token requerido' });

    try {
        const ticket = await googleClient.verifyIdToken({
            idToken,
            audience: GOOGLE_CLIENT_ID
        });
        const { email, name, picture } = ticket.getPayload();

        conn.query('SELECT * FROM usuarios WHERE userEmail = ?', [email], (err, results) => {
            if (err) return res.status(500).json({ ok: false, mensaje: err.message });

            if (results.length > 0) {
                // Usuario existente
                generarTokenGoogle(results[0], res);
            } else {
                // Crear usuario nuevo con datos de Google
                const sql = `INSERT INTO usuarios (userName, userEmail, userPassword, userRole, userImg)
                             VALUES (?, ?, '', 'user', ?)`;
                conn.query(sql, [name, email, picture], (err2, result2) => {
                    if (err2) return res.status(500).json({ ok: false, mensaje: err2.message });
                    const nuevoUsuario = {
                        userId:    result2.insertId,
                        userName:  name,
                        userEmail: email,
                        userRole:  'user',
                        userImg:   picture
                    };
                    generarTokenGoogle(nuevoUsuario, res);
                });
            }
        });

    } catch (e) {
        console.error('Error verificando token Google:', e);
        return res.status(401).json({ ok: false, mensaje: 'Token de Google inválido' });
    }
});

function generarTokenGoogle(usuario, res) {
    const token = jwt.sign(
        { userId: usuario.userId, userEmail: usuario.userEmail, userRole: usuario.userRole },
        SECRET_KEY,
        { expiresIn: '24h' }
    );
    return res.status(200).json({
        ok: true,
        token,
        usuario: {
            userId:    usuario.userId,
            userName:  usuario.userName,
            userEmail: usuario.userEmail,
            userRole:  usuario.userRole,
            userImg:   usuario.userImg || null
        }
    });
}

// GET - Obtener todos los productos
app.get('/productos', verificarToken, (req, res) => {
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
app.get('/producto/:id', verificarToken, (req, res) => {
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
app.post('/producto', verificarToken, (req, res) => {
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
app.put('/upload/productos/:id', verificarToken, (req, res) => {
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
app.put('/producto/:id', verificarToken, (req, res) => {
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
app.delete('/producto/:id', verificarToken, (req, res) => {
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
app.get('/existeproducto/:code', verificarToken, (req, res) => {
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