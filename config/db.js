import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL não definida. Configure a variável de ambiente.');
}

// Aiven uses its own CA certificate. Put the contents of the ca.pem file
// (Aiven console > Overview > CA certificate) in the DB_CA_CERT variable.
const ca = process.env.DB_CA_CERT ? process.env.DB_CA_CERT.replace(/\\n/g, '\n') : undefined;

if (!ca) {
  console.warn('DB_CA_CERT não definida: conectando com SSL sem verificar o certificado.');
}

// Remove query params like ?ssl-mode=REQUIRED that mysql2 does not understand
const uri = process.env.DATABASE_URL ? process.env.DATABASE_URL.split('?')[0] : undefined;

// Single connection pool shared by the whole app
const pool = mysql.createPool({
  uri,
  ssl: ca ? { ca, rejectUnauthorized: true } : { rejectUnauthorized: false },
  waitForConnections: true,
  connectionLimit: 10
});

export default pool;
