-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th8 25, 2023 lúc 06:11 AM
-- Phiên bản máy phục vụ: 10.4.27-MariaDB
-- Phiên bản PHP: 8.0.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `msv_getgo_user`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `Conversations`
--

CREATE TABLE IF NOT EXISTS `Conversations` (
  `id` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `driver_id` int(11) DEFAULT NULL,
  `trip_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `Messages`
--

CREATE TABLE IF NOT EXISTS `Messages` (
  `id` int(11) NOT NULL,
  `message` text DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `conversation_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `Settings`
--

CREATE TABLE IF NOT EXISTS `Settings` (
  `id` int(11) NOT NULL,
  `auto_accept_trip` tinyint(1) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `Trips`
--
--
-- Đang đổ dữ liệu cho bảng `Trips`
--

--
-- Cấu trúc bảng cho bảng `Users`
--

CREATE TABLE IF NOT EXISTS `Users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `gender` enum('Male','Female') DEFAULT NULL,
  `birthday` datetime DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `type` enum('Admin','User','User_Vip','Driver','CallCenterS1','CallCenterS2','CallCenterS3') DEFAULT NULL,
  `active` tinyint(1) DEFAULT NULL,
  `accessToken` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `token_fcm` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `Users`
--

INSERT INTO `Users` (`id`, `name`, `phone`, `email`, `password`, `gender`, `birthday`, `avatar`, `type`, `active`, `accessToken`, `createdAt`, `updatedAt`) VALUES
(1, 'Admin', '+84111111111', NULL, '$2a$10$Ficn2IbPjW2xSwbjIkkC0u6LmJNGCJmEAqT4Iuw0srI/GfXL/Aeee', NULL, NULL, 'https://picsum.photos/200/300', 'Admin', NULL, NULL, '2023-08-11 09:44:46', '2023-08-11 09:44:46'),
(2, 'Driver', '+84222222222', NULL, '$2a$10$Ficn2IbPjW2xSwbjIkkC0u6LmJNGCJmEAqT4Iuw0srI/GfXL/Aeee', NULL, NULL, 'https://picsum.photos/200/300', 'Driver', NULL, NULL, '2023-08-11 09:44:46', '2023-08-11 09:44:46'),
(3, 'Driver', '+84333333333', NULL, '$2a$10$Ficn2IbPjW2xSwbjIkkC0u6LmJNGCJmEAqT4Iuw0srI/GfXL/Aeee', NULL, NULL, 'https://picsum.photos/200/300', 'Driver', NULL, NULL, '2023-08-11 09:44:46', '2023-08-11 09:44:46'),
(4, 'User_vip', '+84444444444', NULL, '$2a$10$Ficn2IbPjW2xSwbjIkkC0u6LmJNGCJmEAqT4Iuw0srI/GfXL/Aeee', NULL, NULL, 'https://picsum.photos/200/300', 'User_Vip', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwicGhvbmUiOiIrODQ0NDQ0NDQ0NDQiLCJ0eXBlIjoiVXNlcl9WaXAiLCJpYXQiOjE2OTIxODM1NzUsImV4cCI6MTY5MzI2MzU3NX0.5uonl_EPt52dMZRKNxvrJ9aUFHedzl-vT2Nb29p_TKw', '2023-08-11 09:44:46', '2023-08-16 10:59:35'),
(5, 'User', '+84555555555', NULL, '$2a$10$Ficn2IbPjW2xSwbjIkkC0u6LmJNGCJmEAqT4Iuw0srI/GfXL/Aeee', NULL, NULL, 'https://picsum.photos/200/300', 'User', NULL, NULL, '2023-08-11 09:44:46', '2023-08-11 09:44:46'),
(6, 'CallCenterS1', '+84666666666', NULL, '$2a$10$Ficn2IbPjW2xSwbjIkkC0u6LmJNGCJmEAqT4Iuw0srI/GfXL/Aeee', NULL, NULL, 'https://picsum.photos/200/300', 'CallCenterS1', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwicGhvbmUiOiIrODQ2NjY2NjY2NjYiLCJ0eXBlIjoiQ2FsbENlbnRlclMxIiwiaWF0IjoxNjkyMTgzNTY2LCJleHAiOjE2OTMyNjM1NjZ9.i01bmSAiMRC6RFYlFqgTybCK6oFaUwSfU2BAXf7uUo8', '2023-08-11 09:44:46', '2023-08-16 10:59:26'),
(7, 'CallCenterS2', '+84777777777', NULL, '$2a$10$Ficn2IbPjW2xSwbjIkkC0u6LmJNGCJmEAqT4Iuw0srI/GfXL/Aeee', NULL, NULL, 'https://picsum.photos/200/300', 'CallCenterS2', NULL, NULL, '2023-08-11 09:44:46', '2023-08-11 09:44:46'),
(8, 'CallCenterS3', '+84888888888', NULL, '$2a$10$Ficn2IbPjW2xSwbjIkkC0u6LmJNGCJmEAqT4Iuw0srI/GfXL/Aeee', NULL, NULL, 'https://picsum.photos/200/300', 'CallCenterS3', NULL, NULL, '2023-08-11 09:44:46', '2023-08-11 09:44:46'),
(9, 'Doan Huu Loc', '+84941544569', 'lapdoan.010102@gmail.com', '$2a$10$Ficn2IbPjW2xSwbjIkkC0u6LmJNGCJmEAqT4Iuw0srI/GfXL/Aeee', 'Male', NULL, 'https://picsum.photos/200/300', 'Driver', NULL, NULL, '2023-08-09 16:14:48', '2023-08-09 16:14:48'),
(10, 'Nguyen Dang Manh Tu', '+84974220702', 'manhtu22702@gmail.com', '$2a$10$Ficn2IbPjW2xSwbjIkkC0u6LmJNGCJmEAqT4Iuw0srI/GfXL/Aeee', 'Male', NULL, 'https://picsum.photos/200/300', 'User_Vip', NULL, NULL, '2023-08-09 16:14:48', '2023-08-09 16:14:48'),
(11, 'Le Nguyen Lan Vy', '+84777063550', 'lanvy@gmail.com', '$2a$10$Ficn2IbPjW2xSwbjIkkC0u6LmJNGCJmEAqT4Iuw0srI/GfXL/Aeee', 'Female', NULL, 'https://picsum.photos/200/300', '', NULL, NULL, '2023-08-09 16:14:48', '2023-08-09 16:14:48'),
(12, 'Tang Kim Long', '+84974649123', 'kimlong@gmail.com', '$2a$10$Ficn2IbPjW2xSwbjIkkC0u6LmJNGCJmEAqT4Iuw0srI/GfXL/Aeee', 'Male', NULL, 'https://picsum.photos/200/300', 'User', NULL, NULL, '2023-08-09 16:14:48', '2023-08-09 16:14:48');

-- --------------------------------------------------------


CREATE TABLE IF NOT EXISTS `Vehicle_Types` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `Vehicle_Types`
--

INSERT INTO `Vehicle_Types` (`id`, `name`, `createdAt`, `updatedAt`) VALUES
(1, 'Xe 4 Chỗ', '2023-08-11 09:44:46', '2023-08-11 09:44:46'),
(2, 'Xe 7 Chỗ', '2023-08-11 09:44:46', '2023-08-11 09:44:46');


--
-- Cấu trúc bảng cho bảng `Vehicles`
--

CREATE TABLE IF NOT EXISTS `Vehicles` (
  `id` int(11) NOT NULL,
  `driver_license` varchar(255) DEFAULT NULL,
  `vehicle_registration` varchar(255) DEFAULT NULL,
  `license_plate` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `driver_id` int(11) DEFAULT NULL,
  `vehicle_type_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `Vehicles`
--

INSERT INTO `Vehicles` (`id`, `driver_license`, `vehicle_registration`, `license_plate`, `name`, `description`, `createdAt`, `updatedAt`, `driver_id`, `vehicle_type_id`) VALUES
(1, '0964155097', '123456', '30D-206.32', 'Honda 4 Chỗ Vip', NULL, '2023-08-11 09:44:46', '2023-08-11 09:44:46', 2, 1),
(2, '0964155097', '123456', '30D-206.32', 'Honda 7 Chỗ Vip', NULL, '2023-08-11 09:44:46', '2023-08-11 09:44:46', 3, 2),
(3, '0964155097', '123456', '30D-206.32', 'Honda 4 Chỗ Vip', NULL, '2023-08-11 09:44:46', '2023-08-11 09:44:46', 9, 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `Vehicle_Types`
--

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `Conversations`
--
ALTER TABLE `Conversations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `driver_id` (`driver_id`);

--
-- Chỉ mục cho bảng `Messages`
--
ALTER TABLE `Messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `conversation_id` (`conversation_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `Rates`
--

--
-- Chỉ mục cho bảng `Settings`
--
ALTER TABLE `Settings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `Trips`
--


--
-- Chỉ mục cho bảng `Users`
--
ALTER TABLE `Users`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `Vehicles`
--
ALTER TABLE `Vehicles`
  ADD PRIMARY KEY (`id`),
  ADD KEY `driver_id` (`driver_id`),
  ADD KEY `vehicle_type_id` (`vehicle_type_id`);

--
-- Chỉ mục cho bảng `Vehicle_Types`
--
ALTER TABLE `Vehicle_Types`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `Conversations`
--
ALTER TABLE `Conversations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `Messages`
--
ALTER TABLE `Messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `Rates`
--
--
-- AUTO_INCREMENT cho bảng `Settings`
--
ALTER TABLE `Settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `Trips`
--
--
-- AUTO_INCREMENT cho bảng `Users`
--
ALTER TABLE `Users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT cho bảng `Vehicles`
--
ALTER TABLE `Vehicles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `Vehicle_Types`
--
ALTER TABLE `Vehicle_Types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `Conversations`
--
ALTER TABLE `Conversations`
  ADD CONSTRAINT `Conversations_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `Conversations_ibfk_2` FOREIGN KEY (`driver_id`) REFERENCES `Users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
  

--
-- Các ràng buộc cho bảng `Messages`
--
ALTER TABLE `Messages`
  ADD CONSTRAINT `Messages_ibfk_1` FOREIGN KEY (`conversation_id`) REFERENCES `Conversations` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `Messages_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `Rates`
--

--
-- Các ràng buộc cho bảng `Settings`
--
ALTER TABLE `Settings`
  ADD CONSTRAINT `Settings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `Trips`
--

--
-- Các ràng buộc cho bảng `Vehicles`
--
ALTER TABLE `Vehicles`
  ADD CONSTRAINT `Vehicles_ibfk_1` FOREIGN KEY (`driver_id`) REFERENCES `Users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `Vehicles_ibfk_2` FOREIGN KEY (`vehicle_type_id`) REFERENCES `Vehicle_Types` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
