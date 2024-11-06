
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


/*
    insertion of connections
*/
select * from Connection;
INSERT INTO Connection (Type,Description) VALUES ('Collateral Consequence','This type of connection between nodes occurs when a node
has an unforeseen impact that leads to the creation of a document or action.');
INSERT INTO Connection (Type,Description) VALUES ('Direct Consequence','Direct consequence is the most common type of connection
between nodes and appears whenever a document explicitly anticipates the creation
of another document or subsequent action');
INSERT INTO Connection (Type,Description) VALUES ('Projection',': This is a type of connection between nodes that is similar to a direct consequence, but the generating document (or more commonly, the material effect)
precedes the resulting document');
INSERT INTO Connection (Type,Description) VALUES ('Update','This type of node connection, which, as the name suggests, simply connects
two documents that perform the same function but succeed each other over time,
like the various deformation forecasts.');

/*
    insertion of documents
*/

INSERT INTO Location (Location_Type, Latitude, Longitude, Area_Coordinates)
VALUES (
    'Area', 
    (67.8780 + 67.8372 + 67.8282 + 67.8479 + 67.8631) / 5, 
    (20.1944 + 20.2436 + 20.2895 + 20.3539 + 20.2598) / 5, 
    '[ [67.8780, 20.1944], [67.8372, 20.2436], [67.8282, 20.2895], [67.8479, 20.3539], [67.8631, 20.2598] ]'
);

