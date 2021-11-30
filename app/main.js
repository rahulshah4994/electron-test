const {app, BrowserWindow} = require('electron')

app.on('ready', () => {
    const window = new BrowserWindow(
        {webPreferences:{
            preload: __dirname + "/preload.js"
        }}
    )

    window.loadFile(__dirname + "/index.html")
    
})