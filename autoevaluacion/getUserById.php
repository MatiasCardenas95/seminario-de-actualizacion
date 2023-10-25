<?php
// Configuración de la conexión a la base de datos
$host = "localhost";
$dbname = "gestion_usuarios";
$username = "root";
$password = "486520";

try 
{
  // Crear una nueva instancia de conexión a la base de datos
  $connection = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
  $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  
  // Obtener el ID del usuario a través del método GET
  $usuario_id = json_decode(file_get_contents('php://input'));

  //Los ejemplos son:
  //SELECT * FROM usuarios WHERE id='$id';    al agregarle una comilla al final 1'
  //SELECT * FROM usuarios WHERE id='$1'';    inyeccion sql, abortando la sentencia con un error de sintaxis.

  //SELECT * FROM usuarios WHERE id = 10 or 1=1;   esto devolvería toda la tabla de usuarios, ya que WHERE 1=1 es true.

  //SELECT * FROM usuarios WHERE id='"id"';     en este caso, por ejemplo un valor como 3; DROP TABLE usuarios;--    
  //                                            lo que haría seria eliminar tabla Usuarios con todos los registros que tuviera.

  // Generación del Procedimiento almacenado

  $stmt = $connection->prepare("CALL `ObtenerUsuarioPorId`(:usuario_id)");
  $stmt->bindParam(':usuario_id', $usuario_id, PDO::PARAM_INT);
  $stmt->execute();

  // Obtener los resultados
  $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

  // Cerrar la conexión a la base de datos
  $connection = null;

  // Devolver los resultados en formato JSON
  header('Content-Type: application/json');
  echo json_encode($results);
} catch (PDOException $e) 
{
  echo "Error: " . $e->getMessage();
}


?>
