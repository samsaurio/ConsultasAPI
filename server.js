var express = require("express");
var app = express();
var db = require("./database.js")
// Server port
var HTTP_PORT = 8000
// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
});



/*  Consulta 1*/
/*  Total de articulos existentes en la base de datos contemplando el pais indicado en el url*/
/*  ejemplo: /api/articulos/Paraguay */
app.get("/api/articulos/:country_name", (req, res, next) => {
    var sql = "select a.title, a.url, aut.author, aut.gender, a.site, a.country, a.added, a.last_seen from articles a join authors aut where a.author_id = aut.id and a.country = ?;"
    var params = [req.params.country_name]
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
      });
});

/*  Consulta 2*/
/*  Todos los articulos de un peridico X dado un pais Y*/
/*  ejemplo : http://localhost:8000/api/periodico/clarin/Argentina*/
app.get("/api/periodico/:site_name/:country_name", (req, res, next) => {
    var sql = "select title,url,site,country,added,last_seen, author,gender from articles a join authors aut where (a.author_id = aut.id) and (site = ? and country = ?);"
    var params = [req.params.site_name,req.params.country_name]
    db.all(sql, params, (err, row) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":row
        })
      });
});


/*  Consulta 3 */
/*  Cuenta del total de cada genero de todos los paises*/
/*  ejemplo: http://localhost:8000/api/totales_genero  */
app.get("/api/totales_genero", (req, res, next) => {
    var sql =
"select country, count(case when gender='M' then 1 end) as males, count(case when gender='F' then 1 end) as females, count(*) as total_count from  articles a join authors aut where a.author_id = aut.id group by country;"

    var params = [req.params.site_name,req.params.country_name]
    db.all(sql, params, (err, row) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":row
        })
      });
});



/*  Consulta 4 */
/*  Todos los articulos de un autor*/
/*  ejemplo:http://localhost:8000/api/articulos_por_autor/Augusto%20Dos%20Santos */
app.get("/api/articulos_por_autor/:nombre", (req, res, next) => {
    var sql= " SELECT authors.gender,authors.author,  articles.title from authors inner join articles ON authors.id = articles.author_id where authors.author = ?; "

    var params = [req.params.nombre]
    db.all(sql, params, (err, row) => {
      console.log(row);
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":row
        })
      });
});

/*  Consulta 5*/
/*  numero de articulos por autor*/
/*  ejemplo: localhost:8000/api/cantidad_articulos_por_autor/Augusto Dos Santos */
app.get("/api/cantidad_articulos_por_autor/:nombre", (req, res, next) => {
    var sql= " SELECT COUNT(*) as cantidad_articulos, authors.author from authors inner join articles ON authors.id = articles.author_id where authors.author = ?; "

    var params = [req.params.nombre]
    db.all(sql, params, (err, row) => {
      console.log(row);
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":row
        })
      });
});


/*  Consulta 6*/
/*  total de autores por pais especifico*/
/*  ejemplo: http://localhost:8000/api/autores_por_pais/Argentina  */
app.get("/api/autores_por_pais/:pais", (req, res, next) => {
    var sql= " Select DISTINCT authors.author from authors inner join articles ON authors.id = articles.author_id where articles.country = ?; "
    var params = [req.params.pais]
    db.all(sql, params, (err, row) => {
      console.log(row);
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":row
        })
      });
});


/*  Consulta 7*/
/*  Cantidad de articulos en un rango de fecha*/
/*  ejemplo : http://localhost:8000/api/intervalo_fecha/2020-03-27/2020-03-30 */
app.get("/api/intervalo_fecha/:date1/:date2", (req, res, next) => {
    var sql = "select count(case when gender='F' then 1 end) AS cantidad_articulos_mujeres, count(case when gender='M' then 1 end) AS cantidad_articulos_hombres from articles a JOIN authors au where DATE(added) BETWEEN ? AND ? AND a.author_id = au.id"
    var params = [req.params.date1, req.params.date2]
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
      });
});

/*  Consulta 8*/
/*  cantidad de mujeres y hombres en una fecha especifica*/
/*  ejemplo: http://localhost:8000/api/fecha/2020-03-27/  */
app.get("/api/fecha/:date", (req, res, next) => {
    var sql = "SELECT count(case when gender='F' then 1 end) AS cantidad_articulos_mujeres, count(case when gender='M' then 1 end) AS cantidad_articulos_hombres FROM articles a JOIN authors au ON a.author_id = au.id  where DATE(a.added) = ? "
    var params = [req.params.date]
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
      });
});

/*  Consulta 9*/
/*  cantidad de articulos en un rango de fecha segun pais*/
/*  ejemplo: http://localhost:8000/api/intervalo_fecha/2020-03-27/2020-03-30/Argentina */
app.get("/api/intervalo_fecha/:date1/:date2/:country", (req, res, next) => {
    var sql = "select count(case when gender='F' then 1 end) AS cantidad_articulos_mujeres, count(case when gender='M' then 1 end) AS cantidad_articulos_hombres from articles a JOIN authors au where DATE(added) BETWEEN ? AND ? AND a.author_id = au.id AND lower(a.country) = lower(?)"
    var params = [req.params.date1, req.params.date2, req.params.country]
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
      });
});

/*  Consulta 10 */
/*  Tabla completa de articles y authors */
/* ejemplo : http://localhost:8000/ */
app.get("/", (req, res, next) => {
  var sql = "select title,url,author,site,country,added,last_seen from articles a join authors aut where a.author_id = aut.id AND date(added) = date('now');"
  var params = []
  db.all(sql, params, (err, rows) => {

      if (err) {
        res.status(400).json({"error":err.message});
        return;
      }
      res.json({
          "message":"success",
          "data":rows

      })

    });
});

/*  Consulta 11*/
/*  cantidad de mujeres y hombres en una fecha especifica por pais*/
/*  ejemplo: http://localhost:8000/api/fecha/2020-03-27/  */
app.get("/api/fecha/:date/:country", (req, res, next) => {
    var sql = "SELECT count(case when gender='F' then 1 end) AS cantidad_articulos_mujeres, count(case when gender='M' then 1 end) AS cantidad_articulos_hombres FROM articles a JOIN authors au ON a.author_id = au.id  where DATE(a.added) = ? AND a.country = ?"
    var params = [req.params.date, req.params.country]
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
      });
});

/*  Consulta 12*/
/*  cantidad de mujeres y hombres en el dia de hoy*/
/*  ejemplo: http://localhost:8000/api/fecha_actual  */
app.get("/api/fecha_actual", (req, res, next) => {
    var sql = "SELECT count(case when gender='F' then 1 end) AS cantidad_articulos_mujeres, count(case when gender='M' then 1 end) AS cantidad_articulos_hombres FROM articles a JOIN authors au ON a.author_id = au.id  where DATE(a.added) = date('now');"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
      });
});

/*  Consulta 13*/
/*  cantidad de mujeres y hombres en el dia de hoy*/
/*  ejemplo: http://localhost:8000/api/fecha_actual  */
app.get("/api/fecha_actual/:country", (req, res, next) => {
    var sql = "SELECT count(case when gender='F' then 1 end) AS cantidad_articulos_mujeres, count(case when gender='M' then 1 end) AS cantidad_articulos_hombres FROM articles a JOIN authors au ON a.author_id = au.id  where DATE(a.added) = date('now') AND a.country = ?;"
    var params = [req.params.country]
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
      });
});


// Default response for any other request
app.use(function(req, res){
    res.status(404);
});
