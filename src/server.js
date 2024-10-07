const app = require('./app');
const { connectDatabase , sync } = require('./config/database');
// const { setupCache } = require('./config/cacheManager');

const PORT = process.env.PORT || 3000;

// setupCache();
connectDatabase();
sync();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
