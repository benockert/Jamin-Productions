export const config = {
  dbUrl:
    process.env.NODE_ENV === "production"
      ? "event-media-control-mysql.cahvamjokoa1.us-east-1.rds.amazonaws.com"
      : "127.0.0.1",
  dbUser: process.env.NODE_ENV === "production" ? "admin" : "root",
  dbPass:
    process.env.NODE_ENV === "production" ? "bZsimpSlV5ITKzMMst0v" : "password",
  dbPort: process.env.DB_PORT || 3306,
  dbConnectionLimit: process.env.CONNECTION_LIMIT || 10,
  dbSchema: process.env.DEFAULT_SCHEMA || "event_media_control",
  corsOrigin:
    process.env.NODE_ENV === "production"
      ? "http://northeastern.event-media-control.com"
      : "http://localhost:3000",
  serverPort: process.env.PORT || 5002,
  defaultNotFoundPage: ["404", "", "nu_23_banner_ns"],
  jwtSecret:
    process.env.JWT_SECRET ||
    "a137240556b2e77874168d8b383dfb1cfc90f47d3b955e4f74967d718fe13e7a939ddb",
};
