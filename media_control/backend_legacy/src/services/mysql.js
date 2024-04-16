import { createPool } from "mysql2";
import { config } from "../config/config.js";

export default class MySQLService {
  constructor() {
    console.log(config.dbUrl);
    this.pool = createPool({
      connectionLimit: config.dbConnectionLimit,
      host: config.dbUrl,
      user: config.dbUser,
      password: config.dbPass,
      port: config.dbPort,
      database: config.dbSchema,
    });
    this.pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log("Successfully connected to mysql database");
      connection.release();
    });
  }

  query(q, v) {
    return new Promise((resolve, reject) => {
      this.pool.query(q, v, (err, rows) => {
        return err ? reject(err) : resolve(rows);
      });
    });
  }

  getEventById(id) {
    return this.query(
      "SELECT id, name, client_id, banner_image_name FROM event_media_control.events WHERE id = ? LIMIT 1;",
      [id]
    );
  }

  getClientById(id) {
    return this.query(
      "SELECT name FROM event_media_control.clients WHERE id = ? LIMIT 1;",
      [id]
    );
  }

  getScreensByEventId(id) {
    return this.query(
      "SELECT id, name, event_id, description, default_media_id, url_name, image_url, playback_enabled, orientation FROM event_media_control.screens WHERE event_id = ?;",
      [id]
    );
  }

  getDefaultMediaByScreenName(screenName) {
    return this.query(
      "SELECT m.url_name FROM event_media_control.screens s INNER JOIN event_media_control.media m ON s.default_media_id = m.id WHERE s.url_name = ? LIMIT 1;",
      [screenName]
    );
  }

  getMediaByEventId(id) {
    return this.query(
      "SELECT id, name, description, event_id, url_name, thumbnail_image, short_name, orientation from event_media_control.media WHERE event_id = ?;",
      [id]
    );
  }

  getEventAndScopeByAccessCode(accessCode) {
    return this.query(
      "SELECT e.id, ac.home_url, ac.scope FROM event_media_control.access_codes ac INNER JOIN event_media_control.events e on ac.event_id = e.id WHERE ac.code = ?;",
      [accessCode]
    );
  }

  getCurrentScreenMediaFromSchedule(eventId, screenName) {
    return this.query(
      "SELECT media_url_name FROM (SELECT sch.event_id, scr.url_name as screen_url_name, m.url_name as media_url_name, sch.time FROM event_media_control.schedule sch INNER JOIN event_media_control.screens scr ON scr.id = sch.screen_id INNER JOIN event_media_control.media m ON m.id = sch.target_media_id) as t1 where t1.event_id = ? and t1.screen_url_name = ? AND time < ? ORDER by t1.time DESC LIMIT 1;",
      [
        eventId,
        screenName,
        new Date().toISOString().slice(0, 19).replace("T", " "),
      ]
    );
  }

  getNextScreenSchedules(eventId) {
    return this.query(
      "SELECT * FROM (SELECT sch.event_id, scr.url_name, m.short_name, sch.time FROM event_media_control.schedule sch INNER JOIN event_media_control.screens scr ON scr.id = sch.screen_id INNER JOIN event_media_control.media m ON m.id = sch.target_media_id WHERE sch.time >= NOW()) as t1 WHERE t1.event_id = ? GROUP BY t1.url_name ORDER BY time ASC;",
      [eventId]
    );
  }

  getSpotifyAccessCode(eventId) {
    return this.query(
      "SELECT * FROM event_media_control.spotify WHERE event_id = ?;",
      [eventId]
    );
  }

  setAccessCode(access_token, refresh_token, eventId, expiresIn) {
    const expiresTimestamp = Date.now() + expiresIn * 1000 - 60000; // 1 minute buffer
    return this.query(
      "UPDATE event_media_control.spotify SET access_code = ?, refresh_token = ?, expires = ? WHERE event_id = ?;",
      [access_token, refresh_token, expiresTimestamp, eventId]
    );
  }

  checkPlaybackEnabled(eventId, screenUrl) {
    return this.query(
      "SELECT * from event_media_control.screens where playback_enabled = ? and url_name = ? and event_id = ?;",
      [1, screenUrl, eventId]
    );
  }
}
