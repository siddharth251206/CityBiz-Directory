-- Create database
CREATE DATABASE IF NOT EXISTS citybiz;
USE citybiz;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('owner', 'viewer', 'admin') DEFAULT 'viewer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Businesses table
CREATE TABLE IF NOT EXISTS businesses (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  image TEXT,
  phone VARCHAR(20),
  email VARCHAR(255),
  category VARCHAR(100),
  rating DECIMAL(2, 1) DEFAULT 3.0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (category),
  INDEX idx_rating (rating)
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id INT PRIMARY KEY AUTO_INCREMENT,
  business_id INT NOT NULL,
  user_id INT NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_business_id (business_id),
  INDEX idx_user_id (user_id)
);

-- Insert seed data for businesses
INSERT INTO businesses (name, description, image, phone, email, category, rating) VALUES
('Amruth Café', 'Amruth Café is a cozy retreat for coffee lovers and food enthusiasts. Our expertly brewed South Indian filter coffee and artisanal espresso-based drinks are complemented by a selection of fresh-baked pastries and light bites.', 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/12/63/d1/7d/cc-adajan.jpg?w=600&h=-1&s=1', '+91 98765 43210', 'contact@amruthcafe.in', 'Food & Drink', 4.3),
('Chai Junction', 'Tea lovers rejoice! Chai Junction offers a curated selection of over 50 tea blends, including classic masala chai, soothing green teas, and experimental fusion flavors.', 'https://usmenuguide.com/wp-content/uploads/2019/11/indiacafelasvegasdiningroom1.jpg', '+91 99887 65432', 'info@chaijunction.com', 'Food & Drink', 3.8),
('Future Tech Gadgets', 'At Future Tech Gadgets, we bring you the latest innovations in technology. From smart home devices and wearables to cutting-edge gaming peripherals.', 'https://kreowebsite.s3.ap-south-1.amazonaws.com/Banner.jpg50579', '+91 99876 54321', 'hello@futuretech.in', 'Tech & Gadgets', 3.9),
('Royal Bakers', 'Royal Bakers has been serving freshly baked delights for over a decade. Our bakery specializes in handcrafted cakes, artisanal breads, and a wide range of cookies and pastries.', 'https://scontent.fstv8-3.fna.fbcdn.net/v/t39.30808-6/307019492_160511253281218_3741692931884850186_n.jpg', '+91 98765 21098', 'royalbakers@gmail.com', 'Retail', 3.6);
