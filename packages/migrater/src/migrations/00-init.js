module.exports = {
  up: async (executeStatement, transactionId) => {
    await executeStatement(
      `
CREATE TABLE \`User\` (
    \`id\` INTEGER NOT NULL AUTO_INCREMENT,
    \`sub\` VARCHAR(191) NOT NULL,
    \`name\` VARCHAR(191) NOT NULL,

    UNIQUE INDEX \`User.sub_unique\`(\`sub\`),
    PRIMARY KEY (\`id\`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`,
      transactionId
    ).then((result) => console.log(result));

    await executeStatement(
      `
CREATE TABLE \`Board\` (
    \`id\` INTEGER NOT NULL AUTO_INCREMENT,
    \`title\` VARCHAR(255) NOT NULL,
    \`description\` VARCHAR(191),
    \`authorId\` INTEGER NOT NULL,
    \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    \`updatedAt\` DATETIME(3) NOT NULL,

    PRIMARY KEY (\`id\`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`,
      transactionId
    ).then((result) => console.log(result));

    await executeStatement(
      `
CREATE TABLE \`Task\` (
    \`id\` INTEGER NOT NULL AUTO_INCREMENT,
    \`title\` VARCHAR(255) NOT NULL,
    \`description\` VARCHAR(191),
    \`boardId\` INTEGER NOT NULL,
    \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    \`updatedAt\` DATETIME(3) NOT NULL,

    PRIMARY KEY (\`id\`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`,
      transactionId
    ).then((result) => console.log(result));

    await executeStatement(
      `
ALTER TABLE \`Board\` ADD FOREIGN KEY (\`authorId\`) REFERENCES \`User\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE;`,
      transactionId
    ).then((result) => console.log(result));

    await executeStatement(
      `
ALTER TABLE \`Task\` ADD FOREIGN KEY (\`boardId\`) REFERENCES \`Board\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE;`,
      transactionId
    ).then((result) => console.log(result));
  },
  down: async (executeStatement, transactionId) => {},
};
