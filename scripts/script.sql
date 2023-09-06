-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th9 05, 2023 lúc 03:02 PM
-- Phiên bản máy phục vụ: 10.4.14-MariaDB
-- Phiên bản PHP: 7.3.21

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `getgo`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `conversations`
--
DROP TABLE IF EXISTS `conversations`
CREATE TABLE `conversations` (
  `id` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `driver_id` int(11) DEFAULT NULL,
  `trip_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `messages`
--
DROP TABLE IF EXISTS `messages`
CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `message` text DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `conversation_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `rates`
--
DROP TABLE IF EXISTS `rates`
CREATE TABLE `rates` (
  `id` int(11) NOT NULL,
  `star` float DEFAULT NULL,
  `comment` text DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `trip_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Đang đổ dữ liệu cho bảng `rates`
--

INSERT INTO `rates` (`id`, `star`, `comment`, `createdAt`, `updatedAt`, `trip_id`) VALUES
(1, 4, NULL, '2023-08-11 09:44:46', '2023-08-11 09:44:46', NULL),
(2, 5, NULL, '2023-08-11 09:44:46', '2023-08-11 09:44:46', 2),
(3, 2, NULL, '2023-08-11 09:44:46', '2023-08-11 09:44:46', 3),
(4, 5, NULL, '2023-08-11 09:44:46', '2023-08-11 09:44:46', 4),
(5, 1, NULL, '2023-08-11 09:44:46', '2023-08-11 09:44:46', 5),
(6, 4, NULL, '2023-08-11 09:44:46', '2023-08-11 09:44:46', 6);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `settings`
--
DROP TABLE IF EXISTS `settings`
CREATE TABLE `settings` (
  `id` int(11) NOT NULL,
  `auto_accept_trip` tinyint(1) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `trips`
--
DROP TABLE IF EXISTS `trips`
CREATE TABLE `trips` (
  `id` int(11) NOT NULL,
  `status` enum('Callcenter','Pending','Waiting','Confirmed','Driving','Arrived','Done','Cancelled') DEFAULT NULL,
  `start` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`start`)),
  `end` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`end`)),
  `finished_date` datetime DEFAULT NULL,
  `type` int(11) DEFAULT NULL,
  `note` text DEFAULT NULL,
  `price` decimal(10,0) DEFAULT NULL,
  `is_paid` tinyint(1) DEFAULT NULL,
  `paymentMethod` enum('Cash','Momo','IE') DEFAULT NULL,
  `is_scheduled` tinyint(1) DEFAULT NULL,
  `schedule_time` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `driver_id` int(11) DEFAULT NULL,
  `is_callcenter` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Đang đổ dữ liệu cho bảng `trips`
--

INSERT INTO `trips` (`id`, `status`, `start`, `end`, `finished_date`, `type`, `note`, `price`, `is_paid`, `paymentMethod`, `is_scheduled`, `schedule_time`, `createdAt`, `updatedAt`, `user_id`, `driver_id`, `is_callcenter`) VALUES
(2, 'Done', '{\"lat\":10.1,\"lng\":10.2,\"place\":\"random places\"}', '{\"lat\":10.3,\"lng\":10.4,\"place\":\"2nd random places\"}', NULL, NULL, NULL, '50000', 0, 'Cash', 0, NULL, '2023-08-11 09:44:46', '2023-08-11 09:44:46', 4, 2, NULL),
(3, 'Cancelled', '{\"lat\":10.1,\"lng\":10.2,\"place\":\"random places\"}', '{\"lat\":10.3,\"lng\":10.4,\"place\":\"2nd random places\"}', NULL, NULL, NULL, '50000', 0, 'Cash', 0, NULL, '2023-08-11 09:44:46', '2023-08-11 09:44:46', 5, 2, NULL),
(4, 'Done', '{\"lat\":10.1,\"lng\":10.2,\"place\":\"random places\"}', '{\"lat\":10.3,\"lng\":10.4,\"place\":\"2nd random places\"}', NULL, NULL, NULL, '50000', 0, 'Cash', 0, NULL, '2023-08-11 09:44:46', '2023-08-11 09:44:46', 4, 3, NULL),
(5, 'Done', '{\"lat\":10.1,\"lng\":10.2,\"place\":\"random places\"}', '{\"lat\":10.3,\"lng\":10.4,\"place\":\"2nd random places\"}', NULL, NULL, NULL, '50000', 0, 'Cash', 0, NULL, '2023-08-11 09:44:46', '2023-08-11 09:44:46', 4, 3, 1),
(6, 'Done', '{\"lat\":10.1,\"lng\":10.2,\"place\":\"random places\"}', '{\"lat\":10.3,\"lng\":10.4,\"place\":\"2nd random places\"}', NULL, NULL, NULL, '50000', 0, 'Cash', 0, NULL, '2023-08-11 09:44:46', '2023-08-11 09:44:46', 5, 3, NULL),
(7, 'Done', '{\"place\":\"2 Nguyễn Bỉnh Khiêm, Quận 1, Thành phố Hồ Chí Minh, Việt Nam\",\"lat\":10.7877783,\"lng\":106.705055}', '{\"name\":\"Quận 1, Ho Chi Minh City, Vietnam\",\"lat\":10.7756587,\"lng\":106.7004238}', NULL, NULL, NULL, '50000', 0, NULL, 0, NULL, '2023-08-11 09:45:30', '2023-08-11 09:45:30', 10, 9, NULL),
(8, 'Done', '{\"place\":\"History Museum of Ho Chi Minh City, 2 Nguyễn Bỉnh Khiêm, Bến Nghé, Quận 1, Thành phố Hồ Chí Minh, Vietnam\",\"lat\":10.787984,\"lng\":106.7047376}', '{\"place\":\"Quận 7, Ho Chi Minh City, Vietnam\",\"lat\":10.7340344,\"lng\":106.7215787}', NULL, NULL, NULL, '50000', 0, NULL, 0, NULL, '2023-08-11 09:45:30', '2023-08-11 09:45:30', 10, 9, NULL),
(9, 'Done', '{\"place\":\"58B, Quận 3, Thành phố Hồ Chí Minh, Việt Nam\",\"lat\":10.7843683,\"lng\":106.6844083}', '{\"place\":\"Quán 1...2...3...DZÔ | Quán nhậu ngon quận 8, Đường Cao Lỗ, Phường 4, District 8, Ho Chi Minh City, Vietnam\",\"lat\":10.743322,\"lng\":106.6764163}', NULL, NULL, NULL, '50000', 0, NULL, 0, NULL, '2023-08-11 09:45:30', '2023-08-11 09:45:30', 10, 9, NULL),
(10, 'Done', '{\"place\":\"History Museum of Ho Chi Minh City, 2 Nguyễn Bỉnh Khiêm, Bến Nghé, Quận 1, Thành phố Hồ Chí Minh, Vietnam\",\"lat\":10.787984,\"lng\":106.7047376}', '{\"place\":\"Quận 7, Ho Chi Minh City, Vietnam\",\"lat\":10.7340344,\"lng\":106.7215787}', NULL, NULL, NULL, '50000', 0, NULL, 0, NULL, '2023-08-11 09:45:30', '2023-08-11 09:45:30', 12, 9, NULL),
(11, 'Done', '{\"place\":\"58B, Quận 3, Thành phố Hồ Chí Minh, Việt Nam\",\"lat\":10.7843683,\"lng\":106.6844083}', '{\"place\":\"Quán 1...2...3...DZÔ | Quán nhậu ngon quận 8, Đường Cao Lỗ, Phường 4, District 8, Ho Chi Minh City, Vietnam\",\"lat\":10.743322,\"lng\":106.6764163}', NULL, NULL, NULL, '50000', 0, NULL, 0, NULL, '2023-08-11 09:45:30', '2023-08-11 09:45:30', 12, 9, NULL),
(13, 'Pending', '{\"place\":\"History Museum of Ho Chi Minh City, 2 Nguyễn Bỉnh Khiêm, Bến Nghé, Quận 1, Thành phố Hồ Chí Minh, Vietnam\",\"lat\":10.787984,\"lng\":106.7047376}', '{\"place\":\"Quận 7, Ho Chi Minh City, Vietnam\",\"lat\":10.7340344,\"lng\":106.7215787}', NULL, NULL, NULL, '50000', 0, NULL, 0, NULL, '2023-08-11 09:45:30', '2023-08-11 09:45:30', 10, 9, NULL),
(14, 'Waiting', '{\"place\":\"58B, Quận 3, Thành phố Hồ Chí Minh, Việt Nam\",\"lat\":10.7843683,\"lng\":106.6844083}', '{\"place\":\"Quán 1...2...3...DZÔ | Quán nhậu ngon quận 8, Đường Cao Lỗ, Phường 4, District 8, Ho Chi Minh City, Vietnam\",\"lat\":10.743322,\"lng\":106.6764163}', NULL, NULL, NULL, '50000', 0, NULL, 0, NULL, '2023-08-11 09:45:30', '2023-08-11 09:45:30', 10, 9, NULL),
(15, 'Confirmed', '{\"place\":\"History Museum of Ho Chi Minh City, 2 Nguyễn Bỉnh Khiêm, Bến Nghé, Quận 1, Thành phố Hồ Chí Minh, Vietnam\",\"lat\":10.787984,\"lng\":106.7047376}', '{\"place\":\"Quận 7, Ho Chi Minh City, Vietnam\",\"lat\":10.7340344,\"lng\":106.7215787}', NULL, NULL, NULL, '50000', 0, NULL, 0, NULL, '2023-08-11 09:45:30', '2023-08-11 09:45:30', 12, 9, NULL),
(16, 'Driving', '{\"place\":\"58B, Quận 3, Thành phố Hồ Chí Minh, Việt Nam\",\"lat\":10.7843683,\"lng\":106.6844083}', '{\"place\":\"Quán 1...2...3...DZÔ | Quán nhậu ngon quận 8, Đường Cao Lỗ, Phường 4, District 8, Ho Chi Minh City, Vietnam\",\"lat\":10.743322,\"lng\":106.6764163}', NULL, NULL, NULL, '50000', 0, NULL, 0, NULL, '2023-08-11 09:45:30', '2023-08-11 09:45:30', 12, 9, 1),
(18, 'Pending', '\"{\\\"place\\\":\\\"random places\\\",\\\"lat\\\":10.1,\\\"lng\\\":10.2}\"', '\"{\\\"place\\\":\\\"2nd random places\\\",\\\"lat\\\":10.3,\\\"lng\\\":10.4}\"', NULL, NULL, NULL, '50000', 0, NULL, 0, NULL, '2023-08-16 11:02:34', '2023-08-16 11:02:34', 4, NULL, 0),
(19, 'Pending', '{\"place\":\"random places\",\"lat\":10.1,\"lng\":10.2}', '{\"place\":\"2nd random places\",\"lat\":10.3,\"lng\":10.4}', NULL, NULL, NULL, '50000', 0, NULL, 0, NULL, '2023-08-22 05:58:55', '2023-08-22 05:58:55', 4, NULL, 0),
(20, 'Pending', '{\"place\":\"random places\",\"lat\":10.1,\"lng\":10.2}', '{\"place\":\"2nd random places\",\"lat\":10.3,\"lng\":10.4}', NULL, NULL, NULL, '50000', 0, NULL, 0, NULL, '2023-08-22 07:54:59', '2023-08-22 07:54:59', 4, NULL, 0),
(21, 'Pending', '{\"place\":\"random places\",\"lat\":10.1,\"lng\":10.2}', '{\"place\":\"2nd random places\",\"lat\":10.3,\"lng\":10.4}', NULL, NULL, NULL, '50000', 0, NULL, 0, NULL, '2023-08-22 07:56:33', '2023-08-22 07:56:33', 4, NULL, 0),
(22, 'Pending', '{\"place\":\"random places\",\"lat\":10.1,\"lng\":10.2}', '{\"place\":\"2nd random places\",\"lat\":10.3,\"lng\":10.4}', NULL, NULL, NULL, '50000', 0, NULL, 0, NULL, '2023-08-22 07:59:55', '2023-08-22 07:59:55', 4, NULL, 0),
(23, 'Confirmed', '{\"place\":\"random places\",\"lat\":10.1,\"lng\":10.2}', '{\"place\":\"2nd random places\",\"lat\":10.3,\"lng\":10.4}', NULL, NULL, NULL, '50000', 0, NULL, 0, NULL, '2023-08-22 08:06:30', '2023-08-22 08:06:39', 4, 3, 0),
(26, 'Confirmed', '{\"place\":\"random places\",\"lat\":10.1,\"lng\":10.2}', '{\"place\":\"2nd random places\",\"lat\":10.3,\"lng\":10.4}', NULL, NULL, NULL, '50000', 0, NULL, 0, NULL, '2023-08-22 08:11:17', '2023-08-22 08:11:22', 4, 3, 0),
(37, 'Confirmed', '{\"place\":\"random places\",\"lat\":10.1,\"lng\":10.2}', '{\"place\":\"2nd random places\",\"lat\":10.3,\"lng\":10.4}', NULL, NULL, NULL, '50000', 0, NULL, 0, NULL, '2023-08-22 09:00:12', '2023-08-22 09:00:46', 4, 3, 0);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--
DROP TABLE IF EXISTS `users`
CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `gender` enum('Male','Female') DEFAULT NULL,
  `birthday` datetime DEFAULT NULL,
  `avatar` varchar(255) NOT NULL DEFAULT 'https://picsum.photos/200/300',
  `type` enum('Admin','User','User_Vip','Driver','CallCenterS1','CallCenterS2','CallCenterS3') DEFAULT NULL,
  `active` tinyint(1) DEFAULT NULL,
  `accessToken` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `token_fcm` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `name`, `phone`, `email`, `password`, `gender`, `birthday`, `avatar`, `type`, `active`, `accessToken`, `createdAt`, `updatedAt`, `token_fcm`) VALUES
(1, 'Admin', '+84111111111', NULL, '$2a$10$Ficn2IbPjW2xSwbjIkkC0u6LmJNGCJmEAqT4Iuw0srI/GfXL/Aeee', NULL, NULL, 'https://picsum.photos/200/300', 'Admin', NULL, NULL, '2023-08-11 09:44:46', '2023-08-11 09:44:46', 'fj9Kb13NThm-4QqSAIu4rb:APA91bHOZm3Fja_OzP7tXdhV391geJ6ZIM_1W_KMOexa_VYF4OUL_M2K7QBrqJlxv1lRlTnJaOnHbDGyrgiP3niBJGoJ8x9y5RzLQn7SNhLbJA2mqgyxnoWENpeE6FTSIfy8dv7iatEB'),
(2, 'Driver', '+84222222222', NULL, '$2a$10$Ficn2IbPjW2xSwbjIkkC0u6LmJNGCJmEAqT4Iuw0srI/GfXL/Aeee', NULL, NULL, 'https://picsum.photos/200/300', 'Driver', NULL, NULL, '2023-08-11 09:44:46', '2023-08-11 09:44:46', 'fj9Kb13NThm-4QqSAIu4rb:APA91bHOZm3Fja_OzP7tXdhV391geJ6ZIM_1W_KMOexa_VYF4OUL_M2K7QBrqJlxv1lRlTnJaOnHbDGyrgiP3niBJGoJ8x9y5RzLQn7SNhLbJA2mqgyxnoWENpeE6FTSIfy8dv7iatEB'),
(3, 'Driver', '+84333333333', NULL, '$2a$10$Ficn2IbPjW2xSwbjIkkC0u6LmJNGCJmEAqT4Iuw0srI/GfXL/Aeee', NULL, NULL, 'https://picsum.photos/200/300', 'Driver', NULL, NULL, '2023-08-11 09:44:46', '2023-08-11 09:44:46', 'fj9Kb13NThm-4QqSAIu4rb:APA91bHOZm3Fja_OzP7tXdhV391geJ6ZIM_1W_KMOexa_VYF4OUL_M2K7QBrqJlxv1lRlTnJaOnHbDGyrgiP3niBJGoJ8x9y5RzLQn7SNhLbJA2mqgyxnoWENpeE6FTSIfy8dv7iatEB'),
(4, 'User_vip', '+84444444444', NULL, '$2a$10$Ficn2IbPjW2xSwbjIkkC0u6LmJNGCJmEAqT4Iuw0srI/GfXL/Aeee', NULL, NULL, 'https://picsum.photos/200/300', 'User_Vip', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwicGhvbmUiOiIrODQ0NDQ0NDQ0NDQiLCJ0eXBlIjoiVXNlcl9WaXAiLCJpYXQiOjE2OTIxODM1NzUsImV4cCI6MTY5MzI2MzU3NX0.5uonl_EPt52dMZRKNxvrJ9aUFHedzl-vT2Nb29p_TKw', '2023-08-11 09:44:46', '2023-08-16 10:59:35', 'fj9Kb13NThm-4QqSAIu4rb:APA91bHOZm3Fja_OzP7tXdhV391geJ6ZIM_1W_KMOexa_VYF4OUL_M2K7QBrqJlxv1lRlTnJaOnHbDGyrgiP3niBJGoJ8x9y5RzLQn7SNhLbJA2mqgyxnoWENpeE6FTSIfy8dv7iatEB'),
(5, 'User', '+84555555555', NULL, '$2a$10$Ficn2IbPjW2xSwbjIkkC0u6LmJNGCJmEAqT4Iuw0srI/GfXL/Aeee', NULL, NULL, 'https://picsum.photos/200/300', 'User', NULL, NULL, '2023-08-11 09:44:46', '2023-08-11 09:44:46', 'fj9Kb13NThm-4QqSAIu4rb:APA91bHOZm3Fja_OzP7tXdhV391geJ6ZIM_1W_KMOexa_VYF4OUL_M2K7QBrqJlxv1lRlTnJaOnHbDGyrgiP3niBJGoJ8x9y5RzLQn7SNhLbJA2mqgyxnoWENpeE6FTSIfy8dv7iatEB'),
(6, 'CallCenterS1', '+84666666666', NULL, '$2a$10$Ficn2IbPjW2xSwbjIkkC0u6LmJNGCJmEAqT4Iuw0srI/GfXL/Aeee', NULL, NULL, 'https://picsum.photos/200/300', 'CallCenterS1', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwicGhvbmUiOiIrODQ2NjY2NjY2NjYiLCJ0eXBlIjoiQ2FsbENlbnRlclMxIiwiaWF0IjoxNjkyMTgzNTY2LCJleHAiOjE2OTMyNjM1NjZ9.i01bmSAiMRC6RFYlFqgTybCK6oFaUwSfU2BAXf7uUo8', '2023-08-11 09:44:46', '2023-08-16 10:59:26', 'fj9Kb13NThm-4QqSAIu4rb:APA91bHOZm3Fja_OzP7tXdhV391geJ6ZIM_1W_KMOexa_VYF4OUL_M2K7QBrqJlxv1lRlTnJaOnHbDGyrgiP3niBJGoJ8x9y5RzLQn7SNhLbJA2mqgyxnoWENpeE6FTSIfy8dv7iatEB'),
(7, 'CallCenterS2', '+84777777777', NULL, '$2a$10$Ficn2IbPjW2xSwbjIkkC0u6LmJNGCJmEAqT4Iuw0srI/GfXL/Aeee', NULL, NULL, 'https://picsum.photos/200/300', 'CallCenterS2', NULL, NULL, '2023-08-11 09:44:46', '2023-08-11 09:44:46', 'fj9Kb13NThm-4QqSAIu4rb:APA91bHOZm3Fja_OzP7tXdhV391geJ6ZIM_1W_KMOexa_VYF4OUL_M2K7QBrqJlxv1lRlTnJaOnHbDGyrgiP3niBJGoJ8x9y5RzLQn7SNhLbJA2mqgyxnoWENpeE6FTSIfy8dv7iatEB'),
(8, 'CallCenterS3', '+84888888888', NULL, '$2a$10$Ficn2IbPjW2xSwbjIkkC0u6LmJNGCJmEAqT4Iuw0srI/GfXL/Aeee', NULL, NULL, 'https://picsum.photos/200/300', 'CallCenterS3', NULL, NULL, '2023-08-11 09:44:46', '2023-08-11 09:44:46', 'fj9Kb13NThm-4QqSAIu4rb:APA91bHOZm3Fja_OzP7tXdhV391geJ6ZIM_1W_KMOexa_VYF4OUL_M2K7QBrqJlxv1lRlTnJaOnHbDGyrgiP3niBJGoJ8x9y5RzLQn7SNhLbJA2mqgyxnoWENpeE6FTSIfy8dv7iatEB'),
(9, 'Doan Huu Loc', '+84941544569', 'lapdoan.010102@gmail.com', '$2a$10$Ficn2IbPjW2xSwbjIkkC0u6LmJNGCJmEAqT4Iuw0srI/GfXL/Aeee', 'Male', NULL, 'https://picsum.photos/200/300', 'Driver', NULL, NULL, '2023-08-09 16:14:48', '2023-08-09 16:14:48', 'fj9Kb13NThm-4QqSAIu4rb:APA91bHOZm3Fja_OzP7tXdhV391geJ6ZIM_1W_KMOexa_VYF4OUL_M2K7QBrqJlxv1lRlTnJaOnHbDGyrgiP3niBJGoJ8x9y5RzLQn7SNhLbJA2mqgyxnoWENpeE6FTSIfy8dv7iatEB'),
(10, 'Nguyen Dang Manh Tu', '+84974220702', 'manhtu22702@gmail.com', '$2a$10$Ficn2IbPjW2xSwbjIkkC0u6LmJNGCJmEAqT4Iuw0srI/GfXL/Aeee', 'Male', NULL, 'https://picsum.photos/200/300', 'User_Vip', NULL, NULL, '2023-08-09 16:14:48', '2023-08-09 16:14:48', 'fj9Kb13NThm-4QqSAIu4rb:APA91bHOZm3Fja_OzP7tXdhV391geJ6ZIM_1W_KMOexa_VYF4OUL_M2K7QBrqJlxv1lRlTnJaOnHbDGyrgiP3niBJGoJ8x9y5RzLQn7SNhLbJA2mqgyxnoWENpeE6FTSIfy8dv7iatEB'),
(11, 'Le Nguyen Lan Vy', '+84777063550', 'lanvy@gmail.com', '$2a$10$Ficn2IbPjW2xSwbjIkkC0u6LmJNGCJmEAqT4Iuw0srI/GfXL/Aeee', 'Female', NULL, 'https://picsum.photos/200/300', '', NULL, NULL, '2023-08-09 16:14:48', '2023-08-09 16:14:48', 'fj9Kb13NThm-4QqSAIu4rb:APA91bHOZm3Fja_OzP7tXdhV391geJ6ZIM_1W_KMOexa_VYF4OUL_M2K7QBrqJlxv1lRlTnJaOnHbDGyrgiP3niBJGoJ8x9y5RzLQn7SNhLbJA2mqgyxnoWENpeE6FTSIfy8dv7iatEB'),
(12, 'Tang Kim Long', '+84974649123', 'kimlong@gmail.com', '$2a$10$Ficn2IbPjW2xSwbjIkkC0u6LmJNGCJmEAqT4Iuw0srI/GfXL/Aeee', 'Male', NULL, 'https://picsum.photos/200/300', 'User', NULL, NULL, '2023-08-09 16:14:48', '2023-08-09 16:14:48', 'fj9Kb13NThm-4QqSAIu4rb:APA91bHOZm3Fja_OzP7tXdhV391geJ6ZIM_1W_KMOexa_VYF4OUL_M2K7QBrqJlxv1lRlTnJaOnHbDGyrgiP3niBJGoJ8x9y5RzLQn7SNhLbJA2mqgyxnoWENpeE6FTSIfy8dv7iatEB');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `vehicles`
--
DROP TABLE IF EXISTS `vehicles`
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Đang đổ dữ liệu cho bảng `vehicles`
--

INSERT INTO `vehicles` (`id`, `driver_license`, `vehicle_registration`, `license_plate`, `name`, `description`, `createdAt`, `updatedAt`, `driver_id`, `vehicle_type_id`) VALUES
(1, '0964155097', '123456', '30D-206.32', 'Honda 4 Chỗ Vip', NULL, '2023-08-11 09:44:46', '2023-08-11 09:44:46', 2, 1),
(2, '0964155097', '123456', '30D-206.32', 'Honda 7 Chỗ Vip', NULL, '2023-08-11 09:44:46', '2023-08-11 09:44:46', 3, 2),
(3, '0964155097', '123456', '30D-206.32', 'Honda 4 Chỗ Vip', NULL, '2023-08-11 09:44:46', '2023-08-11 09:44:46', 9, 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `vehicle_types`
--
DROP TABLE IF EXISTS `vehicle_types`
CREATE TABLE `vehicle_types` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Đang đổ dữ liệu cho bảng `vehicle_types`
--

INSERT INTO `vehicle_types` (`id`, `name`, `createdAt`, `updatedAt`) VALUES
(1, 'Xe 4 Chỗ', '2023-08-11 09:44:46', '2023-08-11 09:44:46'),
(2, 'Xe 7 Chỗ', '2023-08-11 09:44:46', '2023-08-11 09:44:46');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `conversations`
--
ALTER TABLE `conversations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `driver_id` (`driver_id`),
  ADD KEY `trip_id` (`trip_id`);

--
-- Chỉ mục cho bảng `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `conversation_id` (`conversation_id`),
  ADD KEY `user_id` (`user_id`);

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
-- AUTO_INCREMENT cho bảng `conversations`
--
ALTER TABLE `conversations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT cho bảng `vehicles`
--
ALTER TABLE `vehicles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `vehicle_types`
--
ALTER TABLE `vehicle_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `conversations`
--
ALTER TABLE `conversations`
  ADD CONSTRAINT `Conversations_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `Conversations_ibfk_2` FOREIGN KEY (`driver_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `Conversations_ibfk_3` FOREIGN KEY (`trip_id`) REFERENCES `trips` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `Messages_ibfk_1` FOREIGN KEY (`conversation_id`) REFERENCES `conversations` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `Messages_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `rates`
--
ALTER TABLE `rates`
  ADD CONSTRAINT `Rates_ibfk_1` FOREIGN KEY (`trip_id`) REFERENCES `trips` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `settings`
--
ALTER TABLE `settings`
  ADD CONSTRAINT `Settings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `trips`
--
ALTER TABLE `trips`
  ADD CONSTRAINT `Trips_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `Trips_ibfk_2` FOREIGN KEY (`driver_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `vehicles`
--
ALTER TABLE `vehicles`
  ADD CONSTRAINT `Vehicles_ibfk_1` FOREIGN KEY (`driver_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `Vehicles_ibfk_2` FOREIGN KEY (`vehicle_type_id`) REFERENCES `vehicle_types` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
