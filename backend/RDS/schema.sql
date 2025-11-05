-- Announcements Table
DROP TABLE IF EXISTS announcements;
CREATE TABLE announcements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50),
    issued_by VARCHAR(150),
    valid_from DATETIME,
    valid_until DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tourists Table
DROP TABLE IF EXISTS tourists;
CREATE TABLE tourists (
  tourist_id VARCHAR(20) NOT NULL PRIMARY KEY,
  password VARCHAR(64) NOT NULL,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(100),
  emergency_contact VARCHAR(20),
  date_of_birth DATE,
  address TEXT,
  last_stayed_lat DOUBLE,
  last_stayed_lon DOUBLE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Police Stations Table
DROP TABLE IF EXISTS police_stations;
CREATE TABLE police_stations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    address TEXT NOT NULL,
    phone VARCHAR(30),
    latitude DECIMAL(10,6),
    longitude DECIMAL(10,6),
    district VARCHAR(100),
    state VARCHAR(100),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Hospitals Table
DROP TABLE IF EXISTS hospitals;
CREATE TABLE hospitals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    address TEXT NOT NULL,
    phone VARCHAR(30),
    type VARCHAR(100),
    latitude DECIMAL(10,6),
    longitude DECIMAL(10,6),
    district VARCHAR(100),
    state VARCHAR(100),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Risk Zones Table
DROP TABLE IF EXISTS risk_zones;
CREATE TABLE risk_zones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    zone_name VARCHAR(150) NOT NULL,
    description TEXT,
    risk_score DECIMAL(3,1) NOT NULL,
    latitude DECIMAL(10,6),
    longitude DECIMAL(10,6),
    radius_km DECIMAL(5,2),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

