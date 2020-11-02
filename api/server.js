const express = require("express");

const db = require("../data/dbConfig.js");

const server = express();

server.use(express.json());

const Accounts = {
  getAll() {
    return db("accounts");
  },
  getById(id) {
    return db("accounts").where({ id });
  },
  create(account) {
    return db("accounts").insert(account);
  },
  update(id, account) {
    return db("accounts").where({ id }).update(account);
  },
  delete(id) {
    return db("accounts").where({ id }).del();
  },
};

server.get("/api/accounts", (req, res) => {
  Accounts.getAll()
    .then((accounts) => {
      res.status(200).json(accounts);
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

server.get("/api/accounts/:id", (req, res) => {
  Accounts.getById(req.params.id)
    .then((data) => {
      res.status(200).json(data[0]);
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

server.post("/api/accounts", (req, res) => {
  Accounts.create(req.body)
    .then(([id]) => {
      return Accounts.getById(id).first();
    })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

server.put("/api/accounts/:id", async (req, res) => {
  try {
    await Accounts.update(req.params.id, req.body);
    const updatedAccount = await Accounts.getById(req.params.id).first();
    res.status(200).json(updatedAccount);
  } catch (error) {
    res.status(500).json({ error: err.message });
  }
});

server.delete("/api/accounts/:id", (req, res) => {
  Accounts.delete(req.params.id)
    .then((data) => {
      res.status(200).json({ message: 'Account was deleted' });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

module.exports = server;
