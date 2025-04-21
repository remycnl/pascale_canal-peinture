-- Étape 1 : Créer le type ENUM
CREATE TYPE "ArtTag" AS ENUM ('ANIMAL', 'PERSONNAGE', 'PAYSAGE', 'COMMANDE_PERSONNALISEE');

-- Étape 2 : Ajouter une nouvelle colonne temporaire du type ENUM
ALTER TABLE "Painting" ADD COLUMN "tag_tmp" "ArtTag";

-- Étape 3 : Copier les anciennes valeurs dedans (à condition qu'elles soient valides !)
-- Assure-toi que les anciennes valeurs sont bien dans la liste ENUM, sinon cette commande échouera.
UPDATE "Painting" SET "tag_tmp" = tag::"ArtTag";

-- Étape 4 : Supprimer l'ancienne colonne de type String
ALTER TABLE "Painting" DROP COLUMN "tag";

-- Étape 5 : Renommer la colonne temporaire pour garder le nom original
ALTER TABLE "Painting" RENAME COLUMN "tag_tmp" TO "tag";
