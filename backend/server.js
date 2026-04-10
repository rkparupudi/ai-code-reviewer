require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { reviewCode } = require('./reviewer');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50kb' }));
app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/review', async (req, res) => {
  const { code, language } = req.body;

  if (!code || !code.trim()) {
    return res.status(400).json({ error: 'Code is required' });
  }

  if (!['java', 'javascript'].includes(language?.toLowerCase())) {
    return res.status(400).json({ error: 'Language must be java or javascript' });
  }

  if (code.length > 5000) {
    return res.status(400).json({ error: 'Code must be under 5000 characters' });
  }

  try {
    const review = await reviewCode(code, language);
    res.json({ success: true, review });
  } catch (error) {
    console.error('Review error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});