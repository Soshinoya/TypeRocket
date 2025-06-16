CREATE TABLE
    users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(30) UNIQUE NOT NULL,
        email VARCHAR(30) UNIQUE NOT NULL,
        password VARCHAR(30) NOT NULL,
        creationDate DATE NOT NULL DEFAULT CURRENT_DATE,
        description TEXT DEFAULT 'Hey there! I am using TypeRocket'
    );

CREATE TABLE
    user_preferences (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
        currentThemeId VARCHAR(30)
    );

CREATE TABLE
    experience (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
        level INT DEFAULT 0,
        progress INT DEFAULT 0
    );

CREATE TABLE
    result_metrics (
        id SERIAL PRIMARY KEY,
        wpm INT NOT NULL,
        rawWpm INT NOT NULL,
        accuracy INT NOT NULL,
        consistency INT NOT NULL,
        date DATE NOT NULL DEFAULT CURRENT_DATE
    );

CREATE TABLE
    test_names (id SERIAL PRIMARY KEY, name VARCHAR(20) UNIQUE);

CREATE TABLE
    best_results (
        user_id INT REFERENCES users (id) ON DELETE CASCADE,
        test_name_id INT REFERENCES test_names (id),
        result_id INT REFERENCES result_metrics (id) ON DELETE CASCADE,
        PRIMARY KEY (user_id, test_name_id)
    );

CREATE TABLE
    achievements (
        id SERIAL PRIMARY KEY,
        title VARCHAR(100) NOT NULL,
        description TEXT,
        experience_gained INT DEFAULT 0
    );

CREATE TABLE
    user_achievements (
        id SERIAL PRIMARY KEY,
        user_id INT UNIQUE REFERENCES users (id) ON DELETE CASCADE,
        achievement_id INT UNIQUE REFERENCES achievements (id) ON DELETE CASCADE,
        completion_date DATE NOT NULL DEFAULT CURRENT_DATE
    );

CREATE TABLE
    user_activity (
        user_id INT NOT NULL,
        count INTEGER NOT NULL,
        date DATE NOT NULL DEFAULT CURRENT_DATE,
        PRIMARY KEY (user_id, date),
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
PARTITION BY
    RANGE (date);

-- Создание партиций по годам
CREATE TABLE
    activity_2022 PARTITION OF user_activity FOR
VALUES
FROM
    ('2022-01-01') TO ('2023-01-01');

CREATE TABLE
    activity_2023 PARTITION OF user_activity FOR
VALUES
FROM
    ('2023-01-01') TO ('2024-01-01');

INSERT INTO
    test_names (name)
VALUES
    ('test_15s'),
    ('test_30s'),
    ('test_60s'),
    ('test_120s'),
    ('test_10w'),
    ('test_20w'),
    ('test_40w'),
    ('test_80w');

CREATE INDEX idx_user_activity_date ON user_activity (date);

-- DROP SCHEMA public CASCADE;
-- CREATE SCHEMA public;
-- GRANT ALL ON SCHEMA public TO postgres;
-- GRANT ALL ON SCHEMA public TO public;