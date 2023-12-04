const { Pool } = require("pg");
require("dotenv").config();

const dbCredentials = {
   user: process.env.DB_NAME,
   host: process.env.DB_HOST,
   database: process.env.DB_DATABASE,
   password: process.env.DB_PASSWORD,
   port: process.env.DB_PORT,
 };

const getTopicos = (req, res) => {
   const pool = new Pool(dbCredentials);
   pool
      .query(
         `SELECT id, descricao FROM topicos_tratamentos ORDER BY descricao ASC`
      )
      .then((res) => res.rows)
      .then((topicos) => {
         res.status(200).json(topicos);
      })
      .catch((err) => {
         console.log("err",err);
      })
      .finally(() => {
         pool.end();
      })
}

const getTopicosFromProfissionais = (req, res) => {
   const pool = new Pool(dbCredentials);
   pool
      .query(`SELECT tt.id, tt.descricao FROM profissionais_topicos pt join topicos_tratamento tt on tt.id = pt.topico_tratamento WHERE pt.profissional = $1 `, [profissional.id])
      .then((res) => res.rows)
      .then((topicos) => {
         res.status(200).json(topicos);
      })
      .catch((err) => {
         console.log("err",err);
      })
      .finally(() => {
         pool.end();
      })
}


module.exports = {getTopicos, getTopicosFromProfissionais};