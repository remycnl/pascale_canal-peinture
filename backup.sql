CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
    "id"                    TEXT PRIMARY KEY NOT NULL,
    "checksum"              TEXT NOT NULL,
    "finished_at"           DATETIME,
    "migration_name"        TEXT NOT NULL,
    "logs"                  TEXT,
    "rolled_back_at"        DATETIME,
    "started_at"            DATETIME NOT NULL DEFAULT current_timestamp,
    "applied_steps_count"   INTEGER UNSIGNED NOT NULL DEFAULT 0
);
INSERT INTO _prisma_migrations VALUES('4a3695ca-dd98-4e39-b6a2-ff3b2501a272','09da426a2d4e8b3d82f9c7470820314686adf1a6b20ba9cbfd897e7f77a15193',1736643283614,'20250112005443_update_painting',NULL,NULL,1736643283527,1);
INSERT INTO _prisma_migrations VALUES('c5b408fe-9658-4ca0-9b73-4ca40dbf445c','60549b888e4bc68be5014f545611c983615ccb2eb11cb635d74ae4537dae116b',1736781543382,'20250113151903_update_painting_model',NULL,NULL,1736781543204,1);
CREATE TABLE IF NOT EXISTS "Painting" (
    "id" INTEGER NOT NULL PRIMARY KEY SERIAL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "price" DECIMAL NOT NULL,
    "image" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "state" TEXT NOT NULL DEFAULT 'FOR_SALE',
    "slug" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "width" DECIMAL NOT NULL,
    "height" DECIMAL NOT NULL,
    "paintingType" TEXT NOT NULL
);
INSERT INTO Painting VALUES(1,'Léon','Vache de race Aubrac.',1736726400000,320,'/paintings/1736784476865-yo716n.jpg','Vache','FOR_SALE','leon','Pascale Canal',150,163,'Peinture sur toile');
INSERT INTO Painting VALUES(3,'Bernadette','Vache de race Aubrac',1736726400000,230,'/paintings/1736784492896-twm0oh.jpg','Vache','FOR_SALE','bernadette','Pascale Canal',100,100,'Peinture sur toile');
INSERT INTO Painting VALUES(4,'Elliot','Vache de race Aubrac',1736726400000,300,'/paintings/1736784505524-yc4y5f.jpg','Vache','FOR_SALE','elliot','Pascale Canal',100,91,'Peinture sur toile');
INSERT INTO Painting VALUES(5,'Luidgi','Vache de race Aubrac',1736726400000,300,'/paintings/1736784522168-dnkm85.jpg','Vache','FOR_SALE','luidgi','Pascale Canal',100,100,'Peinture sur toile');
INSERT INTO Painting VALUES(6,'Marguerite','Vache de race Aubrac',1736726400000,400,'/paintings/1736784537081-rbdu6.jpg','Vache','FOR_SALE','marguerite','Pascale Canal',100,100,'Peinture sur toile');
INSERT INTO Painting VALUES(7,'Rémy','Vache de race Aubrac',1736726400000,500,'/paintings/1736784558701-c83bsr.jpg','Vache','SOLD','remy','Pascale Canal',200,200,'Peinture sur toile');
INSERT INTO Painting VALUES(8,'Romuald','Vache de race Aubrac',1736726400000,300,'/paintings/1736784572445-j39j7vn.jpg','Vache','FOR_SALE','romuald','Pascale Canal',100,100,'Peinture sur toile');
INSERT INTO Painting VALUES(9,'Sylvie','Vache de race Aubrac',1736726400000,400,'/paintings/1736784585544-kip6v4.jpg','Vache','FOR_SALE','sylvie','Pascale Canal',500,500,'Peinture sur toile');
INSERT INTO Painting VALUES(10,'Axel','Vache de race Aubrac',1736726400000,2500,'/paintings/1736784621181-u0cbt2.jpg','Vache','FOR_SALE','axel','Pascale Canal',250,244,'Peinture sur toile');
INSERT INTO Painting VALUES(11,'Marion','Vache de type Aubrac bbbbbbb',1736812800000,350,'/paintings/1736784641346-gqtmzg.jpg','Vache','FOR_SALE','marion','Pascale Canal',100,93,'Peinture sur toile');
INSERT INTO Painting VALUES(12,'Jean-Christophe','Vache de type Aubrac',1736726400000,3000,'/paintings/1736784656493-htc26.jpg','Vache','FOR_SALE','jean-christophe','Pascale Canal',400,400,'Peinture sur toile');
INSERT INTO Painting VALUES(13,'Punky','Vache de type pas Aubrac',1736726400000,2000,'/paintings/1736784667324-pmmyb.jpg','Vache','SOLD','punky','Pascale Canal',200,200,'Peinture sur toile');
CREATE UNIQUE INDEX "Painting_slug_key" ON "Painting"("slug");
