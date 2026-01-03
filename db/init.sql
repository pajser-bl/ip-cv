DROP SCHEMA if EXISTS ip_cv CASCADE;
CREATE SCHEMA ip_cv;

SET
search_path TO ip_cv;

-- ==============================
-- USERS - ADMINISTRATORS
-- ==============================
DROP TABLE IF EXISTS administrators CASCADE;
CREATE TABLE administrators
(
    id          SERIAL PRIMARY KEY,
    keycloak_id UUID         NOT NULL UNIQUE,
    full_name   VARCHAR(50)  NOT NULL,
    email       VARCHAR(100) NOT NULL UNIQUE,
    active      BOOLEAN      NOT NULL DEFAULT TRUE
);

-- ==============================
-- USERS - STUDENTS
-- ==============================
DROP TABLE IF EXISTS students CASCADE;
CREATE TABLE students
(
    id          SERIAL PRIMARY KEY,
    keycloak_id UUID         NOT NULL UNIQUE,
    full_name   VARCHAR(50)  NOT NULL,
    email       VARCHAR(100) NOT NULL UNIQUE,
    active      BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by  INT REFERENCES administrators (id),
    modified_at TIMESTAMP,
    modified_by INT REFERENCES administrators (id)
);

-- ==============================
-- USERS - COMPANIES
-- ==============================
DROP TABLE IF EXISTS companies CASCADE;
CREATE TABLE companies
(
    id          SERIAL PRIMARY KEY,
    keycloak_id UUID         NOT NULL UNIQUE,
    name        VARCHAR(100) NOT NULL,
    email       VARCHAR(100) NOT NULL UNIQUE,
    active      BOOLEAN      NOT NULL DEFAULT TRUE,
    approved    BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by  INT REFERENCES administrators (id),
    modified_at TIMESTAMP,
    modified_by INT REFERENCES administrators (id)
);

CREATE INDEX idx_companies_approved_true ON companies (id) WHERE approved = TRUE;

-- ==============================
-- CV
-- ==============================
DROP TABLE IF EXISTS cvs CASCADE;
CREATE TABLE cvs
(
    id          SERIAL PRIMARY KEY,
    student_id  INT   NOT NULL REFERENCES students (id) ON DELETE CASCADE,
    photo_url   VARCHAR(255),
    basic_info  jsonb NOT NULL DEFAULT '{}'::jsonb,
    education   jsonb NOT NULL DEFAULT '[]'::jsonb,
    experience  jsonb NOT NULL DEFAULT '[]'::jsonb,
    skills      jsonb NOT NULL DEFAULT '[]'::jsonb,
    training    jsonb NOT NULL DEFAULT '[]'::jsonb,
    interests   jsonb NOT NULL DEFAULT '[]'::jsonb,
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_at TIMESTAMP
);

ALTER TABLE cvs
ADD CONSTRAINT cv_student_unique UNIQUE (student_id);

CREATE INDEX idx_cvs_student_id ON cvs (student_id);

-- ==============================
-- STUDENT INTERNSHIPS
-- ==============================
DROP TABLE IF EXISTS internships CASCADE;
CREATE TABLE internships
(
    id                      SERIAL PRIMARY KEY,
    company_id              INT          NOT NULL REFERENCES companies (id),
    title                   VARCHAR(100) NOT NULL,
    description             TEXT         NOT NULL,
    technologies            TEXT,
    start_date              DATE         NOT NULL,
    end_date                DATE,
    additional_requirements TEXT,
    active                  BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at              TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_at             TIMESTAMP
);

CREATE INDEX idx_internships_company_id ON internships (company_id);
CREATE INDEX idx_internships_active_true ON internships (company_id) WHERE active = TRUE;

-- ==============================
-- INTERNSHIP APPLICATIONS
-- ==============================
DROP TABLE IF EXISTS internship_applications CASCADE;
CREATE TABLE internship_applications
(
    id            SERIAL PRIMARY KEY,
    internship_id INT         NOT NULL REFERENCES internships (id),
    student_id    INT         NOT NULL REFERENCES students (id),
    status        VARCHAR(20) NOT NULL, -- 'PENDING','APPROVED','REJECTED'
    applied_at    TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    decided_at    TIMESTAMP,
    decision_note TEXT
);

ALTER TABLE internship_applications
ADD CONSTRAINT internship_student_unique UNIQUE (internship_id, student_id);

ALTER TABLE internship_applications
ADD CONSTRAINT internship_application_status_check CHECK (status IN ('APPLIED', 'ACCEPTED', 'REJECTED'));

CREATE INDEX idx_internship_application_student_id ON internship_applications (student_id);
CREATE INDEX idx_internship_application_internship_id ON internship_applications (internship_id);

-- ==============================
-- WEEKLY DIARY ENTRIES
-- ==============================
DROP TABLE IF EXISTS weekly_diary_entries CASCADE;
CREATE TABLE weekly_diary_entries
(
    id              SERIAL PRIMARY KEY,
    student_id      INT       NOT NULL REFERENCES students (id),
    internship_id   INT       NOT NULL REFERENCES internships (id),
    week_start_date DATE      NOT NULL,
    content         TEXT      NOT NULL,
    comment         TEXT,
    commented_at    TIMESTAMP,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_at     TIMESTAMP
);

ALTER TABLE weekly_diary_entries
ADD CONSTRAINT weekly_diary_entry_unique UNIQUE (student_id, internship_id, week_start_date);

CREATE INDEX idx_weekly_diary_entries_student_id ON weekly_diary_entries (student_id);
CREATE INDEX idx_weekly_diary_entries_internship_id ON weekly_diary_entries (internship_id);

-- ==============================
-- FEEDBACKS
-- ==============================
DROP TABLE IF EXISTS feedbacks CASCADE;
CREATE TABLE feedbacks
(
    id            SERIAL PRIMARY KEY,
    student_id    INT       NOT NULL REFERENCES students (id),
    internship_id INT       NOT NULL REFERENCES internships (id),
    points        INT       NOT NULL,
    comment       TEXT,
    created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by    INT       NOT NULL REFERENCES administrators (id),
    modified_at   TIMESTAMP,
    modified_by   INT REFERENCES administrators (id)
);

ALTER TABLE feedbacks
ADD CONSTRAINT feedback_unique UNIQUE (student_id, internship_id);

