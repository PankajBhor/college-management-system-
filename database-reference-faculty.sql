CREATE TABLE IF NOT EXISTS reference_faculty (
  id BIGINT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  department VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  active BOOLEAN DEFAULT TRUE,
  PRIMARY KEY (id)
);

INSERT INTO reference_faculty (name, department, email, active) VALUES
  ('Prof. Anita', 'Computer Engineering', 'faculty@college.com', TRUE),
  ('Prof. Rahul Patil', 'Civil Engineering', 'rahul.patil@college.com', TRUE),
  ('Prof. Neha Deshmukh', 'Electronics and Telecommunication Engineering', 'neha.deshmukh@college.com', TRUE)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  department = VALUES(department),
  active = VALUES(active);

DELIMITER //
CREATE PROCEDURE reset_auto_increment_for_table(IN table_name_value VARCHAR(64))
BEGIN
  IF table_name_value = 'users' THEN
    SET @next_id = (SELECT COALESCE(MAX(id), 0) + 1 FROM users);
    SET @sql = CONCAT('ALTER TABLE users AUTO_INCREMENT = ', @next_id);
  ELSEIF table_name_value = 'courses' THEN
    SET @next_id = (SELECT COALESCE(MAX(id), 0) + 1 FROM courses);
    SET @sql = CONCAT('ALTER TABLE courses AUTO_INCREMENT = ', @next_id);
  ELSE
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Unsupported table';
  END IF;
  PREPARE stmt FROM @sql;
  EXECUTE stmt;
  DEALLOCATE PREPARE stmt;
END//
DELIMITER ;
