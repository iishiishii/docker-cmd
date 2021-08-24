const routes = require('express').Router();
const { spawn } = require('child_process');


//GET home page.
routes.get("/", function(req, res) {
  console.log('req', req);
    res.render("index", { title: "Express" });
    console.log('end');
  });

// create a GET route
routes.get('/express_backend', (req, res) => {
    res.render("log", { title: "Page 4" });
    // res.sendFile(HTML_FILE)
    console.log('start')
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

module.exports = routes;