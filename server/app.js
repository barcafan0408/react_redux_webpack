import express from 'express';
import path from 'path';

const PORT = process.env.PORT || 8080;

const app = express();

app.use(express.static(path.join(__dirname, '../build')));

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../src/index.html'));
});

const server = app.listen(PORT, () => {
    console.log(`Server is up and running on port ${PORT}`);
});

module.exports = app;