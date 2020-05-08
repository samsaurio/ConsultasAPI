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




/*  Consulta 13*/
/*  cantidad de articulos totales*/
/*  ejemplo: localhost:8000/api/cantidad_articulos */
app.get("/api/cantidad_articulos", (req, res, next) => {
    var sql= " SELECT COUNT(*) as cantidad_articulos from articles ; "

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

/*  Consulta 14*/
/*  meses de observacion*/
/*  ejemplo: localhost:8000/api/cantidad_meses */
app.get("/api/cantidad_meses", (req, res, next) => {
    var sql= "Select Cast ((JulianDay(DATE('now')) - JulianDay(DATE(MIN(added))))/30 As Integer)as Meses from Articles;"

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




/*  Consulta 15*/
/*  cantidad de sitios de periodicos*/
/*  ejemplo: localhost:8000/api/cantidad_medios */
app.get("/api/cantidad_medios", (req, res, next) => {
    var sql= "select count(distinct site) as medios from articles;"

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


/*  Consulta 16 */
/*  Cantidad de dias sin articulos de mujeres*/
/*  ejemplo: http://localhost:8000/api/dias_sin_mujeres  */
app.get("/api/dias_sin_mujeres", (req, res, next) => {
    var sql = "SELECT (SELECT COUNT(DISTINCT DATE(a.added)) FROM articles a) - (SELECT count(distinct date(a.added)) FROM articles a JOIN authors au ON a.author_id = au.id where au.gender= 'F') AS dias_sin_mujeres;"
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


/*  Consulta 17 */
/*  distribucion por semana*/
/*  ejemplo: http://localhost:8000/api/distribucion_semana  */
app.get("/api/distribucion_semana", (req, res, next) => {
    var sql = "select distinct(a.dia),(a.numero*1.0 /b.num*1.0)*100 as numero from ( select distinct(dia), count(dia) as numero from (select case cast (strftime('%w', DATE(added)) as integer) when 0 then 'Domingo' when 1 then 'Lunes' when 2 then 'Martes' when 3 then 'Miercoles'  when 4 then 'Jueves' when 5 then 'Viernes' else 'Sabado' end as dia from Articles inner join authors on authors.id=articles.author_id where authors.gender= 'F'  ) group by dia) as a inner join (select distinct(dia), count(dia) as num from (select   case cast (strftime('%w', DATE(added)) as integer) when 0 then 'Domingo' when 1 then 'Lunes' when 2 then 'Martes' when 3 then 'Miercoles' when 4 then 'Jueves' when 5 then 'Viernes' else 'Sabado' end as dia from Articles inner join authors  on authors.id = articles.author_id ) group by dia) as b on a.dia=b.dia group by a.dia;"
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

/*  Consulta 18 */
/*  porcentaje por de mujeres por semana en diferentes periodicos*/
/*  ejemplo: http://localhost:8000/api/distribucion_semana_periodico */
app.get("/api/distribucion_semana_periodico", (req, res, next) => {
    var sql = "select site, count (case when cast(strftime('%w', DATE(added))as INTEGER)=1 and authors.gender='F' then'1' end)*1.0/count (case when cast(strftime('%w', DATE(added))as)=1  then'0' end)*1.0*100 as Lunes, count (case when cast(strftime('%w', DATE(added))as INTEGER)=2 and authors.gender='F' then'2' end)*1.0/count (case when cast(strftime('%w', DATE(added))as)=2  then'2' end)*1.0*100  as Martes,count (case when cast(strftime('%w', DATE(added))as INTEGER)=3 and authors.gender='F' then'3' end)*1.0/count (case when cast(strftime('%w', DATE(added))as)=3  then'3' end)*1.0*100  as Miercoles,count (case when cast(strftime('%w', DATE(added))as INTEGER)=4 and authors.gender='F' then'4' end)*1.0/count (case when cast(strftime('%w', DATE(added))as)=4  then'4' end)*1.0*100  as Jueves,count (case when cast(strftime('%w', DATE(added))as INTEGER)=5 and authors.gender='F' then'5' end)*1.0/count (case when cast(strftime('%w', DATE(added))as)=5  then'5' end)*1.0*100  as Viernes,count (case when cast(strftime('%w', DATE(added))as INTEGER)=6 and authors.gender='F' then'6' end)*1.0/count (case when cast(strftime('%w', DATE(added))as)=6  then'6' end)*1.0*100  as Sabado,count (case when cast(strftime('%w', DATE(added))as INTEGER)=0 and authors.gender='F' then'0' end)*1.0/count (case when cast(strftime('%w', DATE(added))as)=0  then'0' end)*1.0*100  as Domingo from Articles inner join authors on authors.id=articles.author_id group by site;"

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




/*  Consulta 19*/
/*  porcentaje de mujeres por semana en un anio*/
/*  ejemplo: localhost:8000/api/distribucion_semana_anio */
app.get("/api/distribucion_semana_anio", (req, res, next) => {
    var sql= " SELECT distinct((strftime('%j', date(DATE(added), '-3 days', 'weekday 4')) - 1) / 7 + 1) as semana,( count(case when gender='F'  and (strftime('%j', date(DATE(added), '-3 days', 'weekday 4')) - 1) / 7 + 1 then 1 end )*1.0/ count( (strftime('%j', date(DATE(added), '-3 days', 'weekday 4')) - 1) / 7 + 1  )*1.0)*100 as porcentaje FROM articles a JOIN authors au ON a.author_id = au.id  group by semana ;"

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



/*  Consulta 20*/
/*  porcentaje de mujeres al mes por periodico */
/*  ejemplo: localhost:8000/api/distribucion_mes */
app.get("/api/distribucion_mes", (req, res, next) => {
    var sql= " select site, count (case when cast(strftime('%m', DATE(added))as INTEGER)=01 and authors.gender='F' then'1' end)*1.0/count (case when cast(strftime('%m', DATE(added))as)=01  then'0' end)*1.0*100 as Enero, count (case when cast(strftime('%m', DATE(added))as INTEGER)=02 and authors.gender='F' then'2' end)*1.0/count (case when cast(strftime('%m', DATE(added))as)=02  then'2' end)*1.0*100  as Febrero, count (case when cast(strftime('%m', DATE(added))as INTEGER)=03 and authors.gender='F' then'3' end)*1.0/count (case when cast(strftime('%m', DATE(added))as)=03  then'3' end)*1.0*100  as Marzo, count (case when cast(strftime('%m', DATE(added))as INTEGER)=04 and authors.gender='F' then'4' end)*1.0/count (case when cast(strftime('%m', DATE(added))as)=04  then'4' end)*1.0*100  as Abril, count (case when cast(strftime('%m', DATE(added))as INTEGER)=05 and authors.gender='F' then'5' end)*1.0/count (case when cast(strftime('%m', DATE(added))as)=05  then'5' end)*1.0*100  as Mayo, count (case when cast(strftime('%m', DATE(added))as INTEGER)=06 and authors.gender='F' then'6' end)*1.0/count (case when cast(strftime('%m', DATE(added))as)=06  then'6' end)*1.0*100  as Junio, count (case when cast(strftime('%m', DATE(added))as INTEGER)=07 and authors.gender='F' then'7' end)*1.0/count (case when cast(strftime('%m', DATE(added))as)=07  then'0' end)*1.0*100  as Julio, count (case when cast(strftime('%m', DATE(added))as INTEGER)=08 and authors.gender='F' then'8' end)*1.0/count (case when cast(strftime('%m', DATE(added))as)=08  then'0' end)*1.0*100  as Agosto, count (case when cast(strftime('%m', DATE(added))as INTEGER)=09 and authors.gender='F' then'9' end)*1.0/count (case when cast(strftime('%m', DATE(added))as)=09  then'0' end)*1.0*100  as Setiembre, count (case when cast(strftime('%m', DATE(added))as INTEGER)=10 and authors.gender='F' then'10' end)*1.0/count (case when cast(strftime('%m', DATE(added))as)=10  then'0' end)*1.0*100  as Octubre, count (case when cast(strftime('%m', DATE(added))as INTEGER)=11 and authors.gender='F' then'11' end)*1.0/count (case when cast(strftime('%m', DATE(added))as)=11  then'0' end)*1.0*100  as Noviembre, count (case when cast(strftime('%m', DATE(added))as INTEGER)=12 and authors.gender='F' then'12' end)*1.0/count (case when cast(strftime('%m', DATE(added))as)=12  then'0' end)*1.0*100  as Diciembre from Articles inner join authors on authors.id=articles.author_id group by site; "

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


/*  Consulta 21*/
/*  Cantidad total de autores que han publicado*/
/*  ejemplo: http://localhost:8000/api/total_autores */
app.get("/api/total_autores", (req, res, next) => {
    var sql = "Select count(DISTINCT authors.author) as cant_autores from authors inner join articles ON authors.id = articles.author_id;"
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
