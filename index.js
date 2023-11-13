const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const port = 3000;

mongoose.connect('mongodb://127.0.0.1:27017/humansunity', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 20000
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
  senha: { type: String }
});

const Cadi = mongoose.model("Cadi", cadiSchema);

app.post("/cadastro-usuario", async (req, res) => {
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
  const { nome, email, senha } = req.body;

  const hashedPassword = await bcrypt.hash(senha, 10);

  const cadi = new Cadi({
    nome: nome,
    email: email,
    senha: hashedPassword
  });

  try {
    const newCadi = await cadi.save();
    res.json({ error: null, msg: "Cadastro ok", cadiId: newCadi._id });
  } catch (error) {
    res.status(400).json({ error });
  }
});

app.get("/cadastro-usuario", async (req, res) => {
  res.sendFile(__dirname + "/cadastrousuario.html");
});

app.get("/cadastro-cadi", async (req, res) => {
  res.sendFile(__dirname + "/cadastro.html");
});

app.get("/", async (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
