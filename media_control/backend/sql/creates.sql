CREATE SCHEMA `event_media_control`;

CREATE TABLE `event_media_control`.`clients` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `contact_name` varchar(45) DEFAULT NULL,
  `contact_email` varchar(45) DEFAULT NULL,
  `contact_phone` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `event_media_control`.`events` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `client_id` int DEFAULT NULL,
  `num_screens` int DEFAULT '0',
  `num_sources` int DEFAULT '0',
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `primary_location` varchar(128) DEFAULT NULL,
  `banner_image_name` varchar(96) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_client_id_idx` (`client_id`),
  CONSTRAINT `fk_event_client` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `event_media_control`.`access_codes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(45) NOT NULL,
  `event_id` int NOT NULL,
  `scope` int NOT NULL,
  `home_url` varchar(45) DEFAULT '/',
  PRIMARY KEY (`id`),
  UNIQUE KEY `code_UNIQUE` (`code`),
  KEY `fk_event_id_idx` (`event_id`),
  CONSTRAINT `fk_event_id` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `event_media_control`.`media` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `description` varchar(128) NOT NULL,
  `event_id` int DEFAULT NULL,
  `content` varchar(2048) DEFAULT NULL,
  `content_type` varchar(45) DEFAULT NULL,
  `url_name` varchar(45) NOT NULL,
  `thumbnail_image` varchar(128) DEFAULT NULL,
  `short_name` varchar(45) DEFAULT NULL,
  `orientation` tinyint DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `fk_media_event_idx` (`event_id`),
  CONSTRAINT `fk_media_event` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `event_media_control`.`screens` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `event_id` int NOT NULL,
  `description` varchar(128) DEFAULT NULL,
  `location` varchar(128) DEFAULT NULL,
  `default_media_id` int DEFAULT NULL,
  `url_name` varchar(45) NOT NULL,
  `image_url` varchar(45) DEFAULT NULL,
  `playback_enabled` tinyint DEFAULT '0',
  `orientation` tinyint DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `fk_event_idx` (`event_id`),
  KEY `fk_current_media_idx` (`default_media_id`),
  CONSTRAINT `fk_default_media` FOREIGN KEY (`default_media_id`) REFERENCES `media` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_event` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `event_media_control`.`schedule` (
  `id` int NOT NULL AUTO_INCREMENT,
  `screen_id` int NOT NULL,
  `target_media_id` int NOT NULL,
  `time` datetime NOT NULL,
  `has_been_fired` tinyint NOT NULL DEFAULT '0',
  `event_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_screen_id_idx` (`screen_id`),
  KEY `fk_target_media_id_idx` (`target_media_id`),
  CONSTRAINT `fk_screen_id` FOREIGN KEY (`screen_id`) REFERENCES `screens` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_target_media_id` FOREIGN KEY (`target_media_id`) REFERENCES `media` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

