class User 
{
  constructor(id, nombre, edad, correo) 
  {
    this.id = id;
    this.nombre = nombre;
    this.edad = edad;
    this.correo = correo;
  }

  saludar() 
  {
    console.log(`Hola, mi nombre es ${this.nombre}`);
  }
}

class Group 
{
  constructor(id,nombre) 
  {
    this.id = id;
    this.nombre = nombre;
    this.usuarios = [];
  }

  agregarUsuario(user) 
  {
    this.usuarios.push(user);
  }

  mostrarUsuarios() 
  {
    console.log(`Usuarios en el grupo ${this.nombre}:`);
    this.usuarios.forEach((user, index) => {
      console.log(`${index + 1}. ${user.nombre} (${user.correo})`);
    });
  }
}

const usuario1 = new User("Juan", 25, "juan25@gmail.com");
const usuario2 = new User("María", 30, "mario30@gmail.com");

const grupo1 = new Group(1,"Grupo 1");
grupo1.agregarUsuario(usuario1);
grupo1.agregarUsuario(usuario2);

grupo1.mostrarUsuarios();

class Recurso {
    constructor(nombre) {
      this.nombre = nombre;
    }
  }
  
  // Clase Acceso
  class Acceso {
    constructor() {
      this.permisos = new Map(); // Mapa para almacenar los permisos por grupo y recurso
    }
  
    agregarPermiso(grupo, recurso) {
      if (!this.permisos.has(grupo)) {
        this.permisos.set(grupo, new Set());
      }
  
      const recursosGrupo = this.permisos.get(grupo);
      recursosGrupo.add(recurso);
    }
  
    tienePermiso(grupo, recurso) {
      if (this.permisos.has(grupo)) {
        const recursosGrupo = this.permisos.get(grupo);
        return recursosGrupo.has(recurso);
      }
  
      return false;
    }
  }
  
 
  const grupo1 = "Grupo 1";
  const grupo2 = "Grupo 2";
  
  const acceso = new Acceso();
  
  const recurso1 = new Recurso("Recurso A");
  const recurso2 = new Recurso("Recurso B");
  const recurso3 = new Recurso("Recurso C");
  
  acceso.agregarPermiso(grupo1, recurso1);
  acceso.agregarPermiso(grupo1, recurso2);
  acceso.agregarPermiso(grupo2, recurso3);
  
  console.log(acceso.tienePermiso(grupo1, recurso1)); // true
  console.log(acceso.tienePermiso(grupo1, recurso3)); // false
  console.log(acceso.tienePermiso(grupo2, recurso3)); // true