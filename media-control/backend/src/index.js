import Express from "express";
import * as http from "http";
import CORS from "cors";
import bodyParser from "body-parser";
import { Server as SocketServer } from "socket.io";
import ServerlessHttp from "serverless-http";
import { registerRoutes } from "./http/api.js";
import { setupSocket } from "./http/socket.js";
import { config } from "./config/config.js";
import FirebaseRtdb from "./services/firebase.js";
import MySQLService from "./services/mysql.js";
import SpotifyAPI from "./services/spotify.js";
import compression from "compression";

const app = Express();
app.use(
  CORS({
    origin: config.corsOrigin,
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(compression());

const server = http.createServer(app);
const io = new SocketServer(server, {
  cors: {
    origin: config.corsOrigin,
  },
});
const rtdb = new FirebaseRtdb();
const mysql = new MySQLService();
const spotify = new SpotifyAPI(mysql, rtdb);

setupSocket(io, rtdb, mysql, spotify);
registerRoutes(app);
app.io = io;
app.rtdb = rtdb;
app.mysql = mysql;
app.spotify = spotify;

server.listen(config.serverPort, (err) => {
  if (err) console.log(err);
  console.log(
    process.env.NODE_ENV === "production" ? "Production" : "Development",
    "server running on port",
    config.serverPort
  );
});

export const handler = ServerlessHttp(app);
