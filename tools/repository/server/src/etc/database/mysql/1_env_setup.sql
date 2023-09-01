CREATE USER 'leos_repository'@'localhost' IDENTIFIED BY 'leos_repository';
GRANT ALL PRIVILEGES ON *.* TO 'leos_repository'@'localhost';
CREATE DATABASE IF NOT EXISTS leos_repository;
CREATE TABLESPACE leos_repository ADD DATAFILE 'leos_repository.ibd' ENGINE = INNODB;