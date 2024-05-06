const express = require("express");
const { Pool } = require("pg");

const app = express();
const PORT = 7777;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "herosbattle",
  password: "ds564",
  port: 7007,
});

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server ta top");
});

app.get("/heroes", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM heroes");
    res.json({
      total: result.rowCount,
      herois: result.rows,
    });
  } catch (error) {
    console.error("Erro ao obter herois", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/heroes/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query("SELECT * FROM heroes WHERE id = $1", [id]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao obter heroi", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/heroes/nome/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const result = await pool.query(
      "SELECT * FROM heroes WHERE name ILIKE $1",
      [`${name}%`]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Heroi não encontrado" });
    } else {
      return res.json(result.rows);
    }
  } catch (error) {
    console.error("Erro ao obter heroi", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/heroes", async (req, res) => {
  const { name, health, attack, defense } = req.body;

  try {
    await pool.query(
      "INSERT INTO heroes (name, health, attack, defense) VALUES ($1, $2, $3, $4)",
      [name, health, attack, defense]
    );
    res.json("Heroi adicionado");
  } catch (error) {
    console.error("Erro ao criar heroi", error);
    res.status(500).json({ error: error.message });
  }
});

app.put("/heroes/:id", async (req, res) => {
  const { id } = req.params;
  const { name, health, attack, defense } = req.body;

  try {
    await pool.query(
      "UPDATE heroes SET name = $1, health = $2, attack = $3, defense = $4 WHERE id = $5",
      [name, health, attack, defense, id]
    );
    res.json("Heroi atualizado");
  } catch (error) {
    console.error("Erro ao atualizar heroi", error);
    res.status(500).json({ error: error.message });
  }
});

app.delete("/heroes/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM heroes WHERE id = $1", [id]);
    res.json("Heroi deletado");
  } catch (error) {
    console.error("Erro ao deletar heroi", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}🚀`);
});
