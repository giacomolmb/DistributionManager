/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
 import path from 'path';
 import { app, BrowserWindow, shell, ipcMain, dialog } from 'electron';
 import { autoUpdater } from 'electron-updater';
 import log from 'electron-log';
 import MenuBuilder from './menu';
 import { resolveHtmlPath } from './util';
 import { findAllPersons, findAssociation, findPerson, findPersonById, getLocations, insertPerson, getReferents, getAllAssociations, getAssociation, getLocation, insertReferent, insertLocation, addIntervention, insertAssociation, updatePerson, getIntervention, deleteIntervention, insertFamilyMember, createProject, getAllProjects, getProject, searchProject, bulkInsertPersons } from './db/dbcontroller';
 import { sequelize } from './db/dbconfig';
import { readPersons } from './csv/csvmodule';
 
 class AppUpdater {
   constructor() {
     log.transports.file.level = 'info';
     autoUpdater.logger = log;
     autoUpdater.checkForUpdatesAndNotify();
   }
 }
 
 let mainWindow: BrowserWindow | null = null;
 
 ipcMain.handle('test-invoke', async (event, args) => {
   const persons = await findAllPersons();
   return persons;
 })
 
 ipcMain.handle('insert-person', async (event, args) => {
   const newPerson = await insertPerson(args.person);
   return newPerson;
 })
 
 ipcMain.handle('insert-family-member', async (event, args) => {
   const newFamilyMember = await insertFamilyMember(args.familyMember);
   return newFamilyMember;
 })
 
 ipcMain.handle('update-person', async (event, args) => {
   const updatedPerson = await updatePerson(args.person, args.id);
   return updatedPerson;
 })
 
 ipcMain.handle('search-person', async (event, args) => {
   const searchResult = await findPerson(args.searchText)
   return searchResult;
 })
 
 ipcMain.handle('find-person-by-id', async (event, args) => {
   const result = await findPersonById(args.id)
   return result;
 })
 
 ipcMain.handle('search-association', async (event, args) => {
   const searchResult = await findAssociation(args.searchText)
   return searchResult;
 }) 
 
 ipcMain.handle('get-associations', async () => {
   const result = await getAllAssociations();
   return result;
 })
 
 ipcMain.handle('get-association', async (event, args) => {
   const result = await getAssociation(args.associationId);
   return result;
 })
 
 ipcMain.handle('get-locations', async (event, args) => {
   const result = await getLocations(args.associationId)
   return result;
 })
 
 ipcMain.handle('get-location', async (event, args) => {
   const result = await getLocation(args.locationId)
   return result;
 })
 
 ipcMain.handle('insert-association', async (event, args) => {
   const result = await insertAssociation(args.association)
   return result;
 })
 
 ipcMain.handle('insert-location', async (event, args) => {
   const result = await insertLocation(args.location)
   return result;
 })
 
 ipcMain.handle('get-referents', async (event, args) => {
   const result = await getReferents(args.locationId)
   return result;
 })
 
 ipcMain.handle('insert-referent', async (event, args) => {
   const result = await insertReferent(args.referent)
   return result;
 })
 
 ipcMain.handle('add-intervention', async (event, args) => {
   const result = await addIntervention(args.intervention)
   return result
 })
 
 ipcMain.handle('get-intervention', async (event, args) => {
   const result = await getIntervention(args.interventionId)
   return result
 })
 
 ipcMain.handle('delete-intervention', async (event, args) => {
   const result = await deleteIntervention(args.interventionId)
   return result
 })

 ipcMain.handle('create-project', async (event, args) => {
   const result = await createProject(args.project)
   return result
 })

 ipcMain.handle('get-projects', async () => {
   const result = await getAllProjects()
   return result
 })

 ipcMain.handle('get-project', async (event, args) => {
  const result = await getProject(args.projectId)
  return result
 })

 ipcMain.handle('search-project', async (event, args) => {
  const result = await searchProject(args.searchText)
  return result
 })

 ipcMain.handle('import-persons', async (event, args) => {
  return readPersons(args.filename)
    .then(newPersons => bulkInsertPersons(newPersons));
 })
 
 if (process.env.NODE_ENV === 'production') {
   const sourceMapSupport = require('source-map-support');
   sourceMapSupport.install();
 }
 
 const isDebug =
   process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';
 
 if (isDebug) {
   require('electron-debug')();
 }
 
 const installExtensions = async () => {
   const installer = require('electron-devtools-installer');
   const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
   const extensions = ['REACT_DEVELOPER_TOOLS'];
 
   return installer
     .default(
       extensions.map((name) => installer[name]),
       forceDownload
     )
     .catch(console.log);
 };
 
 const createWindow = async () => {
   if (isDebug) {
     await installExtensions();
   }
 
   const RESOURCES_PATH = app.isPackaged
     ? path.join(process.resourcesPath, 'assets')
     : path.join(__dirname, '../../assets');
 
   const getAssetPath = (...paths: string[]): string => {
     return path.join(RESOURCES_PATH, ...paths);
   };
 
   mainWindow = new BrowserWindow({
     show: false,
     width: 1024,
     height: 728,
     icon: getAssetPath('icon.png'),
     webPreferences: {
       sandbox: false,
       preload: app.isPackaged
         ? path.join(__dirname, 'preload.js')
         : path.join(__dirname, '../../.erb/dll/preload.js'),
       contextIsolation: true,
     },
   });
 
   mainWindow.loadURL(resolveHtmlPath('index.html'));
 
   mainWindow.on('ready-to-show', () => {
     if (!mainWindow) {
       throw new Error('"mainWindow" is not defined');
     }
     if (process.env.START_MINIMIZED) {
       mainWindow.minimize();
     } else {
       mainWindow.show();
     }
   });
 
   mainWindow.on('closed', () => {
     mainWindow = null;
   });
 
   const menuBuilder = new MenuBuilder(mainWindow);
   menuBuilder.buildMenu();
 
   // Open urls in the user's browser
   mainWindow.webContents.setWindowOpenHandler((edata) => {
     shell.openExternal(edata.url);
     return { action: 'deny' };
   });
 
   // Remove this if your app does not use auto updates
   // eslint-disable-next-line
   new AppUpdater();
 };
 
 /**
  * Add event listeners...
  */
 
 app.on('window-all-closed', () => {
   // Respect the OSX convention of having the application in memory even
   // after all windows have been closed
   if (process.platform !== 'darwin') {
     app.quit();
   }
 });
 
 app
   .whenReady()
   .then(() => {
     sequelize.authenticate()
       .then(() => {
         console.log('Database connected...')
         createWindow();
         app.on('activate', () => {
           // On macOS it's common to re-create a window in the app when the
           // dock icon is clicked and there are no other windows open.
           if (mainWindow === null) createWindow();
         });
       })
       .catch((err: any) => {
        const messageBoxOptions = {
          type: "error",
          title: "Error in Main process",
          message: "Error: " + err
        };
        dialog.showMessageBoxSync(messageBoxOptions);
        app.exit(1);
       })
   })
   .catch(console.log);
 