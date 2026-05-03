const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.send('OK');
});

// Tasks placeholder route
app.get('/tasks', (req, res) => {
  res.json({ tasks: [] });
});

app.listen(PORT, () => {
  console.log(`TaskManager server running on port ${PORT}`);
});
