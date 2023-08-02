-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th8 02, 2023 lúc 12:19 PM
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
-- Cơ sở dữ liệu: `getgo_test`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `rates`
--

CREATE TABLE `rates` (
  `id` int(11) NOT NULL,
  `star` float DEFAULT NULL,
  `comment` text DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `trip_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `rates`
--

INSERT INTO `rates` (`id`, `star`, `comment`, `createdAt`, `updatedAt`, `trip_id`) VALUES
(1, 4, NULL, '2023-08-02 08:03:32', '2023-08-02 08:03:32', 1),
(2, 5, NULL, '2023-08-02 08:03:32', '2023-08-02 08:03:32', 2),
(3, 2, NULL, '2023-08-02 08:03:32', '2023-08-02 08:03:32', 3),
(4, 5, NULL, '2023-08-02 08:03:32', '2023-08-02 08:03:32', 4),
(5, 1, NULL, '2023-08-02 08:03:32', '2023-08-02 08:03:32', 5),
(6, 4, NULL, '2023-08-02 08:03:32', '2023-08-02 08:03:32', 6);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `settings`
--

CREATE TABLE `settings` (
  `id` int(11) NOT NULL,
  `auto_accept_trip` tinyint(1) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `trips`
--

CREATE TABLE `trips` (
  `id` int(11) NOT NULL,
  `status` enum('Pending','Waiting','Confirmed','Driving','Arrived','Done','Cancelled') DEFAULT NULL,
  `start` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`start`)),
  `end` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`end`)),
  `finished_date` datetime DEFAULT NULL,
  `price` decimal(10,0) DEFAULT NULL,
  `is_paid` tinyint(1) DEFAULT NULL,
  `paymentMethod` enum('Cash','Momo','IE') DEFAULT NULL,
  `is_scheduled` tinyint(1) DEFAULT NULL,
  `schedule_time` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `driver_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `trips`
--

INSERT INTO `trips` (`id`, `status`, `start`, `end`, `finished_date`, `price`, `is_paid`, `paymentMethod`, `is_scheduled`, `schedule_time`, `createdAt`, `updatedAt`, `user_id`, `driver_id`) VALUES
(1, 'Cancelled', '{\"lat\":10.1,\"lng\":10.2,\"place\":\"random places\"}', '{\"lat\":10.3,\"lng\":10.4,\"place\":\"2nd random places\"}', NULL, '50000', 0, 'Cash', 0, NULL, '2023-08-02 08:03:32', '2023-08-02 08:03:32', 4, 2),
(2, 'Done', '{\"lat\":10.1,\"lng\":10.2,\"place\":\"random places\"}', '{\"lat\":10.3,\"lng\":10.4,\"place\":\"2nd random places\"}', NULL, '50000', 0, 'Cash', 0, NULL, '2023-08-02 08:03:32', '2023-08-02 08:03:32', 4, 2),
(3, 'Cancelled', '{\"lat\":10.1,\"lng\":10.2,\"place\":\"random places\"}', '{\"lat\":10.3,\"lng\":10.4,\"place\":\"2nd random places\"}', NULL, '50000', 0, 'Cash', 0, NULL, '2023-08-02 08:03:32', '2023-08-02 08:03:32', 5, 2),
(4, 'Done', '{\"lat\":10.1,\"lng\":10.2,\"place\":\"random places\"}', '{\"lat\":10.3,\"lng\":10.4,\"place\":\"2nd random places\"}', NULL, '50000', 0, 'Cash', 0, NULL, '2023-08-02 08:03:32', '2023-08-02 08:03:32', 4, 3),
(5, 'Done', '{\"lat\":10.1,\"lng\":10.2,\"place\":\"random places\"}', '{\"lat\":10.3,\"lng\":10.4,\"place\":\"2nd random places\"}', NULL, '50000', 0, 'Cash', 0, NULL, '2023-08-02 08:03:32', '2023-08-02 08:03:32', 4, 3),
(6, 'Done', '{\"lat\":10.1,\"lng\":10.2,\"place\":\"random places\"}', '{\"lat\":10.3,\"lng\":10.4,\"place\":\"2nd random places\"}', NULL, '50000', 0, 'Cash', 0, NULL, '2023-08-02 08:03:32', '2023-08-02 08:03:32', 5, 3),
(7, 'Pending', '\"{\\\"name\\\":\\\"random places\\\",\\\"lat\\\":10.1,\\\"lng\\\":10.2}\"', '\"{\\\"name\\\":\\\"2nd random places\\\",\\\"lat\\\":10.3,\\\"lng\\\":10.4}\"', NULL, '50000', 0, NULL, 0, NULL, '2023-08-02 08:05:45', '2023-08-02 08:05:45', 3, NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `gender` enum('Male','Female') DEFAULT NULL,
  `birthday` datetime DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `type` enum('Admin','User','User_Vip','Driver','CallCenter') DEFAULT NULL,
  `active` tinyint(1) DEFAULT NULL,
  `accessToken` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `name`, `phone`, `email`, `password`, `gender`, `birthday`, `avatar`, `type`, `active`, `accessToken`, `createdAt`, `updatedAt`) VALUES
(1, 'Admin', '+84111111111', NULL, '$2a$10$Ficn2IbPjW2xSwbjIkkC0u6LmJNGCJmEAqT4Iuw0srI/GfXL/Aeee', NULL, NULL, NULL, 'Admin', NULL, NULL, '2023-08-02 08:03:32', '2023-08-02 08:03:32'),
(2, 'Driver', '+84222222222', NULL, '$2a$10$Ficn2IbPjW2xSwbjIkkC0u6LmJNGCJmEAqT4Iuw0srI/GfXL/Aeee', NULL, NULL, NULL, 'Driver', NULL, NULL, '2023-08-02 08:03:32', '2023-08-02 08:03:32'),
(3, 'Driver', '+84333333333', NULL, '$2a$10$Ficn2IbPjW2xSwbjIkkC0u6LmJNGCJmEAqT4Iuw0srI/GfXL/Aeee', NULL, NULL, NULL, 'Driver', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywicGhvbmUiOiIrODQzMzMzMzMzMzMiLCJ0eXBlIjoiRHJpdmVyIiwiaWF0IjoxNjkwOTYzNDM1LCJleHAiOjE2OTIwNDM0MzV9.sM7gAkx0Gl7043NJu3r97BqbvQD9tWdG3ZOoT2ZK-AE', '2023-08-02 08:03:32', '2023-08-02 08:03:55'),
(4, 'User_vip', '+84444444444', NULL, '$2a$10$Ficn2IbPjW2xSwbjIkkC0u6LmJNGCJmEAqT4Iuw0srI/GfXL/Aeee', NULL, NULL, NULL, 'User_Vip', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwicGhvbmUiOiIrODQ0NDQ0NDQ0NDQiLCJ0eXBlIjoiVXNlcl9WaXAiLCJpYXQiOjE2OTA5NjM0NzksImV4cCI6MTY5MjA0MzQ3OX0.o0kfUy4iiG5kyYoB3ea8URXpISHenDkopQdlKvwtNeU', '2023-08-02 08:03:32', '2023-08-02 08:04:39'),
(5, 'User', '+84555555555', NULL, '$2a$10$Ficn2IbPjW2xSwbjIkkC0u6LmJNGCJmEAqT4Iuw0srI/GfXL/Aeee', NULL, NULL, NULL, 'User', NULL, NULL, '2023-08-02 08:03:32', '2023-08-02 08:03:32'),
(6, 'CallCenter', '+84666666666', NULL, '$2a$10$Ficn2IbPjW2xSwbjIkkC0u6LmJNGCJmEAqT4Iuw0srI/GfXL/Aeee', NULL, NULL, NULL, 'CallCenter', NULL, NULL, '2023-08-02 08:03:32', '2023-08-02 08:03:32'),
(7, NULL, '+84321123321', NULL, '$2a$10$S9hD47Wi6MTcX0Wxe.6oveiSUNtedBB3f8iWgAcriHZ9mp6xJ91oS', NULL, NULL, NULL, 'User', 1, NULL, '2023-08-02 08:04:16', '2023-08-02 08:04:16');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `vehicles`
--

CREATE TABLE `vehicles` (
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
-- Đang đổ dữ liệu cho bảng `vehicles`
--

INSERT INTO `vehicles` (`id`, `driver_license`, `vehicle_registration`, `license_plate`, `name`, `description`, `createdAt`, `updatedAt`, `driver_id`, `vehicle_type_id`) VALUES
(1, '0964155097', '123456', '30D-206.32', 'Honda 4 Chỗ Vip', NULL, '2023-08-02 08:03:32', '2023-08-02 08:03:32', 2, 1),
(2, '0964155097', '123456', '30D-206.32', 'Honda 7 Chỗ Vip', NULL, '2023-08-02 08:03:32', '2023-08-02 08:03:32', 3, 2);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `vehicle_types`
--

CREATE TABLE `vehicle_types` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `vehicle_types`
--

INSERT INTO `vehicle_types` (`id`, `name`, `createdAt`, `updatedAt`) VALUES
(1, 'Xe 4 Chỗ', '2023-08-02 08:03:32', '2023-08-02 08:03:32'),
(2, 'Xe 7 Chỗ', '2023-08-02 08:03:32', '2023-08-02 08:03:32');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `rates`
--
ALTER TABLE `rates`
  ADD PRIMARY KEY (`id`),
  ADD KEY `trip_id` (`trip_id`);

--
-- Chỉ mục cho bảng `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `trips`
--
ALTER TABLE `trips`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `driver_id` (`driver_id`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `vehicles`
--
ALTER TABLE `vehicles`
  ADD PRIMARY KEY (`id`),
  ADD KEY `driver_id` (`driver_id`),
  ADD KEY `vehicle_type_id` (`vehicle_type_id`);

--
-- Chỉ mục cho bảng `vehicle_types`
--
ALTER TABLE `vehicle_types`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `rates`
--
ALTER TABLE `rates`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT cho bảng `settings`
--
ALTER TABLE `settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `trips`
--
ALTER TABLE `trips`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT cho bảng `vehicles`
--
ALTER TABLE `vehicles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `vehicle_types`
--
ALTER TABLE `vehicle_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `rates`
--
ALTER TABLE `rates`
  ADD CONSTRAINT `rates_ibfk_1` FOREIGN KEY (`trip_id`) REFERENCES `trips` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `settings`
--
ALTER TABLE `settings`
  ADD CONSTRAINT `settings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `trips`
--
ALTER TABLE `trips`
  ADD CONSTRAINT `trips_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `trips_ibfk_2` FOREIGN KEY (`driver_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `vehicles`
--
ALTER TABLE `vehicles`
  ADD CONSTRAINT `vehicles_ibfk_1` FOREIGN KEY (`driver_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `vehicles_ibfk_2` FOREIGN KEY (`vehicle_type_id`) REFERENCES `vehicle_types` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
