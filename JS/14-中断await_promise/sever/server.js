const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  setTimeout(() => {
    res.send('hello world');
  }, 3000);
})

app.listen(port, () => {
  console.log('server is running');
})



