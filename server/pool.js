import pg from 'pg';

const connectDatabase = () => {
  return new pg.Pool({
    user: process.env.USER,
    password: process.env.PASS,
    database: process.env.DATABASE, 
    host: process.env.HOST,
  });
};

export { connectDatabase };
