module.exports = {
  up: async (executeStatement, transactionId) => {
    await executeStatement(
      `
ALTER TABLE \`User\` ADD COLUMN \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN \`updatedAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);`,
      transactionId
    ).then((result) => console.log(result));

    await executeStatement(
      `
ALTER TABLE \`User\` ALTER COLUMN \`updatedAt\` DROP DEFAULT;`,
      transactionId
    ).then((result) => console.log(result));
  },
  down: async (executeStatement, transactionId) => {},
};
