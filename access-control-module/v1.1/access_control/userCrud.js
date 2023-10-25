const db = require('./db');

// Obtener todos los usuarios con su información completa
function getAllUsers(callback) {
  const query = `
    SELECT u.id, d.nombre, d.apellido
    FROM user AS u
    JOIN user_data AS ud ON u.id = ud.user_id
    JOIN data AS d ON ud.data_id = d.id
  `;
  db.query(query, callback);
}

// Obtener un usuario por su ID con su información completa
function getUserById(id, callback) {
  const query = `
    SELECT u.id, d.nombre, d.apellido
    FROM user AS u
    JOIN user_data AS ud ON u.id = ud.user_id
    JOIN data AS d ON ud.data_id = d.id
    WHERE u.id = ?
  `;
  db.query(query, [id], callback);
}

// Crear un nuevo usuario
function createUser(name, callback) {
  const query = 'INSERT INTO data (nombre) VALUES (?)';
  db.query(query, [name], (err, result) => {
    if (err) {
      callback(err);
    } else {
      const dataId = result.insertId;
      const userQuery = 'INSERT INTO user_data (user_id, data_id) VALUES (?, ?)';
      db.query(userQuery, [dataId, dataId], (err, result) => {
        if (err) {
          callback(err);
        } else {
          const userId = result.insertId;
          callback(null, userId);
        }
      });
    }
  });
}

// Modificar la información de un usuario
function updateUser(userId, name, callback) {
  const dataQuery = 'UPDATE data SET nombre = ? WHERE id = ?';
  db.query(dataQuery, [name, userId], (err) => {
    if (err) {
      callback(err);
    } else {
      callback(null);
    }
  });
}

// Eliminar un usuario por su ID
function deleteUser(userId, callback) {
  const query = 'DELETE FROM user_data WHERE user_id = ?';
  db.query(query, [userId], callback);
}

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};