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
VALUES ('00000000-0000-0000-0000-000000000001', 'Marko Markovic',
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
        (SELECT id FROM administrators WHERE email = 'admin@ipcv.com')) ON CONFLICT DO NOTHING;

--  ==============================
--  Seed companies
--  ==============================
INSERT INTO companies (keycloak_id, name, email, active, approved, created_by)
VALUES ('00000000-0000-0000-0000-000000000005', 'Fat Cat',
        'admin@fat-cat.net', TRUE, TRUE,
        (SELECT id FROM administrators WHERE email = 'admin@ipcv.com')),
       ('00000000-0000-0000-0000-000000000006', 'Aurora',
        'admin@aurora.com', TRUE, TRUE,
        (SELECT id FROM administrators WHERE email = 'admin@ipcv.com'));

--  ==============================
--  Seed internships
--  ==============================
INSERT INTO internships (company_id, title, description, technologies, start_date, end_date, additional_requirements,
                         active)
VALUES ((SELECT id FROM companies WHERE name = 'Fat Cat'),
        'Backend Developer Intern',
        'You will work on real backend services using Spring Boot, PostgreSQL and REST APIs.',
        'Java, Spring, PostgreSQL',
        '2024-01-01',
        '2024-06-30',
        'None',
        TRUE),
       ((SELECT id FROM companies WHERE name = 'Fat Cat'),
        'Database Administrator Intern',
        'You will work on database administration tasks.',
        'PostgreSQL, SQL, Database Administration',
        '2024-01-01',
        '2024-06-30',
        'None',
        TRUE),
       ((SELECT id FROM companies WHERE name = 'Aurora'),
        'Frontend Developer Intern',
        'You will build modern web interfaces using React and TypeScript.',
        'React, TypeScript, CSS',
        '2024-01-01',
        '2024-06-30',
        'None',
        TRUE),
       ((SELECT id FROM companies WHERE name = 'Aurora'),
        'Mobile Developer Intern',
        'You will build mobile applications using React Native.',
        'React Native, JavaScript, Mobile Development',
        '2024-01-01',
        '2024-06-30',
        'None',
        TRUE);

--  ==============================
--  Seed internship applications
--  ==============================
INSERT INTO internship_applications (internship_id, student_id, status, applied_at, decided_at, decision_note)
VALUES ((SELECT id FROM internships WHERE title = 'Backend Developer Intern'),
        (SELECT id FROM students WHERE full_name = 'Marko Markovic'),
        'APPLIED',
        '2024-01-01',
        NULL,
        NULL),
       ((SELECT id FROM internships WHERE title = 'Database Administrator Intern'),
        (SELECT id FROM students WHERE full_name = 'Marko Markovic'),
        'ACCEPTED',
        '2024-01-01',
        '2024-01-02',
        'Accepted'),
       ((SELECT id FROM internships WHERE title = 'Frontend Developer Intern'),
        (SELECT id FROM students WHERE full_name = 'Marko Markovic'),
        'REJECTED',
        '2024-01-01',
        '2024-01-02',
        'Rejected');


