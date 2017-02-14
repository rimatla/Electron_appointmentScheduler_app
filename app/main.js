const electron = require('electron');
const BrowserWindow = electron.BrowserWindow;
const app = electron.app;
const ipc = electron.ipcMain;
const Menu = electron.Menu;
let myAppMenu, menuTemplate;

//toggleWindow ()
function toggleWindow(whichWindow) {
    if (whichWindow.isVisible()) {
        whichWindow.hide();
    } else {
        whichWindow.show();
    }
}

app.on('ready', function(){

    let appWindow, infoWindow;

    // set up our regular app window to have an element in it that automatically hides it
    appWindow = new BrowserWindow({
        show:false
    });

    //load index.html from app folder
    appWindow.loadURL('file://' + __dirname + '/index.html');


    //customize window
    infoWindow = new BrowserWindow({
        width:400,
        height:300,
        transparent: true,
        show:false,
        frame: false

    });

    //use the Node.js dirname constant into a string that calls a specific file
    infoWindow.loadURL('file://' + __dirname + '/info.html');

    //do this event only once
    appWindow.once('ready-to-show', function(){
        //display this window that is currently hidden
        appWindow.show();
    });

    //close window
    ipc.on('closeInfoWindow', function(event,arg){
        event.returnValue= '';
        infoWindow.hide();
    });

    //open
    ipc.on('openInfoWindow', function(event,arg){
        event.returnValue= '';
        infoWindow.show();
    });

    //custom menus
    menuTemplate = [
        {
            label: 'myOrders',
            submenu: [
                {
                    label: 'About this App',
                    accelerator: process.platform === 'darwin' ? 'Command+I': 'Ctrl+I',
                    click(item) { toggleWindow(infoWindow)}
                },
                {
                    label: 'Add Appointment',
                    accelerator: process.platform === 'darwin' ? 'Command+N':'Ctrl+N',
                    click(item,focusedWindow) {
                        if (focusedWindow) focusedWindow.webContents.send('addAppointment');
                    }
                },
                {
                    label: 'Add Appointment',
                    accelerator: process.platform === 'darwin' ? 'Command+N':'Ctrl+N',
                    click(item,focusedWindow) {
                        if (focusedWindow) focusedWindow.webContents.send('addAppointment');
                    }
                },
                {
                    role: 'help',
                    label: 'Our Website',
                    click() {electron.shell.openExternal('http://altamircoelho.com')}

                },
                {role: 'close'},
                {role: 'quit'},
            ]
        },
        {
            label: 'Edit',
            submenu: [
                {role: 'undo'},
                {role: 'redo'},
                {role: 'cut'},
                {role: 'copy'},
                {role: 'paste'},
                {role: 'selectall'},
            ]
        },
        {
            label: 'View',
            submenu: [
                {
                    label: 'Reload',
                    accelerator: 'CmdOrCtrl+R',
                    click (item, focusedWindow) {
                        if (focusedWindow) focusedWindow.reload()
                    }
                },
                {
                    label: 'Toggle Developer Tools',
                    accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
                    click (item, focusedWindow) {
                        if (focusedWindow) focusedWindow.webContents.toggleDevTools()
                    }
                },
                {type: 'separator'},
                {role: 'resetzoom'},
                {role: 'zoomin'},
                {role: 'zoomout'},
                {type: 'separator'},
                {role: 'togglefullscreen'}
            ]
        },
    ];

    myAppMenu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(myAppMenu);


});//app is ready

//http://electron.atom.io/docs/api/menu/
//ps darwin means if it is a iOS otherwise, windows...