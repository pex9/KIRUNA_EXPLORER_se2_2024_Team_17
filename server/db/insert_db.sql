
/*
    This file is used to insert some data into the database.
    It is used to test the application.
*/

INSERT INTO User (Email, PasswordHash, Salt, Role, Name, Surname)
VALUES ('mario@test.it', '15d3c4fca80fa608dcedeb65ac10eff78d20c88800d016369a3d2963742ea288', '72e4eeb14def3b21', 'Urban Planner', 'Mario', 'Test');

INSERT INTO User (Email, PasswordHash, Salt, Role, Name, Surname)
VALUES ('marco@test.it', '15d3c4fca80fa608dcedeb65ac10eff78d20c88800d016369a3d2963742ea288', '72e4eeb14def3b21', 'Visitor', 'Marco', 'Test');


