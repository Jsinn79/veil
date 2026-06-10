import { createApp } from './app.js';
import { config } from './config/index.js';

const app = createApp();

app.listen(config.port, '0.0.0.0', () => {
  console.log(`🚀 Veil API running on http://0.0.0.0:${config.port}`);
  console.log(`   Environment: ${config.nodeEnv}`);
  console.log(`   Frontend URL: ${config.frontendUrl}`);
});