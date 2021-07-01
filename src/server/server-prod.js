import path from 'path'
import express from 'express'
import { spawn } from 'child_process'


const app = express(),
            DIST_DIR = __dirname,
            HTML_FILE = path.join(DIST_DIR, 'index.html')


app.use(express.static(DIST_DIR))

// create a GET route
app.get('/express_backend', (body, res, next) => {
    res.sendFile(HTML_FILE)

    var cmd = (process.platform === 'win32') ? '' : 'sh';
    var directory = (process.platform === 'win32') ? ['C:\data\Projects\docker-cmd\script.bat'] : ['/data/Projects/docker-cmd/script.sh'];      
    console.log('cmd:', cmd);

    let child = spawn(cmd, directory);
    
    child.stdout.on('data', function (data) {
    console.log('stdout: ' + data);
    });
    
    child.stderr.on('data', function (data) {
    console.log('stderr: ' + data);
    });
    
    child.on('close', function (code) {
    console.log('child process exited with code ' + code);
    });
    
    res.send('Script is running');
})

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
    console.log(`App listening to ${PORT}....`)
    console.log('Press Ctrl+C to quit.')
})