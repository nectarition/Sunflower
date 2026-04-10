-- DropIndex
DROP INDEX "mail_tokens_token_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "mail_tokens";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "oidcSub" TEXT NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_users" ("createdAt", "email", "id", "isAdmin", "name", "oidcSub") SELECT "createdAt", "email", "id", "isAdmin", "name", "oidcSub" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX "users_oidcSub_key" ON "users"("oidcSub");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
