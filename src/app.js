const express = require('express');
const axios = require('axios');
const _ = require('lodash');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Simple API endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Vulnerable App (for security scanning practice)',
    version: '1.0.0',
    status: 'running'
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// Sample data endpoint
app.get('/api/users', (req, res) => {
  const users = [
    { id: 1, name: 'Alice', role: 'admin' },
    { id: 2, name: 'Bob', role: 'user' },
    { id: 3, name: 'Charlie', role: 'user' }
  ];

  // Using lodash (has known vulnerabilities in this version)
  const filtered = _.filter(users, user => user.role === 'user');

  res.json(filtered);
});

// External API call endpoint
app.get('/api/external', async (req, res) => {
  try {
    // Using axios (has known vulnerabilities in this version)
    const response = await axios.get('https://jsonplaceholder.typicode.com/posts/1');
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'External API call failed' });
  }
});

app.listen(port, () => {
  console.log(`Vulnerable app listening at http://localhost:${port}`);
  console.log('Note: This app intentionally uses vulnerable dependencies for security scanning practice');
});
