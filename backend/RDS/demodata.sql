-- Insert sample announcements
INSERT INTO announcements (title, message, type, issued_by, valid_from, valid_until) VALUES
('Monsoon Flood Advisory', 'Heavy rainfall is expected in Delhi and NCR from Sep 28. Avoid low-lying flood-prone zones and monitor official alerts.', 'Safety', 'Delhi Disaster Management Authority', '2025-09-27 09:00:00', '2025-09-29 20:00:00'),
('Earthquake Safety Drill', 'A citywide earthquake safety drill will be conducted in Central Delhi on September 30. Please cooperate with authorities.', 'Advisory', 'Delhi District Magistrate', '2025-09-29 10:00:00', '2025-09-30 18:00:00'),
('Heatwave Alert', 'Temperatures have crossed 45°C in parts of North India. Avoid outdoor exposure, stay hydrated, and check on vulnerable persons.', 'Safety', 'Indian Meteorological Department', '2025-06-01 08:00:00', '2025-06-15 20:00:00');

-- Insert sample tourists
INSERT INTO tourists (tourist_id, password, name, phone, email, emergency_contact, date_of_birth, address, last_stayed_lat, last_stayed_lon)
VALUES
('T001', MD5('password123'), 'Ayush Singh', '+919876543210', 'ayush.singh@email.com', '+919876543200', '1990-05-15', 'KIET college, Ghaziabad, Lucknow', 28.7524404, 77.4987640),
('T002', MD5('password123'), 'Shourya Ojha', '+919876543211', 'shourya.ojha@email.com', '+919876543201', '1985-08-22', 'KIET college, Ghaziabad, Lucknow', 28.7524404, 77.4987640),
('T003', MD5('password123'), 'Sumit Kumar', '+919876543212', 'sumit.kumat@email.com', '+919876543202', '1992-12-10', 'KIET college, Ghaziabad, Lucknow', 28.7524404, 77.4987640);

-- Insert sample police stations
INSERT INTO police_stations (name, address, phone, latitude, longitude, district, state, created_at) VALUES
('Daryaganj Police Station', 'First floor, 3490, Netaji Subhash Marg, Kucha Lal Man, Daryaganj, New Delhi, Delhi, 110002', '011-23263240', 28.644345, 77.241952, 'Central', 'Delhi', '2025-09-09 10:35:00'),
('Rohini North Police Station', 'Police Station Rohini North, Shiva Road, Sector 7, Rohini, New Delhi, Delhi 110085', '011-27579001', 28.708700, 77.117900, 'Rohini', 'Delhi', '2025-09-09 10:35:00'),
('Civil Lines Police Station', 'No 33, Rajpur Road, Civil Lines, New Delhi, Delhi, 110054', '011-23810833', 28.670000, 77.220000, 'Central', 'Delhi', '2025-09-09 10:35:00'),
('Karol Bagh Police Station', '2682/1, Ajmal Khan Rd, Block 46, Beadonpura, Karol Bagh, New Delhi, Delhi, 110005', '011-28721115', 28.650000, 77.190000, 'Central', 'Delhi', '2025-09-09 10:35:00'),
('I.P. Estate Police Station', 'Indraprastha Estate Police Station, Ring Road, Indraprastha Estate, New Delhi, Delhi, 110002', '011-23378474', 28.630000, 77.240000, 'Central', 'Delhi', '2025-09-09 10:35:00'),
('Hari Nagar Police Station', 'Hari Nagar, New Delhi, Delhi', '875-887-1128', 28.620000, 77.100000, 'West', 'Delhi', '2025-09-09 10:35:00'),
('Rajouri Garden Police Station', 'Rajouri Garden, New Delhi, Delhi', '875-887-1127', 28.650000, 77.120000, 'West', 'Delhi', '2025-09-09 10:35:00'),
('Burari Police Station', '403-404, Sant Nagar Marg, Sant Nagar Extension, West Sant Nagar, Burari, New Delhi, Delhi, 110084', '011-27616845', 28.750000, 77.200000, 'North', 'Delhi', '2025-09-09 10:35:00'),
('Janak Puri Police Station', 'Janak Puri, New Delhi, Delhi', '875-887-1129', 28.620000, 77.080000, 'West', 'Delhi', '2025-09-09 10:35:00'),
('Indra Puri Police Station', 'Indra Puri, New Delhi, Delhi', '875-887-1123', 28.630000, 77.150000, 'West', 'Delhi', '2025-09-09 10:35:00'),
('Muradnagar Police Station', 'Defence Colony, Old Factory Road, Muradnagar, Uttar Pradesh, 201206', '0120-2782222', 28.771646, 77.507561, 'Ghaziabad', 'Uttar Pradesh', '2025-09-09 10:35:00');

-- Insert sample hospitals
INSERT INTO hospitals (name, address, phone, type, latitude, longitude, district, state, created_at) VALUES
('AIIMS', 'AIIMS Campus, Ansari Nagar East, New Delhi, Delhi 110029', '+91-11-26864851', 'Government Hospital', 28.566808, 77.208112, 'Central', 'Delhi', '2025-09-09 12:09:00'),
('Sir Ganga Ram Hospital', 'Old Rajender Nagar, Rajender Nagar, New Delhi, Delhi 110060', '+91-11-25712389', 'Private Hospital', 28.638100, 77.189300, 'Central', 'Delhi', '2025-09-09 12:09:00'),
('Indraprastha Apollo Hospital', 'Mathura Road, Sarita Vihar, Jasola Vihar, New Delhi, Delhi 110076', '+91-11-26925858', 'Private Hospital', 28.541300, 77.283400, 'South East', 'Delhi', '2025-09-09 12:09:00'),
('Max Medcentre', 'N-110, Panchsheel Park, New Delhi, Delhi 110017', '+91-11-27158844', 'Private Hospital', 28.689985, 77.358067, 'South', 'Delhi', '2025-09-09 12:09:00'),
('Safdarjung Hospital', 'Ring Road, Safdarjung Enclave, New Delhi, Delhi 110029', '+91-11-26174144', 'Government Hospital', 28.570000, 77.210000, 'South West', 'Delhi', '2025-09-09 12:09:00'),
('Ram Manohar Lohia Hospital', 'Baba Kharak Singh Marg, Central Secretariat, New Delhi, Delhi 110001', '+91-11-23365525', 'Government Hospital', 28.620000, 77.200000, 'Central', 'Delhi', '2025-09-09 12:09:00'),
('G. B. Pant Hospital', 'JLN Marg, Delhi Gate, New Delhi, Delhi 110002', '+91-11-23234242', 'Government Hospital', 28.640000, 77.230000, 'Central', 'Delhi', '2025-09-09 12:09:00'),
('Holy Family Hospital', 'Okhla Road, New Delhi, Delhi 110025', '+91-11-26845900', 'Private Hospital', 28.550000, 77.270000, 'South East', 'Delhi', '2025-09-09 12:09:00'),
('Escorts Heart Institute', 'Okhla Road, Okhla Phase II, New Delhi, Delhi 110020', '+91-11-26825000', 'Private Hospital', 28.530000, 77.280000, 'South East', 'Delhi', '2025-09-09 12:09:00'),
('Rajiv Gandhi Cancer Institute', 'Sector 5, Rohini, New Delhi, Delhi 110085', '+91-11-27051011', 'Specialty Hospital', 28.720000, 77.100000, 'North West', 'Delhi', '2025-09-09 12:09:00'),
('Shree Kanha Hospital', 'NH-58, Delhi-Meerut Expy, opposite pillar no 596, Bhim Nagar, Nai Basti Dundahera, Muradnagar, Ghaziabad, Uttar Pradesh 201206', '02048562555', 'General Medicine Hospital', 28.771646, 77.507561, 'Ghaziabad', 'Uttar Pradesh', '2025-09-09 12:09:00'),
('Nivok Superspeciality Hospital', 'Defence Colony, Old Factory Road, Muradnagar, Ghaziabad, Uttar Pradesh 201206', '0120-2782400', 'Multi Specialty Hospital', 28.771646, 77.507561, 'Ghaziabad', 'Uttar Pradesh', '2025-09-09 12:09:00');

-- Insert sample risk zones
INSERT INTO risk_zones (zone_name, description, risk_score, latitude, longitude, radius_km, created_at, updated_at) VALUES
('Central Delhi Seismic Zone', 'High seismic risk zone near Delhi fault line with potential for moderate to severe earthquakes', 8.5, 28.644345, 77.241952, 15.0, '2025-09-09 12:12:00', '2025-09-09 12:12:00'),
('Yamuna Flood Plain', 'High flood risk area along Yamuna river affecting multiple districts', 9.0, 28.650000, 77.280000, 25.0, '2025-09-09 12:12:00', '2025-09-09 12:12:00'),
('Mukarba Chowk Traffic Risk Zone', 'High-risk traffic accident zone with frequent road incidents and congestion', 7.5, 28.735444, 77.155806, 2.0, '2025-09-09 12:12:00', '2025-09-09 12:12:00'),
('Industrial Area Najafgarh', 'Industrial pollution and chemical hazard risk zone', 6.8, 28.610000, 76.980000, 8.0, '2025-09-09 12:12:00', '2025-09-09 12:12:00'),
('Old Delhi Fire Risk Zone', 'Dense residential area with high fire hazard due to narrow lanes and old infrastructure', 7.2, 28.656200, 77.241000, 5.0, '2025-09-09 12:12:00', '2025-09-09 12:12:00'),
('Rohini Seismic Risk Zone', 'Moderate seismic risk area in North Delhi near active fault lines', 6.5, 28.720000, 77.100000, 12.0, '2025-09-09 12:12:00', '2025-09-09 12:12:00'),
('Okhla Industrial Area', 'High pollution and industrial accident risk zone', 7.0, 28.530000, 77.280000, 6.0, '2025-09-09 12:12:00', '2025-09-09 12:12:00'),
('Sohna Fault Risk Zone', 'High seismic risk zone along Sohna fault line affecting South Delhi and Gurgaon', 8.0, 28.450000, 77.150000, 18.0, '2025-09-09 12:12:00', '2025-09-09 12:12:00'),
('Muradnagar Industrial Risk Zone', 'Industrial pollution and chemical hazard risk area near factories and NH-58', 6.5, 28.770375, 77.498875, 4.0, '2025-09-09 12:12:00', '2025-09-09 12:12:00'),
('Muradnagar Traffic Accident Zone', 'High-risk traffic zone along Delhi-Meerut Expressway with frequent accidents', 7.8, 28.771646, 77.507561, 3.0, '2025-09-09 12:12:00', '2025-09-09 12:12:00'),
('Muradnagar Flood Risk Zone', 'Seasonal flood risk area near drainage channels and low-lying areas', 6.2, 28.768000, 77.495000, 5.0, '2025-09-09 12:12:00', '2025-09-09 12:12:00');

