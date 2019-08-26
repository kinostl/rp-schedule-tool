/*******************************************************************************
Drop database if it exists
 ********************************************************************************/
DROP DATABASE IF EXISTS `rp_schedule_tool`;


/*******************************************************************************
Create database
 ********************************************************************************/
CREATE DATABASE `rp_schedule_tool`;


USE `rp_schedule_tool`;


/*******************************************************************************
Create Tables
 ********************************************************************************/
CREATE TABLE `users`
(
	`id` INT NOT NULL AUTO_INCREMENT,
	`DiscordId` INT NOT NULL,
	`json` TEXT NOT NULL,
	`timezone` TEXT NOT NULL,
	CONSTRAINT `PK_User` PRIMARY KEY  (`id`)
);

CREATE TABLE `servers`
(
	`id` INT NOT NULL AUTO_INCREMENT,
	`UserId` INT NOT NULL,
	`ServerId` INT NOT NULL,
	CONSTRAINT `PK_Server` PRIMARY KEY  (`id`)
);

CREATE TABLE `characters`
(
	`id` INT NOT NULL AUTO_INCREMENT,
	`UserId` INT NOT NULL,
	`ServerId` INT NOT NULL, 
	`name` TEXT NOT NULL,
	`description` LONGTEXT NOT NULL,
	CONSTRAINT `PK_Character` PRIMARY KEY  (`id`)
);

CREATE TABLE `stories`
(
	`id` INT NOT NULL AUTO_INCREMENT,
	`UserId` INT NOT NULL,
	`CharacterId` INT NOT NULL, 
	`name` TEXT NOT NULL,
	`description` LONGTEXT NOT NULL,
	CONSTRAINT `PK_Character` PRIMARY KEY  (`id`)
);
