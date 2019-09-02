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
CREATE TABLE `events`
(
	`id` INTEGER NOT NULL AUTO_INCREMENT,
	`UserId` VARCHAR(255) NOT NULL,
	`ServerId` VARCHAR(255) NOT NULL, 
	`start` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`end` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `PK_Event` PRIMARY KEY  (`id`)
);

CREATE TABLE `characters`
(
	`id` INTEGER NOT NULL AUTO_INCREMENT,
	`UserId` VARCHAR(255) NOT NULL,
	`ServerId` VARCHAR(255) NOT NULL, 
	`name` VARCHAR(255) NOT NULL,
	`description` TEXT NOT NULL,
	CONSTRAINT `PK_Character` PRIMARY KEY  (`id`)
);

CREATE TABLE `stories`
(
	`id` INTEGER NOT NULL AUTO_INCREMENT,
	`UserId` VARCHAR(255) NOT NULL,
	`CharacterId` INTEGER NOT NULL, 
	`name` VARCHAR(255) NOT NULL,
	`description` TEXT NOT NULL,
	CONSTRAINT `PK_Story` PRIMARY KEY  (`id`)
);
