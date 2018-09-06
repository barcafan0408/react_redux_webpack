const express = require('express');
const path = require('path');

const PORT = process.env.PORT || 8080;

const app = express();

app.get('/', (req, res) => {
 res.sendFile(path.resolve(__dirname, '../public/index.html'));
});

app.use('/public/build', express.static(path.join(__dirname, '../public/build')));

const server = app.listen(PORT, () => {
    console.log(`Server is up and running on port ${PORT}`);
});

module.exports = app;