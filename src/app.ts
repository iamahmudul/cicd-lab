import express from 'express';
import path from 'node:path';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const app = express();
const appDirectory = fileURLToPath(new URL('.', import.meta.url));
const publicDirectory = existsSync(path.join(appDirectory, 'public'))
  ? path.join(appDirectory, 'public')
  : path.join(appDirectory, '../public');

app.set('view engine', 'ejs');
app.set('views', path.join(appDirectory, 'views'));
app.use(express.static(publicDirectory));

app.get('/', (_request, response) => {
  response.render('index', {
    version: process.env.APP_VERSION ?? 'development',
  });
});

app.get('/api/health', (_request, response) => {
  response.json({
    status: 'ok',
  });
});

export default app;
