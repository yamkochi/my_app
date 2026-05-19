import mysql from "mysql2/promise"

// Prevent multiple pools in development during Next.js hot reloads
const globalForPool = global

export const pool =
  globalForPool.mysqlPool ||
  mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    // Many cloud databases (like AWS, Aiven, PlanetScale) require a specific port
    port: parseInt(process.env.MYSQL_PORT || "3306", 10),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    // Cloud databases usually require SSL in production
    ssl:
      process.env.NODE_ENV === "production"
        ? { rejectUnauthorized: true }
        : false,
  })

if (process.env.NODE_ENV !== "production") globalForPool.mysqlPool = pool

// import mysql from "mysql2/promise"

// export const pool = mysql.createPool({
//   host: process.env.MYSQL_HOST,
//   user: process.env.MYSQL_USER,
//   password: process.env.MYSQL_PASSWORD,
//   database: process.env.MYSQL_DATABASE,
//   waitForConnections: true,
//   connectionLimit: 10,
// })
