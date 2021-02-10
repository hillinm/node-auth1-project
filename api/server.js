
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);

const usersRouter = require("./users/users-router.js");
const authRouter = require('./auth/auth-router.js');

const server = express();

const sessionConfig = {
  name: 'monkey',
  secret: 'keep it secret keep it dark',
  cookie: {
    maxAge: 60 * 60 * 1000,
    secure: false,
    httpOnly: true,
  },
  resave: false,
  saveUninitialized: false,
  store: new KnexSessionStore({
    knex: require('../data/dbConfig.js'), 
    tablename: 'sessions', 
    sidfieldname: 'sid', 
    createtable: true, 
    clearInterval: 60 * 60 * 1000,
  }),
}

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig));

server.use("/api/users", usersRouter);
server.use("/api/auth", authRouter);

server.get("/", (req, res) => {
  res.json({ api: "We in the house" });
});

module.exports = server;