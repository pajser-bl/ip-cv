SET
search_path TO ip_cv;
--  ==============================
--  Seed administrators
--  ==============================
INSERT INTO administrators (keycloak_id, full_name, email, active)
VALUES ('00000000-0000-0000-0000-000000000000', 'Admin',
        'admin@ipcv.com', TRUE) ON CONFLICT DO NOTHING;

--  ==============================
--  Seed students
--  ==============================
INSERT INTO students (keycloak_id, full_name, email, active, created_by)
VALUES
    ('00000000-0000-0000-0000-000000000001', 'Marko Markovic',
        'marko.markovic@ipcv.com', TRUE,
        (SELECT id FROM administrators WHERE email = 'admin@ipcv.com')),
    ('00000000-0000-0000-0000-000000000002', 'Petar Petrovic',
        'petar.petrovic@ipcv.com', TRUE,
        (SELECT id FROM administrators WHERE email = 'admin@ipcv.com')),
    ('00000000-0000-0000-0000-000000000003', 'Jovan Jovanovic',
        'jovan.jovanovic@ipcv.com', TRUE,
        (SELECT id FROM administrators WHERE email = 'admin@ipcv.com')),
    ('00000000-0000-0000-0000-000000000004', 'Milos Milosevic',
        'milos.milosevic@ipcv.com', TRUE,
        (SELECT id FROM administrators WHERE email = 'admin@ipcv.com'))
    ON CONFLICT DO NOTHING;

--  ==============================
--  Seed companies
--  ==============================
INSERT INTO companies (keycloak_id, name, email, active, approved, created_by)
VALUES
    ('00000000-0000-0000-0000-000000000005', 'Fat Cat',
        'admin@fat-cat.net', TRUE, TRUE,
        (SELECT id FROM administrators WHERE email = 'admin@ipcv.com')),
    ('00000000-0000-0000-0000-000000000006', 'Aurora',
        'admin@aurora.com', TRUE, TRUE,
        (SELECT id FROM administrators WHERE email = 'admin@ipcv.com'))
