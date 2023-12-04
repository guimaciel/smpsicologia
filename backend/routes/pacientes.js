const { Pool } = require("pg");
require("dotenv").config();

const dbCredentials = {
   user: process.env.DB_NAME,
   host: process.env.DB_HOST,
   database: process.env.DB_DATABASE,
   password: process.env.DB_PASSWORD,
   port: process.env.DB_PORT,
 };

 const getPaciente = (req, res) => {
   const pool = new Pool(dbCredentials);
   const userId = req.params.id;
   pool
      .query(
         `SELECT u.nome, u.email, documento, telefone, telefone_emergencia, contato_emergencia, endereco, bairro, cidade, estado, pais, cep, versao_termos FROM usuarios u join pacientes p on u.id = p.usuario WHERE u.id = $1`, [userId]
      )
      .then((res) => res.rows)
      .then((paciente) => {
         res.status(200).json(paciente);
      })
      .catch((err) => { 
         console.log("err",err);
      })
      .finally(() => {
         pool.end();
      })
 }

 module.exports = {getPaciente};