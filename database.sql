CREATE TABLE Message (
    MessageID SERIAL PRIMARY KEY,
    SenderID INT NOT NULL,
    RecipientID INT NOT NULL,
    Content TEXT NOT NULL,
    Timestamp TIMESTAMP DEFAULT NOW(),
    ConversationID INT NOT NULL,
    FOREIGN KEY (SenderID) REFERENCES User(UserID),
    FOREIGN KEY (RecipientID) REFERENCES User(UserID),
    FOREIGN KEY (ConversationID) REFERENCES Conversation(ConversationID)
);

CREATE TABLE Conversation (
    ConversationID SERIAL PRIMARY KEY,
    Subject VARCHAR(255),
    CreateAt TIMESTAMP DEFAULT NOW(),
);


CREATE TABLE BlockedWebste (
    id SERIAL PRIMARY KEY,
    url TEXT NOT NULL,
    added_by INTEGER,
    family_id INTEGER,
    create_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (added_by) REFERENCES User(UserID),
    FOREIGN KEY (family_id) REFERENCES Family(FamilyID)
); 