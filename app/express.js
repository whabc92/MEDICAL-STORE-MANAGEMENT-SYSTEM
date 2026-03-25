const express = require('express');
const session = require('express-session');
const path = require('path');
const { router: indexRoutes } = require('./routes/Index.js');
const { router: mainRoutes } = require('./routes/Main.js');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json({ limit: '1mb' }));

app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: true
}));

app.use('/', indexRoutes);
app.use('/main', mainRoutes);


app.use((error, req, res, next) => {
  console.error(`[${new Date().toISOString()}] Error:`, error.stack);
  res.status(500).json({ status: 'error', message: 'Something went wrong!' });
});

app.use((req, res) => {
  res.status(404).json({ status: 'error', message: 'Resource not found' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});