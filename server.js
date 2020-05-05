var express = require("express");
var app = express();
var db = require("./database.js");
var cors = require('cors');
// Server port
var HTTP_PORT = 8000
// Start server
app.use(cors());
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
});



/*  Consulta 1*/
/*  Total de articulos existentes en la base de datos*/
/*  ejemplo: /api/articulos*/
app.get("/api/articulos", (req, res, next) => {
    var sql = "select a.title, a.url, aut.author, aut.gender, a.site, a.added, a.last_seen from articles a join authors aut on a.author_id = aut.id;"
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

/*  Consulta 2*/
/*  Total por periodico de hombres y mujeres*/
/*  ejemplo : http://localhost:8000/api/periodicos*/
app.get("/api/periodicos", (req, res, next) => {
    var sql = "Select DISTINCT articles.site, count(case when authors.gender='F' then 1 end) AS articulos_mujeres, count(case when authors.gender='M' then 1 end) AS articulos_hombres from authors join articles where authors.id = articles.author_id GROUP BY articles.site;"
    var params = []
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


/*  Consulta 3*/
/*  Todos los articulos de un peridico X*/
/*  ejemplo : http://localhost:8000/api/periodico/abc*/
app.get("/api/periodico/:site_name", (req, res, next) => {
    var sql = "select title,url,site,added,last_seen, author,gender from articles a join authors aut on (a.author_id = aut.id) where site = ?;"
    var params = [req.params.site_name]
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



/*  Consulta 4*/
/*  Cuenta del total de cada genero desde la primera fecha hasta la fecha actual*/
/*  ejemplo: http://localhost:8000/api/historico_genero*/
app.get("/api/historico_genero", (req, res, next) => {
    var sql =
"SELECT count(case when gender='F' then 1 end) AS cantidad_articulos_mujeres, count(case when gender='M' then 1 end) AS cantidad_articulos_hombres, DATE(MIN(a.added)) AS primer_fecha, DATE('now') AS ultima_fecha FROM articles a JOIN authors au ON a.author_id = au.id;"
    var params = []
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



/*  Consulta 5*/
/*  Todos los articulos de un autor*/
/*  Cada espacio en un nombre debe ser sustituido por los siguientes caracteres %20 */
/*  ejemplo:http://localhost:8000/api/articulos_por_autor/Augusto%20Dos%20Santos */
app.get("/api/articulos_por_autor/:nombre", (req, res, next) => {
    var sql= "SELECT authors.gender,authors.author,  articles.title from authors inner join articles ON authors.id = articles.author_id where authors.author = ?; "

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


/*  Consulta 7*/
/*  total de autores registrados en la base*/
/*  ejemplo: http://localhost:8000/api/autores */
app.get("/api/autores", (req, res, next) => {
    var sql= " Select DISTINCT authors.author, authors.gender from authors inner join articles ON authors.id = articles.author_id; "
    var params = []
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


/*  Consulta 8*/
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

/*  Consulta 9*/
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



/*  Consulta 10 */
/*  Tabla completa de articles y authors del dia */
/* ejemplo : http://localhost:8000/ */
app.get("/", (req, res, next) => {
  var sql = "select title,url,author,site,added,last_seen from articles a join authors aut where a.author_id = aut.id AND date(added) = date('now');"
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
/*  Cantidad de mujeres y hombres en el dia de hoy*/
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

/*  Consulta 12*/
/*  Cantidad de mujeres y hombres anuales*/
/*  ejemplo: http://localhost:8000/api/record_anual  */
app.get("/api/record_anual", (req, res, next) => {
    var sql = "select strftime('%Y', added) as year, count(case when gender='F' then 1 end) AS cantidad_articulos_mujeres, count(case when gender='M' then 1 end) AS cantidad_articulos_hombres from authors join articles on authors.id = articles.author_id GROUP BY year;"
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


// Default response for any other request
app.use(function(req, res){
    res.status(404);
});
