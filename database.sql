CREATE DATABASE IF NOT EXISTS todo;
USE todo;

CREATE TABLE IF NOT EXISTS todo_status (
    id BIGINT AUTO_INCREMENT,
    status_code VARCHAR(30) NOT NULL,
    status_name VARCHAR(50) NOT NULL,
    CONSTRAINT pk_todo_status PRIMARY KEY (id),
    CONSTRAINT uk_todo_status_code UNIQUE (status_code),
    CONSTRAINT uk_todo_status_name UNIQUE (status_name)
);

CREATE TABLE IF NOT EXISTS todo_priority (
    id BIGINT AUTO_INCREMENT,
    priority_code VARCHAR(30) NOT NULL,
    priority_name VARCHAR(50) NOT NULL,
    CONSTRAINT pk_todo_priority PRIMARY KEY (id),
    CONSTRAINT uk_todo_priority_code UNIQUE (priority_code),
    CONSTRAINT uk_todo_priority_name UNIQUE (priority_name)
);

CREATE TABLE IF NOT EXISTS todo (
    id BIGINT AUTO_INCREMENT,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    status_id BIGINT NOT NULL,
    due_date DATE,
    priority_id BIGINT NOT NULL,
    completion_date DATE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100) NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by VARCHAR(100),
    CONSTRAINT pk_todo PRIMARY KEY (id),
    CONSTRAINT fk_todo_status FOREIGN KEY (status_id) REFERENCES todo_status(id),
    CONSTRAINT fk_todo_priority FOREIGN KEY (priority_id) REFERENCES todo_priority(id),
    CONSTRAINT chk_todo_title CHECK (CHAR_LENGTH(TRIM(title)) >= 3),
    CONSTRAINT chk_todo_dates CHECK (
        completion_date IS NULL OR due_date IS NULL OR completion_date >= due_date
    )
);

INSERT INTO todo_status (status_code, status_name)
VALUES ('TODO', 'TODO'), ('IN', 'IN_PROGRESS'), ('D', 'DONE');

INSERT INTO todo_priority (priority_code, priority_name)
VALUES ('L', 'LOW'), ('M', 'MEDIUM'), ('H', 'HIGH');

INSERT INTO todo
(title, description, status_id, due_date, priority_id, completion_date, created_by, updated_by)
VALUES
('Learn Java', 'Study Java OOP concepts', 1, '2026-09-05', 3, NULL, 'vihar', 'vihar'),
('Learn SQL', 'Practice SQL DDL and DML', 2, '2026-09-10', 2, NULL, 'siva', 'siva'),
('Learn HTML', 'Create Todo application UI', 3, '2026-08-30', 1, '2026-08-29', 'harish', 'harish');

SELECT
    t.id, t.title, t.description, t.status_id,
    s.status_name AS status, t.due_date, t.priority_id,
    p.priority_name AS priority, t.completion_date,
    t.created_at, t.created_by, t.updated_at, t.updated_by
FROM todo t
JOIN todo_status s ON t.status_id = s.id
JOIN todo_priority p ON t.priority_id = p.id;
