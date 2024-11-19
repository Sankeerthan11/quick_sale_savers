-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: db
-- Generation Time: Nov 19, 2024 at 12:38 AM
-- Server version: 8.2.0
-- PHP Version: 8.2.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sd2-db`
--

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `product_id` int NOT NULL,
  `retailer_id` int NOT NULL,
  `product_name` varchar(255) DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `original_price` decimal(10,2) DEFAULT NULL,
  `discount_price` decimal(10,2) DEFAULT NULL,
  `expiration_date` date DEFAULT NULL,
  `quantity` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`product_id`, `retailer_id`, `product_name`, `category`, `original_price`, `discount_price`, `expiration_date`, `quantity`) VALUES
(1, 1, 'Organic Apple', 'Fruits', 3.50, 2.80, '2024-11-22', 100),
(2, 1, 'Almond Milk', 'Dairy & Alternatives', 2.99, 2.39, '2024-11-20', 50),
(3, 2, 'Whole Wheat Bread', 'Bakery', 1.99, 1.49, '2024-11-18', 75),
(4, 2, 'Organic Carrots', 'Vegetables', 2.49, 1.99, '2024-11-19', 60),
(5, 3, 'Greek Yogurt', 'Dairy & Alternatives', 4.50, 3.60, '2024-11-25', 30),
(6, 3, 'Canned Tomatoes', 'Canned Goods', 1.79, 1.29, '2024-11-21', 120),
(7, 4, 'Frozen Peas', 'Frozen Foods', 3.20, 2.40, '2024-11-23', 90),
(8, 4, 'Spaghetti Pasta', 'Dry Goods', 2.00, 1.60, '2024-11-24', 150),
(9, 5, 'Cheddar Cheese', 'Dairy & Alternatives', 5.00, 3.75, '2024-11-19', 40),
(10, 5, 'Organic Milk', 'Dairy & Alternatives', 3.80, 3.00, '2024-11-22', 80);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`product_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
