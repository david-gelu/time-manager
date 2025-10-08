// api/index.ts
const app = require('../backend/dist/serverless').default || require('../backend/dist/serverless');

export default app;