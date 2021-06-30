import path from 'path'
import express from 'express'
import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import config from '../../webpack.dev.config.js'
import { spawn } from 'child_process'

const PORT = process.env.PORT || 8080

const app = express(),
            DIST_DIR = __dirname,
            HTML_FILE = path.join(DIST_DIR, 'index.html'),
            compiler = webpack(config)

app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath
}))

app.use(webpackHotMiddleware(compiler))

app.listen(PORT, () => {
  console.log(`App listening to ${PORT}....`)
  console.log('Press Ctrl+C to quit.')
})

app.get('*', (req, res, next) => {
  compiler.outputFileSystem.readFile(HTML_FILE, (err, result) => {
  if (err) {
    return next(err)
  }
  res.set('content-type', 'text/html')
  res.send(result)
  res.end()
  })
})

// create a GET route
// app.get('/express_backend', (body, res, next) => {
//     compiler.outputFileSystem.readFile(HTML_FILE, (err, result) => {
//       if (err) {
//         return next(err)
//       }
//       res.set('content-type', 'text/html')
//       res.send(result)
//       res.end()
//       })

//   // open EnergyPlus Programm with a specific file which is stored localy
//   let child = spawn(
//   '/data/Projects/docker-cmd/web/start.sh'
//    );
  
//   child.stdout.on('data', function (data) {
//   console.log('stdout: ' + data);
//   });
  
//   child.stderr.on('data', function (data) {
//   console.log('stderr: ' + data);
//   });
  
//   child.on('close', function (code) {
//   console.log('child process exited with code ' + code);
//   });
  
//   res.send('EnergyPlus is running');
//   })




