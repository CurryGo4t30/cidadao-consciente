// 1️⃣ Importações
const express = require("express");
const cors = require("cors");

// 2️⃣ Inicializa o app
const app = express();

// 3️⃣ Middlewares
app.use(cors());
app.use(express.json());

// 4️⃣ "Banco de dados" em memória
let denuncias = []; // Nossa "caixa de entrada" temporária

// 5️⃣ Rotas
app.post("/denuncias", (req, res) => {
  const { titulo, categoria, descricao } = req.body;

  if (!titulo || !categoria || !descricao) {
    return res.status(400).json({ mensagem: "Todos os campos são obrigatórios" });
  }

  const novaDenuncia = {
    id: denuncias.length + 1,
    titulo,
    categoria,
    descricao,
    data: new Date()
  };

  denuncias.push(novaDenuncia);
  console.log("📢 Nova denúncia recebida:", novaDenuncia);

  res.status(201).json({
    mensagem: "Sucesso!",
    protocolo: novaDenuncia.id
  });
});

app.get("/denuncias", (req, res) => {
  res.json(denuncias);
});

// 6️⃣ Servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
