CREATE TABLE
    users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(30) UNIQUE NOT NULL,
        email VARCHAR(30) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        creation_date DATE NOT NULL DEFAULT CURRENT_DATE,
        description TEXT NOT NULL DEFAULT 'Hey there! I am using TypeRocket'
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
    activity_2025 PARTITION OF user_activity FOR
VALUES
FROM
    ('2025-01-01') TO ('2026-01-01');

CREATE TABLE
    activity_2026 PARTITION OF user_activity FOR
VALUES
FROM
    ('2026-01-01') TO ('2027-01-01');

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

CREATE OR REPLACE FUNCTION upsert_best_result(
    p_user_id INT, 
    p_test_name VARCHAR(20)
RETURNS VOID AS $$
DECLARE
    v_test_name_id INT;
    v_result_id INT;
BEGIN
    -- Получаем ID названия теста (если не существует - будет ошибка внешнего ключа)
    SELECT id INTO v_test_name_id 
    FROM test_names 
    WHERE name = p_test_name;

    -- Получаем последний ID из result_metrics
    SELECT id INTO v_result_id 
    FROM result_metrics 
    ORDER BY id DESC 
    LIMIT 1;

    -- Пытаемся обновить запись
    UPDATE best_results 
    SET result_id = v_result_id
    WHERE user_id = p_user_id 
      AND test_name_id = v_test_name_id;

    -- Если обновления не произошло, пробуем вставить
    IF NOT FOUND THEN
        INSERT INTO best_results (user_id, test_name_id, result_id)
        VALUES (p_user_id, v_test_name_id, v_result_id);
    END IF;
EXCEPTION
    WHEN unique_violation THEN -- Если запись появилась параллельно
        UPDATE best_results 
        SET result_id = v_result_id
        WHERE user_id = p_user_id 
          AND test_name_id = v_test_name_id;
END;
$$ LANGUAGE plpgsql;

CREATE INDEX idx_user_activity_date ON user_activity (date);

-- DROP SCHEMA public CASCADE;
-- CREATE SCHEMA public;
-- GRANT ALL ON SCHEMA public TO postgres;
-- GRANT ALL ON SCHEMA public TO public;