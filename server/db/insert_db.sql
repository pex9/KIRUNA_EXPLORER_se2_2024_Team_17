
/*
    This file is used to insert some data into the database.
    It is used to test the application.
*/

INSERT INTO User (Email, PasswordHash, Salt, Role, Name, Surname)
VALUES ('mario@test.it', '15d3c4fca80fa608dcedeb65ac10eff78d20c88800d016369a3d2963742ea288', '72e4eeb14def3b21', 'Urban Planner', 'Mario', 'Test');

INSERT INTO User (Email, PasswordHash, Salt, Role, Name, Surname)
VALUES ('marco@test.it', '15d3c4fca80fa608dcedeb65ac10eff78d20c88800d016369a3d2963742ea288', '72e4eeb14def3b21', 'Visitor', 'Marco', 'Test');

/*
    insertion of stakeholders and their colors
*/
INSERT INTO Stakeholder (Name, Color) VALUES ('LKAB', '#000000');
INSERT INTO Stakeholder (Name, Color) VALUES ('Municipality', '#8C6760');
INSERT INTO Stakeholder (Name, Color) VALUES ('Norrbotten Country', '#702F36');
INSERT INTO Stakeholder (Name, Color) VALUES ('Architecture firms', '#B6AD9D');
INSERT INTO Stakeholder (Name, Color) VALUES ('Citizens', '#B3D0D3');
INSERT INTO Stakeholder (Name, Color) VALUES ('Others', '#8A9FA4');

/*
    insertion of types of document
*/
INSERT INTO TypeDocument (IconSrc,Type) VALUES ('design_doc.svg','Design doc');
INSERT INTO TypeDocument (IconSrc,Type) VALUES ('informative_doc.svg','Informative doc');
INSERT INTO TypeDocument (IconSrc,Type) VALUES ('prescriptive_doc.svg','Prescriptive doc');
INSERT INTO TypeDocument (IconSrc,Type) VALUES ('technical_doc.svg','Technical doc');
INSERT INTO TypeDocument (IconSrc,Type) VALUES ('agreement.svg','Agreement ');
INSERT INTO TypeDocument (IconSrc,Type) VALUES ('conflict.svg','Conflict ');
INSERT INTO TypeDocument (IconSrc,Type) VALUES ('consulation.svg','Consultation ');
INSERT INTO TypeDocument (IconSrc,Type) VALUES ('action.svg','Action');
