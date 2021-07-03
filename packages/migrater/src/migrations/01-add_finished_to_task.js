module.exports = {
  up: async (executeStatement, transactionId) => {
    await executeStatement(
      `
ALTER TABLE \`Task\` ADD COLUMN \`finished\` BOOLEAN NOT NULL DEFAULT false;`,
      transactionId
    ).then((result) => console.log(result));
  },
  down: async (executeStatement, transactionId) => {},
};
