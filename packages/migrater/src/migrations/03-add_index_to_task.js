module.exports = {
  up: async (executeStatement, transactionId) => {
    await executeStatement(
      `
CREATE INDEX \`keyword_index\` ON \`Task\`(\`title\`, \`description\`);`,
      transactionId
    ).then((result) => console.log(result));
  },
  down: async (executeStatement, transactionId) => {},
};
