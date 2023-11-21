const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const path = require('path');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const port = 3000;
app.use(express.static("public"))

mongoose.connect('mongodb://127.0.0.1:27017/humansunity', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.connection.on('error', err => {
  console.error('Erro de conexão com o MongoDB:', err);
});

const usuarioSchema = new mongoose.Schema({
  email: { type: String, required: true },
  senha: { type: String }
});

const Usuario = mongoose.model("Usuario", usuarioSchema);

const cadiSchema = new mongoose.Schema({
  nome: { type: String },
  email: { type: String, required: true },
  datanasc: { type: Date },
  pais : { type : String },
  senha: { type: String }
});

const Cadi = mongoose.model("Cadi", cadiSchema);

app.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  const hashedPassword = await bcrypt.hash(senha, 10);

  const usuario = new Usuario({
    email: email,
    senha: hashedPassword,
  });

  try {
    const newUsuario = await usuario.save();
    res.json({ error: null, msg: "Cadastro Feito", usuarioId: newUsuario._id });
  } catch (error) {
    res.status(400).json({ error });
  }
});

app.post("/cadastro-cadi", async (req, res) => {
  const { nome, email, datanasc, pais, senha } = req.body;

  const hashedPassword = await bcrypt.hash(senha, 10);

  const cadi = new Cadi({
    nome: nome,
    email: email,
    datanasc: datanasc,
    pais: pais,
    senha: hashedPassword
  });

  try {
    const newCadi = await cadi.save();
    res.json({ error: null, msg: "Cadastro ok", cadiId: newCadi._id });
  } catch (error) {
    res.status(400).json({ error });
  }
});

app.get("/login", async (req, res) => {
  res.sendFile(__dirname + "/pags/login.html");
});

app.get("/cadastro-cadi", async (req, res) => {
  res.sendFile(__dirname + "/pags/cadastro.html");
});

app.get("/sobre", async (req, res) => {
  res.sendFile(__dirname + "/pags/sobre.html");
});

app.get("/index", async (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// Configurando a rota para arquivos estáticos (CSS, imagens, etc.)
app.use('/static', express.static(path.join(__dirname, 'public')));



// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});