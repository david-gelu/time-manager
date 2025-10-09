import app from '../backend/dist/serverless';

// Add error handling middleware
app.use((err: Error, req: any, res: any, next: any) => {
  console.error('API Error:', err);
  res.status(500).json({
    error: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

export default app;