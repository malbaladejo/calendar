
/*calendar_user*/
DROP TABLE IF EXISTS `calendar_user`;
CREATE TABLE `calendar_user` (
  `UserId` varchar(50) NOT NULL,
  `Name` varchar(50) NOT NULL,
  `Email` varchar(50) NOT NULL,
  `Password` varchar(300) DEFAULT NULL,
  `Role` varchar(10) DEFAULT NULL,
  `PasswordCreationDate` datetime DEFAULT NULL,
  PRIMARY KEY (`UserId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;


/*calendar_label*/
DROP TABLE IF EXISTS `calendar_label`;
CREATE TABLE `calendar_label` (
  `UserId` varchar(50) NOT NULL,
  `Date` date NOT NULL,
  `LastUpdate` date NOT NULL,
  `Label` varchar(2000) DEFAULT NULL,
  `Tag` varchar(20) DEFAULT NULL,
  `Style` varchar(20) DEFAULT NULL,
  `Color` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`UserId`,`Date`),
  KEY `FK_calendar_label_UserId` (`UserId`),
  CONSTRAINT `FK_calendar_label_UserId` FOREIGN KEY (`UserId`) REFERENCES `calendar_user` (`UserId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

/*calendar_refresh_tokens*/
DROP TABLE IF EXISTS `calendar_refresh_tokens`;
CREATE TABLE `calendar_refresh_tokens` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `UserId` varchar(50) NOT NULL,
  `Token` varchar(255) NOT NULL,
  `ExpiresAt` datetime NOT NULL,
  `CreatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `RevokedAt` datetime DEFAULT NULL,
  `ReplacedByToken` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Token` (`Token`),
  KEY `idx_token` (`Token`),
  KEY `idx_userid` (`UserId`),
  KEY `FK_calendar_label_UserId` (`UserId`)
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


