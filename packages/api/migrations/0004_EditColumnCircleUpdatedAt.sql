-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_circles" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "eventId" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "spaceNumber" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'None',
    "updatedAt" DATETIME,
    CONSTRAINT "circles_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_circles" ("code", "eventId", "id", "name", "spaceNumber", "status", "updatedAt") SELECT "code", "eventId", "id", "name", "spaceNumber", "status", "updatedAt" FROM "circles";
DROP TABLE "circles";
ALTER TABLE "new_circles" RENAME TO "circles";
CREATE UNIQUE INDEX "circles_code_key" ON "circles"("code");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
