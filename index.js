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
    res.json({
      Heroi_Criado: {
        name: name,
        health: health,
        attack: attack,
        defense: defense,
      },
    });
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
    res.json({ Heroi_Edited: { name, health, attack, defense } });
  } catch (error) {
    console.error("Erro ao atualizar heroi", error);
    res.status(500).json({ error: error.message });
  }
});

app.delete("/heroes/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM heroes WHERE id = $1", [id]);
    res.json({ Heroi_Deleted: { id } });
  } catch (error) {
    console.error("Erro ao deletar heroi", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/battles", async (req, res) => {
  const { hero1, hero2 } = req.body;

  try {
    const hero11 = await pool.query("SELECT * FROM heroes WHERE id = $1", [
      hero1,
    ]);
    const hero22 = await pool.query("SELECT * FROM heroes WHERE id = $1", [
      hero2,
    ]);

    const hero1Attack = hero11.rows[0].attack;
    const hero2Attack = hero22.rows[0].attack;

    let hero1Health = hero11.rows[0].health;
    let hero2Health = hero22.rows[0].health;

    let winner_id = null;

    while (hero1Health > 0 && hero2Health > 0) {
      hero2Health -= hero1Attack;
      hero1Health -= hero2Attack;
    }

    if (hero1Attack > hero2Attack) {
      winner_id = hero11.rows[0].id;
      res.json(`${hero11.rows[0].name} venceu`);
    } else if (hero1Attack < hero2Attack) {
      winner_id = hero22.rows[0].id;
      res.json(`${hero22.rows[0].name} venceu`);
    } else if (hero1Health > hero2Health) {
      winner_id = hero11.rows[0].id;
      res.json(`${hero11.rows[0].name} venceu`);
    } else if (hero1Health < hero2Health) {
      winner_id = hero22.rows[0].id;
      res.json(`${hero22.rows[0].name} venceu`);
    } else {
      winner_id = null;
      res.json("Empate");
    }

    /* if (hero1Health == hero2Health) {
      winner_id = null;
      res.json("Empate");
    } else if (hero1Health < hero2Health) {
      winner_id = hero22.rows[0].id;
      res.json(`${hero22.rows[0].name} venceu`);
    } else {
      winner_id = hero11.rows[0].id;
      res.json(`${hero11.rows[0].name} venceu`);
    } */

    await pool.query(
      "INSERT INTO battle (hero1_id, hero2_id, winner_id ) VALUES ($1, $2, $3)",
      [hero1, hero2, winner_id]
    );
  } catch (error) {
    console.error("Erro ao criar batalha", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/battles", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        battle.id AS id_batalha,
        heroes1.name AS Heroi_1,
        heroes2.name AS Heroi_2,
        heroes3.name AS winner_name,
        heroes3.health AS winner_health,
        heroes3.attack AS winner_attack,
        heroes3.defense AS winner_defense
      FROM battle
      LEFT JOIN heroes AS heroes1 ON battle.hero1_id = heroes1.id
      LEFT JOIN heroes AS heroes2 ON battle.hero2_id = heroes2.id
      LEFT JOIN heroes AS heroes3 ON battle.winner_id = heroes3.id
    `);

    res.json({
      total: result.rowCount,
      batalhas: result.rows.map((row) => ({
        id_batalha: row.id_batalha,
        heroi1: row.heroi_1 ?? "Desconhecido",
        heroi2: row.heroi_2 ?? "Desconhecido",
        Vencedor: {
          nome: row.winner_name ?? "Desconhecido",
          vida: row.winner_health ?? "N/A",
          ataque: row.winner_attack ?? "N/A",
          defesa: row.winner_defense ?? "N/A",
        },
      })),
    });
    console.log("Result rows:", result.rows);
  } catch (error) {
    console.error("Erro ao obter batalhas", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}🚀`);
});
