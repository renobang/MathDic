CREATE TABLE IF NOT EXISTS examples (
 id TEXT PRIMARY KEY, prompt TEXT NOT NULL, latex TEXT NOT NULL, explanation TEXT NOT NULL,
 revision INTEGER NOT NULL, updated_at TEXT NOT NULL, updated_by TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS example_history (
 sequence INTEGER PRIMARY KEY AUTOINCREMENT, id TEXT NOT NULL, prompt TEXT NOT NULL,
 latex TEXT NOT NULL, explanation TEXT NOT NULL, revision INTEGER NOT NULL,
 updated_at TEXT NOT NULL, updated_by TEXT NOT NULL
);
CREATE TRIGGER IF NOT EXISTS examples_created AFTER INSERT ON examples BEGIN
 INSERT INTO example_history(id,prompt,latex,explanation,revision,updated_at,updated_by)
 VALUES(NEW.id,NEW.prompt,NEW.latex,NEW.explanation,NEW.revision,NEW.updated_at,NEW.updated_by);
END;
CREATE TRIGGER IF NOT EXISTS examples_updated AFTER UPDATE ON examples BEGIN
 INSERT INTO example_history(id,prompt,latex,explanation,revision,updated_at,updated_by)
 VALUES(NEW.id,NEW.prompt,NEW.latex,NEW.explanation,NEW.revision,NEW.updated_at,NEW.updated_by);
END;
