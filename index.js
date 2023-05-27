const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const salt = bcrypt.genSaltSync(10);
const mysql = require("mysql");

// Prisma Client
const prisma = new PrismaClient();
const app = express();
const port = 3000;

// handle cors, form data, and json
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Konfigurasi koneksi MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "mbkm-si_b4_presensigps_db",
});

// Membuka koneksi ke database
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("Terhubung ke database MySQL");
});

// Fungsi untuk mengatasi Access denied error dengan mencoba kembali koneksi
// const handleDisconnect = () => {
//   db.connect((err) => {
//     if (err) {
//       console.error('Koneksi gagal:', err);
//       setTimeout(handleDisconnect, 2000); // Mencoba koneksi ulang setelah 2 detik
//     } else {
//       console.log('Terhubung ke database MySQL');
//     }
//   });
// };
// rest api routes
app.get("/", async (req, res) => {
  res.send({
    message: "Hello this is API from Express Tutorial 🐻",
  });
});

// API Create
app.post("/employee/create", async (req, res) => {
  const { id, name, alamat, email, password, jenis_kelamin, no_hp, divisiId } = req.body;
  try {
    const Employee = await prisma.Employee.create({
      data: {
        nama: "Riska",
        nik: "6547659",
        alamat: "Bandung",
        no_hp: "085740781307",
        email: "riskaptriii226@gmail.com",
        password: hashSync("admin4", salt),
        jenis_kelamin: "Wanita",
        roletype: "Admin",
        in_active: "True",
      },
    });
    res.json(Employee);
  } catch (error) {
    res.status(500).json({ error: "Failed to create employee" });
  }
});

// API Read all users
app.get("/Employee", (req, res) => {
  const query = "SELECT * FROM employee";
  db.query(query, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: "Gagal membaca data pengguna" });
    } else {
      res.json(result);
    }
  });
});

// API Update
app.put("/Employee/:id", (req, res) => {
  const id = req.params.id;
  const { nama, nik, alamat, no_hp, email, password, jenis_kelamin, roletype, in_active } = req.body;
  const query = "UPDATE employee SET nama= ?, nik= ?,jenis_kelamin= ?, alamat = ?, no_hp= ?, email= ?, password= ?, roletype= ?, in_active= ? WHERE id_employee= ?";
  const values = [nama, nik, alamat, no_hp, email, password, jenis_kelamin, roletype, in_active];

  db.query(query, values, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: "Gagal mengupdate pengguna" });
    } else {
      res.json({ message: "Pengguna telah berhasil diupdate" });
    }
  });
});

// // API Delete
app.delete("/Employee/:id", (req, res) => {
  const id = req.params.id;
  const query = "DELETE FROM employee WHERE id_employee = ?";
});

app.listen(port, () => {
  console.log(`🚀 @ http://localhost:${port}`);
});
