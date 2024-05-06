const express = require("express");
const { Pool } = require("pg");

const app = express();
const PORT = 7777;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "exercback",
  password: "ds564",
  port: 7007,
});

app.use(express.json());

app.get("/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM usuarios");
    res.json({
      total: result.rowCount,
      usuarios: result.rows,
    });
  } catch (error) {
    console.error("Erro ao obter usuários", error);
    res.status(500).json("Erro ao obter usuários");
  }
});

app.get("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM usuarios WHERE id = $1", [
      id,
    ]);
    if (result.rowCount === 0) {
      return res.status(404).json("Usuário não encontrado");
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error("Erro ao obter usuário", error);
    res.status(500).json("Erro ao obter usuário");
  }
});

app.post("/users", async (req, res) => {
  const { nome, sobrenome, data, email } = req.body;

  const dataNascimento = new Date(data);
  const hoje = new Date();
  let idade = hoje.getFullYear() - dataNascimento.getFullYear();
  const mesAtual = hoje.getMonth();
  const mesNascimento = dataNascimento.getMonth();

  if (
    mesAtual < mesNascimento ||
    (mesAtual === mesNascimento && hoje.getDate() < dataNascimento.getDate())
  ) {
    idade--;
  }

  const dia = dataNascimento.getDate();
  const mes = dataNascimento.getMonth() + 1;
  let signo = "";

  if ((mes === 1 && dia >= 20) || (mes === 2 && dia <= 18)) {
    signo = "Aquário";
  } else if ((mes === 2 && dia >= 19) || (mes === 3 && dia <= 20)) {
    signo = "Peixes";
  } else if ((mes === 3 && dia >= 21) || (mes === 4 && dia <= 19)) {
    signo = "Áries";
  } else if ((mes === 4 && dia >= 20) || (mes === 5 && dia <= 20)) {
    signo = "Touro";
  } else if ((mes === 5 && dia >= 21) || (mes === 6 && dia <= 20)) {
    signo = "Gêmeos";
  } else if ((mes === 6 && dia >= 21) || (mes === 7 && dia <= 22)) {
    signo = "Câncer";
  } else if ((mes === 7 && dia >= 23) || (mes === 8 && dia <= 22)) {
    signo = "Leão";
  } else if ((mes === 8 && dia >= 23) || (mes === 9 && dia <= 22)) {
    signo = "Virgem";
  } else if ((mes === 9 && dia >= 23) || (mes === 10 && dia <= 22)) {
    signo = "Libra";
  } else if ((mes === 10 && dia >= 23) || (mes === 11 && dia <= 21)) {
    signo = "Escorpião";
  } else if ((mes === 11 && dia >= 22) || (mes === 12 && dia <= 21)) {
    signo = "Sagitário";
  } else {
    signo = "Capricórnio";
  }

  try {
    await pool.query(
      "INSERT INTO usuarios (nome, sobrenome, data, email, idade, signo) VALUES ($1, $2, $3, $4, $5, $6)",
      [nome, sobrenome, data, email, idade, signo]
    );
    res.send("Usuário criado com sucesso");
  } catch (error) {
    console.error("Erro ao inserir usuário", error);
    res.status(500).json("Erro ao inserir usuário");
  }
});

app.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, sobrenome, data, email } = req.body;

  const dataNascimento = new Date(data);
  const hoje = new Date();
  let idade = hoje.getFullYear() - dataNascimento.getFullYear();
  const mesAtual = hoje.getMonth();
  const mesNascimento = dataNascimento.getMonth();

  if (
    mesAtual < mesNascimento ||
    (mesAtual === mesNascimento && hoje.getDate() < dataNascimento.getDate())
  ) {
    idade--;
  }

  const dia = dataNascimento.getDate();
  const mes = dataNascimento.getMonth() + 1;
  let signo = "";

  if ((mes === 1 && dia >= 20) || (mes === 2 && dia <= 18)) {
    signo = "Aquário";
  } else if ((mes === 2 && dia >= 19) || (mes === 3 && dia <= 20)) {
    signo = "Peixes";
  } else if ((mes === 3 && dia >= 21) || (mes === 4 && dia <= 19)) {
    signo = "Áries";
  } else if ((mes === 4 && dia >= 20) || (mes === 5 && dia <= 20)) {
    signo = "Touro";
  } else if ((mes === 5 && dia >= 21) || (mes === 6 && dia <= 20)) {
    signo = "Gêmeos";
  } else if ((mes === 6 && dia >= 21) || (mes === 7 && dia <= 22)) {
    signo = "Câncer";
  } else if ((mes === 7 && dia >= 23) || (mes === 8 && dia <= 22)) {
    signo = "Leão";
  } else if ((mes === 8 && dia >= 23) || (mes === 9 && dia <= 22)) {
    signo = "Virgem";
  } else if ((mes === 9 && dia >= 23) || (mes === 10 && dia <= 22)) {
    signo = "Libra";
  } else if ((mes === 10 && dia >= 23) || (mes === 11 && dia <= 21)) {
    signo = "Escorpião";
  } else if ((mes === 11 && dia >= 22) || (mes === 12 && dia <= 21)) {
    signo = "Sagitário";
  } else {
    signo = "Capricórnio";
  }
  try {
    await pool.query(
      "UPDATE usuarios SET nome = $1, sobrenome = $2, data = $3,  email = $4, idade = $5, signo = $6 WHERE id = $7",
      [nome, sobrenome, data, email, idade, signo, id]
    );
    res.status(200).send("Usuário atualizado com sucesso");
  } catch (error) {
    console.error("Erro ao atualizar usuário", error);
    res.status(500).json("Erro ao atualizar usuário");
  }
});

app.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM usuarios WHERE id = $1", [id]);
    res.status(200).send("Usuário deletado com sucesso");
  } catch (error) {
    console.error("Erro ao deletar usuário", error);
    res.status(500).json("Erro ao deletar usuário");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}🚀`);
});
