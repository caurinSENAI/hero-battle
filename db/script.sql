CREATE DATABASE exercback;

\c exercback;

CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  sobrenome VARCHAR(255) NOT NULL,
  data DATE NOT NULL,
  email VARCHAR(255) NOT NULL,
  idade INT,
  signo VARCHAR(100)
);