import app from "./serverless";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Backend running locally on ${PORT}`);
});
