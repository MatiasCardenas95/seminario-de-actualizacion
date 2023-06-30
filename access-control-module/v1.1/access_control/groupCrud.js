const connection = require('./db');

// Obtener todos los grupos
function getAllGroups(callback) {
  connection.query('SELECT * FROM group_table', callback);
}

// Obtener un grupo por su ID
function getGroupById(groupId, callback) {
  connection.query('SELECT * FROM group_table WHERE id = ?', [groupId], callback);
}

// Crear un nuevo grupo
function createGroup(name, callback) {
  connection.query('INSERT INTO group_table (name) VALUES (?)', [name], callback);
}

// Actualizar la información de un grupo
function updateGroup(groupId, name, callback) {
  connection.query('UPDATE group_table SET name = ? WHERE id = ?', [name, groupId], callback);
}

// Eliminar un grupo por su ID
function deleteGroup(groupId, callback) {
  connection.query('DELETE FROM group_table WHERE id = ?', [groupId], callback);
}

module.exports = {
  getAllGroups,
  getGroupById,
  createGroup,
  updateGroup,
  deleteGroup
};