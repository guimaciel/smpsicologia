const { Pool } = require("pg");
require("dotenv").config();
// const { getTopicosFromProfissionais } = require('./topicos');

const dbCredentials = {
   user: process.env.DB_NAME,
   host: process.env.DB_HOST,
   database: process.env.DB_DATABASE,
   password: process.env.DB_PASSWORD,
   port: process.env.DB_PORT,
 };

 const getProfissional = (req, res) => {
   const pool = new Pool(dbCredentials);
   const userId = req.params.id;
   let profissional = null;
   pool
      .query(
         `SELECT p.id, u.nome, u.email, p.foto, p.video, p.apresentacao  FROM usuarios u join profissionais p on u.id = p.usuario WHERE u.id = $1`, [userId]
      )
      .then((res) => res.rows)
      .then((prof) => {
         profissional = prof;
      })
      .then(async ()=> {
         const pool2 = new Pool(dbCredentials);
         pool2
            .query(`SELECT tt.id, tt.descricao FROM profissionais_topicos pt join topicos_tratamentos tt on tt.id = pt.topico_tratamento WHERE pt.profissional = $1 `, [profissional[0].id])
            .then((res) => res.rows)
            .then((topicos) => {
               if (profissional)
                  profissional[0].topicos = topicos;
            })
            .then(() => {
               res.status(200).json(profissional);
            })
            .catch((err) => {
               console.log("err",err);
            })
            .finally(() => {
               pool2.end();
            })
      } )
      // .then(() => {
      //    res.status(200).json(profissional);
      // })
      .catch((err) => { 
         console.log("err",err);
      }) 
      .finally(() => {
         pool.end();   
      })

      
      
 }

 async function getTopicosFromProfissionais(prof_id) {
   const pool = new Pool(dbCredentials);
   pool
      .query(`SELECT tt.id, tt.descricao FROM profissionais_topicos pt join topicos_tratamentos tt on tt.id = pt.topico_tratamento WHERE pt.profissional = $1 `, [prof_id])
      .then((res) => res.rows)
      .then((topicos) => {
         console.log(topicos);
         return topicos;
      })
      .catch((err) => {
         console.log("err", err);
      })
      .finally(() => {
         pool.end();
      });
}

 module.exports = {getProfissional};