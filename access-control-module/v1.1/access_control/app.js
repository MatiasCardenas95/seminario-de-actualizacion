const express = require('express');
const userCrud = require('./userCrud');
const groupCrudRouter = require('./groupCrud');

const app = express();
app.use(express.json());

// Obtener todos los usuarios
app.get('/users', (req, res) => {
  userCrud.getAllUsers((err, results) => {
    if (err) {
      console.error('Error al obtener los usuarios: ' + err.message);
      return res.status(500).json({ error: 'Error al obtener los usuarios' });
    }
    res.json(results);
  });
});

// Obtener un usuario por su ID
app.get('/users/:id', (req, res) => {
  const id = req.params.id;
  userCrud.getUserById(id, (err, results) => {
    if (err) {
      console.error('Error al obtener el usuario: ' + err.message);
      return res.status(500).json({ error: 'Error al obtener el usuario' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'El usuario no existe' });
    }
    res.json(results[0]);
  });
});

// Crear un nuevo usuario
app.post('/users', (req, res) => {
  const { name } = req.body;
  userCrud.createUser(name, (err, userId) => {
    if (err) {
      console.error('Error al crear el usuario: ' + err.message);
      return res.status(500).json({ error: 'Error al crear el usuario' });
    }
    res.json({ id: userId, name });
  });
});

// Actualizar la información de un usuario
app.put('/users/:id', (req, res) => {
  const id = req.params.id;
  const { name } = req.body;
  userCrud.updateUser(id, name, (err) => {
    if (err) {
      console.error('Error al actualizar el usuario: ' + err.message);
      return res.status(500).json({ error: 'Error al actualizar el usuario' });
    }
    res.json({ id, name });
  });
});

// Eliminar un usuario por su ID
app.delete('/users/:id', (req, res) => {
  const id = req.params.id;
  userCrud.deleteUser(id, (err) => {
    if (err) {
      console.error('Error al eliminar el usuario: ' + err.message);
      return res.status(500).json({ error: 'Error al eliminar el usuario' });
    }
    res.json({ message: 'Usuario eliminado exitosamente' });
  });
});

//groups
// Obtener todos los grupos
app.get('/groups', (req, res) => {
    groupCrud.getAllGroups((error, results) => {
      if (error) {
        console.error('Error al obtener los grupos:', error);
        res.status(500).json({ error: 'Error al obtener los grupos' });
      } else {
        res.json(results);
      }
    });
  });
  
  // Obtener un grupo por su ID
  app.get('/groups/:id', (req, res) => {
    const groupId = req.params.id;
  
    groupCrud.getGroupById(groupId, (error, results) => {
      if (error) {
        console.error('Error al obtener el grupo:', error);
        res.status(500).json({ error: 'Error al obtener el grupo' });
      } else if (results.length === 0) {
        res.status(404).json({ error: 'Grupo no encontrado' });
      } else {
        res.json(results[0]);
      }
    });
  });
  
  // Crear un nuevo grupo
  app.post('/groups', (req, res) => {
    const { name } = req.body;
  
    groupCrud.createGroup(name, (error, results) => {
      if (error) {
        console.error('Error al crear un grupo:', error);
        res.status(500).json({ error: 'Error al crear un grupo' });
      } else {
        const groupId = results.insertId;
        res.json({ id: groupId, name });
      }
    });
  });
  
  // Actualizar la información de un grupo
  app.put('/groups/:id', (req, res) => {
    const groupId = req.params.id;
    const { name } = req.body;
  
    groupCrud.updateGroup(groupId, name, (error, results) => {
      if (error) {
        console.error('Error al actualizar el grupo:', error);
        res.status(500).json({ error: 'Error al actualizar el grupo' });
      } else if (results.affectedRows === 0) {
        res.status(404).json({ error: 'Grupo no encontrado' });
      } else {
        res.json({ id: groupId, name });
      }
    });
  });
  
  // Eliminar un grupo por su ID
  app.delete('/groups/:id', (req, res) => {
    const groupId = req.params.id;
  
    groupCrud.deleteGroup(groupId, (error, results) => {
      if (error) {
        console.error('Error al eliminar el grupo:', error);
        res.status(500).json({ error: 'Error al eliminar el grupo' });
      } else if (results.affectedRows === 0) {
        res.status(404).json({ error: 'Grupo no encontrado' });
      } else {
        res.json({ message: 'Grupo eliminado exitosamente' });
      }
    });
  });

// Iniciar el servidor
app.listen(3000, () => {
  console.log('Servidor en ejecución en http://localhost:3000');
});