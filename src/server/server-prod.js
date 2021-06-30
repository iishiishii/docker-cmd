import path from 'path'
import express from 'express'
import { spawn } from 'child_process'
import cors from 'cors'


const app = express(),
            DIST_DIR = __dirname,
            HTML_FILE = path.join(DIST_DIR, 'index.html')


// app.use(express.static(DIST_DIR))
app.use(cors())

// create a GET route
app.get('/express_backend', (body, res, next) => {
    res.sendFile(HTML_FILE)
  // open EnergyPlus Programm with a specific file which is stored localy
//   var cmd = (process.platform === 'win32') ? '/data/Projects/expack-master/script.bat' : "'sh', ['/data/Projects/expack-master/script.sh']";      
//   console.log('cmd:', cmd);

    // open EnergyPlus Programm with a specific file which is stored localy
    let child = spawn('sh', ['/data/Projects/expack-master/script.sh']);

    
    child.stdout.on('data', function (data) {
    console.log('stdout: ' + data);
    });
    
    child.stderr.on('data', function (data) {
    console.log('stderr: ' + data);
    });
    
    child.on('close', function (code) {
    console.log('child process exited with code ' + code);
    });
    
    res.send('EnergyPlus is running');
})

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
    console.log(`App listening to ${PORT}....`)
    console.log('Press Ctrl+C to quit.')
})