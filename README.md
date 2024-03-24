# Booking Website - Backend

This repository contains the backend code for a booking website, built using Node.js and PostgreSQL.

## Setup

Clone the repository and install dependencies:

```
npm install
```

Create a `.env` file in the project root directory and add the following environment variables:

```
SECRET_KEY=your-secret-key
CONNECTION_STRING=postgresql://username:password@hostname:5432/database-name
```

Start the application:

```
npm start
```

## Entity Relationship Diagram (ERD)

The ERD for the backend booking website is as follows:

![ERD Image](ERD.png)

## Table Creation SQL

Create the necessary tables in your PostgreSQL database using the following SQL commands:

```
CREATE TABLE users (
  user_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  phone VARCHAR(10) NOT NULL,
  password VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  last_logged_in TIMESTAMPTZ NOT NULL
);

CREATE TABLE booking (
  booking_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  phone VARCHAR(10) NOT NULL,
  check_in_date TIMESTAMPTZ NOT NULL,
  check_out_date TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL
);
```
