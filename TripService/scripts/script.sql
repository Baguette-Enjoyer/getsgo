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
-- Cấu trúc bảng cho bảng `Conversations`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `rates`
--

CREATE TABLE `Rates` (
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

INSERT INTO `Rates` (`id`, `star`, `comment`, `createdAt`, `updatedAt`, `trip_id`) VALUES
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


-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `Trips`
--

CREATE TABLE `Trips` (
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
  `is_callcenter` tinyint(1) DEFAULT NULL,
  `distance` decimal(10,0) DEFAULT NULL,
  `duration` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Đang đổ dữ liệu cho bảng `Trips`
--

INSERT INTO `Trips` (`id`, `status`, `start`, `end`, `finished_date`, `type`, `note`, `price`, `is_paid`, `paymentMethod`, `is_scheduled`, `schedule_time`, `createdAt`, `updatedAt`, `user_id`, `driver_id`, `is_callcenter`,`distance`,`duration`) VALUES
(2, 'Done', '{\"lat\":10.1,\"lng\":10.2,\"place\":\"random places\"}', '{\"lat\":10.3,\"lng\":10.4,\"place\":\"2nd random places\"}', NULL, NULL, NULL, '50000', 0, 'Cash', 0, NULL, '2023-08-11 09:44:46', '2023-08-11 09:44:46', 4, 2, NULL,NULL,NULL),
(3, 'Cancelled', '{\"lat\":10.1,\"lng\":10.2,\"place\":\"random places\"}', '{\"lat\":10.3,\"lng\":10.4,\"place\":\"2nd random places\"}', NULL, NULL, NULL, '50000', 0, 'Cash', 0, NULL, '2023-08-11 09:44:46', '2023-08-11 09:44:46', 5, 2, NULL,NULL,NULL),
(4, 'Done', '{\"lat\":10.1,\"lng\":10.2,\"place\":\"random places\"}', '{\"lat\":10.3,\"lng\":10.4,\"place\":\"2nd random places\"}', NULL, NULL, NULL, '50000', 0, 'Cash', 0, NULL, '2023-08-11 09:44:46', '2023-08-11 09:44:46', 4, 3, NULL,NULL,NULL),
(5, 'Done', '{\"lat\":10.1,\"lng\":10.2,\"place\":\"random places\"}', '{\"lat\":10.3,\"lng\":10.4,\"place\":\"2nd random places\"}', NULL, NULL, NULL, '50000', 0, 'Cash', 0, NULL, '2023-08-11 09:44:46', '2023-08-11 09:44:46', 4, 3, 1,NULL,NULL),
(6, 'Done', '{\"lat\":10.1,\"lng\":10.2,\"place\":\"random places\"}', '{\"lat\":10.3,\"lng\":10.4,\"place\":\"2nd random places\"}', NULL, NULL, NULL, '50000', 0, 'Cash', 0, NULL, '2023-08-11 09:44:46', '2023-08-11 09:44:46', 5, 3, NULL,NULL,NULL),
(7, 'Done', '{\"place\":\"2 Nguyễn Bỉnh Khiêm, Quận 1, Thành phố Hồ Chí Minh, Việt Nam\",\"lat\":10.7877783,\"lng\":106.705055}', '{\"name\":\"Quận 1, Ho Chi Minh City, Vietnam\",\"lat\":10.7756587,\"lng\":106.7004238}', NULL, NULL, NULL, '50000', 0, NULL, 0, NULL, '2023-08-11 09:45:30', '2023-08-11 09:45:30', 10, 9, NULL,NULL,NULL),
(8, 'Done', '{\"place\":\"History Museum of Ho Chi Minh City, 2 Nguyễn Bỉnh Khiêm, Bến Nghé, Quận 1, Thành phố Hồ Chí Minh, Vietnam\",\"lat\":10.787984,\"lng\":106.7047376}', '{\"place\":\"Quận 7, Ho Chi Minh City, Vietnam\",\"lat\":10.7340344,\"lng\":106.7215787}', NULL, NULL, NULL, '50000', 0, NULL, 0, NULL, '2023-08-11 09:45:30', '2023-08-11 09:45:30', 10, 9, NULL,NULL,NULL),
(9, 'Done', '{\"place\":\"58B, Quận 3, Thành phố Hồ Chí Minh, Việt Nam\",\"lat\":10.7843683,\"lng\":106.6844083}', '{\"place\":\"Quán 1...2...3...DZÔ | Quán nhậu ngon quận 8, Đường Cao Lỗ, Phường 4, District 8, Ho Chi Minh City, Vietnam\",\"lat\":10.743322,\"lng\":106.6764163}', NULL, NULL, NULL, '50000', 0, NULL, 0, NULL, '2023-08-11 09:45:30', '2023-08-11 09:45:30', 10, 9, NULL,NULL,NULL),
(10, 'Done', '{\"place\":\"History Museum of Ho Chi Minh City, 2 Nguyễn Bỉnh Khiêm, Bến Nghé, Quận 1, Thành phố Hồ Chí Minh, Vietnam\",\"lat\":10.787984,\"lng\":106.7047376}', '{\"place\":\"Quận 7, Ho Chi Minh City, Vietnam\",\"lat\":10.7340344,\"lng\":106.7215787}', NULL, NULL, NULL, '50000', 0, NULL, 0, NULL, '2023-08-11 09:45:30', '2023-08-11 09:45:30', 12, 9, NULL,NULL,NULL),
(11, 'Done', '{\"place\":\"58B, Quận 3, Thành phố Hồ Chí Minh, Việt Nam\",\"lat\":10.7843683,\"lng\":106.6844083}', '{\"place\":\"Quán 1...2...3...DZÔ | Quán nhậu ngon quận 8, Đường Cao Lỗ, Phường 4, District 8, Ho Chi Minh City, Vietnam\",\"lat\":10.743322,\"lng\":106.6764163}', NULL, NULL, NULL, '50000', 0, NULL, 0, NULL, '2023-08-11 09:45:30', '2023-08-11 09:45:30', 12, 9, NULL,NULL,NULL),
(13, 'Pending', '{\"place\":\"History Museum of Ho Chi Minh City, 2 Nguyễn Bỉnh Khiêm, Bến Nghé, Quận 1, Thành phố Hồ Chí Minh, Vietnam\",\"lat\":10.787984,\"lng\":106.7047376}', '{\"place\":\"Quận 7, Ho Chi Minh City, Vietnam\",\"lat\":10.7340344,\"lng\":106.7215787}', NULL, NULL, NULL, '50000', 0, NULL, 0, NULL, '2023-08-11 09:45:30', '2023-08-11 09:45:30', 10, 9, NULL,NULL,NULL),
(14, 'Waiting', '{\"place\":\"58B, Quận 3, Thành phố Hồ Chí Minh, Việt Nam\",\"lat\":10.7843683,\"lng\":106.6844083}', '{\"place\":\"Quán 1...2...3...DZÔ | Quán nhậu ngon quận 8, Đường Cao Lỗ, Phường 4, District 8, Ho Chi Minh City, Vietnam\",\"lat\":10.743322,\"lng\":106.6764163}', NULL, NULL, NULL, '50000', 0, NULL, 0, NULL, '2023-08-11 09:45:30', '2023-08-11 09:45:30', 10, 9, NULL,NULL,NULL),
(15, 'Confirmed', '{\"place\":\"History Museum of Ho Chi Minh City, 2 Nguyễn Bỉnh Khiêm, Bến Nghé, Quận 1, Thành phố Hồ Chí Minh, Vietnam\",\"lat\":10.787984,\"lng\":106.7047376}', '{\"place\":\"Quận 7, Ho Chi Minh City, Vietnam\",\"lat\":10.7340344,\"lng\":106.7215787}', NULL, NULL, NULL, '50000', 0, NULL, 0, NULL, '2023-08-11 09:45:30', '2023-08-11 09:45:30', 12, 9, NULL,NULL,NULL),
(16, 'Driving', '{\"place\":\"58B, Quận 3, Thành phố Hồ Chí Minh, Việt Nam\",\"lat\":10.7843683,\"lng\":106.6844083}', '{\"place\":\"Quán 1...2...3...DZÔ | Quán nhậu ngon quận 8, Đường Cao Lỗ, Phường 4, District 8, Ho Chi Minh City, Vietnam\",\"lat\":10.743322,\"lng\":106.6764163}', NULL, NULL, NULL, '50000', 0, NULL, 0, NULL, '2023-08-11 09:45:30', '2023-08-11 09:45:30', 12, 9, 1,NULL,NULL),
(18, 'Pending', '\"{\\\"place\\\":\\\"random places\\\",\\\"lat\\\":10.1,\\\"lng\\\":10.2}\"', '\"{\\\"place\\\":\\\"2nd random places\\\",\\\"lat\\\":10.3,\\\"lng\\\":10.4}\"', NULL, NULL, NULL, '50000', 0, NULL, 0, NULL, '2023-08-16 11:02:34', '2023-08-16 11:02:34', 4, NULL, 0,NULL,NULL),
(19, 'Pending', '{\"place\":\"random places\",\"lat\":10.1,\"lng\":10.2}', '{\"place\":\"2nd random places\",\"lat\":10.3,\"lng\":10.4}', NULL, NULL, NULL, '50000', 0, NULL, 0, NULL, '2023-08-22 05:58:55', '2023-08-22 05:58:55', 4, NULL, 0,NULL,NULL),
(20, 'Pending', '{\"place\":\"random places\",\"lat\":10.1,\"lng\":10.2}', '{\"place\":\"2nd random places\",\"lat\":10.3,\"lng\":10.4}', NULL, NULL, NULL, '50000', 0, NULL, 0, NULL, '2023-08-22 07:54:59', '2023-08-22 07:54:59', 4, NULL, 0,NULL,NULL),
(21, 'Pending', '{\"place\":\"random places\",\"lat\":10.1,\"lng\":10.2}', '{\"place\":\"2nd random places\",\"lat\":10.3,\"lng\":10.4}', NULL, NULL, NULL, '50000', 0, NULL, 0, NULL, '2023-08-22 07:56:33', '2023-08-22 07:56:33', 4, NULL, 0,NULL,NULL),
(22, 'Pending', '{\"place\":\"random places\",\"lat\":10.1,\"lng\":10.2}', '{\"place\":\"2nd random places\",\"lat\":10.3,\"lng\":10.4}', NULL, NULL, NULL, '50000', 0, NULL, 0, NULL, '2023-08-22 07:59:55', '2023-08-22 07:59:55', 4, NULL, 0,NULL,NULL),
(23, 'Confirmed', '{\"place\":\"random places\",\"lat\":10.1,\"lng\":10.2}', '{\"place\":\"2nd random places\",\"lat\":10.3,\"lng\":10.4}', NULL, NULL, NULL, '50000', 0, NULL, 0, NULL, '2023-08-22 08:06:30', '2023-08-22 08:06:39', 4, 3, 0,NULL,NULL),
(26, 'Confirmed', '{\"place\":\"random places\",\"lat\":10.1,\"lng\":10.2}', '{\"place\":\"2nd random places\",\"lat\":10.3,\"lng\":10.4}', NULL, NULL, NULL, '50000', 0, NULL, 0, NULL, '2023-08-22 08:11:17', '2023-08-22 08:11:22', 4, 3, 0,NULL,NULL),
(37, 'Confirmed', '{\"place\":\"random places\",\"lat\":10.1,\"lng\":10.2}', '{\"place\":\"2nd random places\",\"lat\":10.3,\"lng\":10.4}', NULL, NULL, NULL, '50000', 0, NULL, 0, NULL, '2023-08-22 09:00:12', '2023-08-22 09:00:46', 4, 3, 0,NULL,NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `Users`
--

--
-- Chỉ mục cho bảng `Conversations`

--
-- Chỉ mục cho bảng `messages`

-- Chỉ mục cho bảng `rates`
--
ALTER TABLE `Rates`
  ADD PRIMARY KEY (`id`),
  ADD KEY `trip_id` (`trip_id`);

--
-- Chỉ mục cho bảng `settings`


--
-- Chỉ mục cho bảng `Trips`
--
ALTER TABLE `Trips`
  ADD PRIMARY KEY (`id`);


--
-- AUTO_INCREMENT cho bảng `rates`
--
ALTER TABLE `Rates`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT cho bảng `settings`


--
-- AUTO_INCREMENT cho bảng `Trips`
--
ALTER TABLE `Trips`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT cho bảng `Users`
--

--
-- Các ràng buộc cho bảng `rates`
--
ALTER TABLE `Rates`
  ADD CONSTRAINT `Rates_ibfk_1` FOREIGN KEY (`trip_id`) REFERENCES `Trips` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
