const routes = require('express').Router();
const { spawn } = require('child_process');
const path=require('path');

//GET home page.
routes.get("/", function(req, res) {
  console.log('req', req);
    res.render("start", { title: "Start Docker Container", instruction: "Press button to start VNM container"});
    console.log('end');
  });

// create a GET route
routes.get('/start', (req, res) => {
    res.render("stop", { title: "Stop Docker Container", instruction: "Press button to stop VNM container"});
    // res.sendFile(HTML_FILE)
    console.log('stop')
    var cmd = (process.platform === 'win32') ? '' : 'sh';
    var directory = (process.platform === 'win32') ? [path.join(__dirname, '/../start.bat')] : [path.join(__dirname, '/../start.sh')];
    console.log('cmd:', cmd);
    console.log('dir', directory);

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

routes.get('/stop', (req, res) => {
  res.render("start", { title: "Start Docker Container", instruction: "Press button to start VNM container"});
  // res.sendFile(HTML_FILE)
  console.log('stop')
  var cmd = (process.platform === 'win32') ? '' : 'sh';
  var directory = (process.platform === 'win32') ? [path.join(__dirname, '/../stop.bat')] : [path.join(__dirname, '/../stop.sh')];      
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
  
  res.send('Script is stopping');
})

module.exports = routes;