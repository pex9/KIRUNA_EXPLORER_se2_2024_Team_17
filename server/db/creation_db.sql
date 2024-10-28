
CREATE TABLE User (
    IdUser INTEGER PRIMARY KEY AUTOINCREMENT,
    Email VARCHAR(255) UNIQUE NOT NULL,
    PasswordHash VARCHAR(255) NOT NULL,
    Salt VARCHAR(255) NOT NULL,
    Role VARCHAR(255) NOT NULL,
    Name VARCHAR(255),
    Surname VARCHAR(255)
);

CREATE TABLE Stakeholder (
    IdStakeholder INTEGER PRIMARY KEY AUTOINCREMENT,
    Name VARCHAR(255) NOT NULL,
    Color VARCHAR(7)  -- Hex color code like #FFFFFF
);

CREATE TABLE Location (
    IdLocation INTEGER PRIMARY KEY AUTOINCREMENT,
    Location_Type  VARCHAR(255) NOT NULL,
    Latitude DECIMAL(10, 7),  -- for point locations
    Longitude DECIMAL(10, 7), -- for point locations
    Area_Coordinates TEXT  -- for area type locations (array of coordinate pairs)
);

CREATE TABLE TypeDocument (
    IdType INTEGER PRIMARY KEY AUTOINCREMENT,
    IconSrc VARCHAR(255),
    Type VARCHAR(255) NOT NULL
);

CREATE TABLE Document (
    IdDocument INTEGER PRIMARY KEY AUTOINCREMENT,
    Title VARCHAR(255) NOT NULL,
    IdStakeholder INT REFERENCES Stakeholder(IdStakeholder),
    Scale VARCHAR(50),
    Issuance_Date VARCHAR(255),
    Language VARCHAR(50),
    Pages INTEGER,
    Description TEXT,
    IdType INT REFERENCES TypeDocument(IdType),
    IdLocation INT REFERENCES Location(IdLocation)
);
CREATE TABLE Connection (
    IdConnection INTEGER PRIMARY KEY AUTOINCREMENT,
    Type VARCHAR(255) NOT NULL,
    Description TEXT
);
CREATE TABLE DocumentConnection (
    IdConnectionDocuments INTEGER PRIMARY KEY AUTOINCREMENT,
    IdDocument1 INTEGER,
    IdDocument2 INTEGER,
    IdConnection INTEGER,
    FOREIGN KEY (IdDocument1) REFERENCES Document(IdDocument),
    FOREIGN KEY (IdDocument2) REFERENCES Document(IdDocument),
    FOREIGN KEY (IdConnection) REFERENCES Connection(IdConnection)
);