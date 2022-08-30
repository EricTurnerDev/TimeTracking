import { app } from 'electron';
import serve from 'electron-serve';
import { createWindow } from './helpers';
import * as db from './lib/database';
import path from "path";

const isProd: boolean = process.env.NODE_ENV === 'production';

if (isProd) {
  serve({ directory: 'app' });
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`);
}

(async () => {
  await app.whenReady();

  // Create the sqlite database if it doesn't exist, and register listeners to handle requests from the renderer process.
  try {
    const dbLocation = path.join(app.getPath('userData'), 'timetracking.sqlite');
    await db.initialize(dbLocation);
    db.listen();
  } catch (err) {
    console.error(err);
  }

  const mainWindow = createWindow('main', {
    width: 1000,
    height: 600,
  });

  if (isProd) {
    await mainWindow.loadURL('app://./home.html');
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    mainWindow.webContents.openDevTools();
  }
})();

app.on('window-all-closed', () => {
  app.quit();
});
