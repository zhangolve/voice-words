CREATE TABLE words (
        id SERIAL PRIMARY KEY,
        word VARCHAR(255) NOT NULL UNIQUE,
        translations VARCHAR(255)[] NOT NULL,
        note TEXT,
        due_date bigint,
        sentence TEXT,
        period INTEGER,
        audio VARCHAR(255)
    );