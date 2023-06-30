const mysql = require('mysql');

const connection = mysql.createConnection({
  host: '127.0.0.1',
  port:3306,
  user: 'root',
  password: '486520',

});

connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos: ' + err.stack);
    return;
  }
  console.log('Conexión a la base de datos establecida');
});

module.exports = connection;