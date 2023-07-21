const express = require("express");
const app = express();
app.use(express.json());
const { open } = require("sqlite");
const sqlite = require("sqlite3");
const path = require("path");
const dbPath = path.join(__dirname, "cricketTeam.db");
let db = null;

const initializeDataBaseAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite.Database,
    });

    app.listen(3000, () => {
      console.log("Server is Running");
    });
  } catch (error) {
    console.log(`db error: ${error.message}`);
    process.exit(1);
  }
};

initializeDataBaseAndServer();

convertToCamelCase = (data) => {
  return {
    playerId: data.player_id,
    playerName: data.player_name,
    jerseyNumber: data.jersey_number,
    role: data.role,
  };
};

// API 1 Get All Players from Cricket_Team Table

app.get("/players", async (req, res) => {
  const playersSqlQuery = `
    SELECT * FROM cricket_team
    `;
  const playersData = await db.all(playersSqlQuery);
  const data = playersData.map((each) => convertToCamelCase(each));
  res.send(data);
});

// API 2 Create A New Player Data into Cricket_team Table

app.post("/players/", async (req, res) => {
  const playerData = req.body;
  console.log(playerData);
  const { playerName, jerseyNumber, role } = playerData;

  const createPlayerQuery = `
      INSERT INTO cricket_team (player_name, jersey_number, role) 
      VALUES
      ("${playerName}", ${jerseyNumber}, "${role}")
      `;
  await db.run(createPlayerQuery);
  res.send("Player Added to Team");
});

// API 3 Get Particular Player Data From Cricket_Team Table

app.get("/players/:playerId", async (req, res) => {
  const { playerId } = req.params;

  const playerSqlQuery = `
    SELECT * FROM cricket_team WHERE player_id = ${playerId}
    `;
  const playerData = await db.get(playerSqlQuery);
  res.send(convertToCamelCase(playerData));
});

// API 4 Update a Player Data in a cricket team table

app.put("/players/:playerId", async (req, res) => {
  const { playerId } = req.params;
  const updatePlayerData = req.body;
  const { playerName, jerseyNumber, role } = updatePlayerData;

  const updatePlayerDataQuery = `
    UPDATE cricket_team
    SET player_name = "${playerName}",jersey_number = ${jerseyNumber}, role="${role}"
    WHERE player_id = ${playerId}
    `;
  await db.run(updatePlayerDataQuery);
  res.send("Player Details Updated");
});

// API 5 Delete a Player from cricket team table

app.delete("/players/:playerId", async (req, res) => {
  const { playerId } = req.params;

  const deletePlayerQuery = `
    DELETE FROM cricket_team WHERE player_id = ${playerId}
    `;
  await db.run(deletePlayerQuery);
  res.send("Player Removed");
});

module.exports = app;
