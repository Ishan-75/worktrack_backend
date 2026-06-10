const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

db.run(`
CREATE TABLE IF NOT EXISTS work_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  start_time TEXT,
  end_time TEXT,
  hours_worked REAL,
  salary REAL
)
`);

app.use(cors());
app.use(express.json());

app.post("/worklog", (req, res) => {
const {
  startTime,
  endTime,
  hoursWorked,
  salary
} = req.body;

  db.run(
    `
  INSERT INTO work_logs
(start_time, end_time, hours_worked, salary)
VALUES (?, ?, ?, ?)
    `,
    [
  startTime,
  endTime,
  hoursWorked,
  salary
],
    function (err) {
      if (err) {
        return res.status(500).json({
          error: err.message,
        });
      }

      res.json({
        success: true,
        id: this.lastID,
      });
    }
  );
});

app.get("/worklog", (req, res) => {
  db.all(
    "SELECT * FROM work_logs",
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({
          error: err.message,
        });
      }

      res.json(rows);
    }
  );
});

app.get("/salary", (req, res) => {
  const hourlyRate = 45;

  db.all(
    "SELECT salary FROM work_logs",
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json(err);
      }

      const totalSalary = rows.reduce(
  (sum, row) =>
    sum + row.salary,
  0
);

      res.json({
        salary: totalSalary,
      });
    }
  );
});

app.listen(3000, () => {
  console.log("Server running");
});
