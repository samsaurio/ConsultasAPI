## **Consultas que realiza el API**

- Información de todos los artículos publicados el día actual.
  <code> https://apicolumnistos.tedic.net/ </code>

- Total de artículos existentes en la base de datos:
  <code> https://apicolumnistos.tedic.net/api/articulos </code>

- Total por periodo de hombres y mujeres
  <code> https://apicolumnistos.tedic.net/api/periodicos </code>

- Todos los artículos de un periódico especificado en el url
  <code> https://apicolumnistos.tedic.net/api/periodico/{nombre del periódico} </code>

- Cuenta del total de cada género desde la primera fecha hasta la fecha actual
  <code> https://apicolumnistos.tedic.net/api/historico/genero

- Todos los artículos de un autor especificado en el url
Nota: Los espacios del nombre de autor deben ser reemplazados por lo siguiente: %20
Ejemplo: Antonio%20Suarez

  <code> https://apicolumnistos.tedic.net/api/articulos_por_autor/{nombre del autor}  </code>

- Número de artículos por autor

Nota: Los espacios del nombre de autor deben ser reemplazados por lo siguiente: %20

Ejemplo: Antonio%20Suarez

  <code> https://apicolumnistos.tedic.net/api/cantidad_articulos_por_autor/{nombre del autor}  </code>

- Total de autores registrados en la base
  <code> https://apicolumnistos.tedic.net/api/autores  </code>

- Cantidad de artículos publicados por hombres y mujeres en un rango de fechas

Nota: Las fechas deben estar en formato AAAA-MM-DD. Ej: 23-05-2019

  <code> https://apicolumnistos.tedic.net/api/intervalo_fecha/{fecha1}/{fecha2}  </code>

- Cantidad de artículos hechos por mujeres y hombres en una fecha específica

Nota: La fecha debe estar en formato AAAA-MM-DD. Ej: 23-05-2019

 <code>  https://apicolumnistos.tedic.net/api/fecha/{fecha}  </code>

- Cantidad de mujeres y hombres en el dia de ho_y_
  <code> https://apicolumnistos.tedic.net/api/fecha_actual  </code>

- Cantidad de mujeres y hombres anuales
  <code> https://apicolumnistos.tedic.net/api/record_anual  </code>

## **Para replicar el API**

## **Instalación**

Debe tener instalado nodejs version 10.15.2 o superior.

- npm install

**Tecnologías utilizadas:**

- Node
- MD5
- Sqlite3
- Express

## **Para correr el API**

- node server.js

## **Añadir base de datos**

Renombre su base de datos a &quot;diarios.sqlite&quot; o bien en el documento de database.js coloque la ubicación de su base de datos en el siguiente espacio:

let db = new sqlite3.Database(&#39;\&lt;ubicación de la base de datos\&gt;&#39;, (err) =\&gt; {

Las bases de datos debe seguir la siguiente estructura:

- **Articles:**
  - Id
  - Title
  - Url
  - Author\_id
  - Site
  - Added
  - Last\_seen
- **Authors:**
  - Id
  - Author
  - gender

Nota: La base de datos utilizada debe ser actualizada diariamente con el fin de que todas las consultas funcionen correctamente.
