

/*  LICENSE
    
    _This file is Copyright 2018 by the Image Processing and Analysis Group (BioImage Suite Team). Dept. of Radiology & Biomedical Imaging, Yale School of Medicine._
    
    BioImage Suite Web is licensed under the Apache License, Version 2.0 (the "License");
    
    - you may not use this software except in compliance with the License.
    - You may obtain a copy of the License at [http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)
    
    __Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.__
    
    ENDLICENSE */

/* jshint node:true */

"use strict";


const gulp = require('gulp'),
      os = require('os'),
      fs = require('fs'),
      path=require('path'),
      colors=require('colors/safe'),
      rimraf=require('rimraf'),
      es = require('event-stream');

const appinfo=require('./package.json');

// ------------------------------------ A couple of utility functions -------------------------------

const getTime=function() {
    //    http://stackoverflow.com/questions/7357734/how-do-i-get-the-time-of-day-in-javascript-node-js

    let date = new Date();

    let hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    let min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    let sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    return  "[" + hour + ":" + min + ":" + sec +"]";
};


const executeCommand=function(command,dir) {

    const child_process = require('child_process');
    dir = dir || __dirname;
    console.log(getTime()+" "+colors.green(dir+">")+colors.cyan(command+'\n'));

    return new Promise( (resolve,reject) => {

        try {
            let proc=child_process.exec(command, { cwd : dir });
            
            proc.stdout.on('data', (data) => {
                process.stdout.write(colors.yellow(data));
            });
            
            proc.stderr.on('data',  (data) => {
                process.stdout.write(colors.red(data));
            });
            
            proc.on('exit', () => {
                console.log('');
            resolve();
            });
            
        } catch(e) {
            console.log(' error '+e);
            reject(e);
        }
    });
};



var getFileSizeInMB=function(outfile) {

    try {
        let stats = fs.statSync(outfile);
        
        let mb=Math.round(10.0*stats.size/(1024*1024))*0.1;
        let s=`${mb}`;
        let ind=s.lastIndexOf(".");
        
        //        console.log('Raw file size of ',outfile,'=',stats.size,mb,s,'ind =',ind);
        if (ind>=0)
            return s.substr(0,ind+2);
        return s;
    } catch(e) {
        console.log('Error=',e);
        return -1;
    }
};


// --------------------------------------------------------------------------------------------------
// Options 
const options = {
    outdir : "./build/web",
    lintscripts : ['src/*.js','config/*.js','*.js' ],
    name : 'index',
    alljs : [ 'jquery.min.js', 'index_bundle.js'  ],
    allcss : [ 'main.css' ],
    webpackwatch : false,
    debug : true,
    webserver : {
        "root" : path.normalize(__dirname),
        "host" : 'localhost', // change this to '0.0.0.0' to allow remote access
        "port" : '8080',
        'directoryListing': true,
    },
    electronversion : "4.0.1",
};




// --------------------------------------------------------------------------------------------------
// Tasks
//


// - - - - - - - - - - - - - - - - - - - -
// Clean all files in build/web
// - - - - - - - - - - - - - - - - - - - -
gulp.task('clean', (done) => {
    rimraf.sync(options.outdir);
    done();
});

// - - - - - - - - - - - - - - - - - - - -
// Copy static assets and external js files to build/web
// - - - - - - - - - - - - - - - - - - - -
gulp.task('commonfiles', (done) => {
    
    es.concat(
        gulp.src([ 'src/main.css']).pipe(gulp.dest(options.outdir)),
        gulp.src('./node_modules/jquery/dist/jquery.min.js').pipe(gulp.dest(options.outdir)),
    ).on('end', () => {
        let outinfo = { };
        outinfo.name=appinfo.name;
        outinfo.version=appinfo.version;
        outinfo.main='/src/main.js';
        outinfo.license=appinfo.license;
        outinfo.description=appinfo.description;
        outinfo.repository='https://https://github.com/iishiishii/docker-cmd/',
        outinfo["dependencies"]=  {
            "electron-debug": "^1.0.1",
            "glob": "^7.1.1",
            "rimraf": "2.6.2"
        };

        fs.writeFileSync(path.join(__dirname,'build/web/package.json'),JSON.stringify(outinfo,null,2));
        done();
    });
});

// - - - - - - - - - - - - - - - - - - - -
//  Create build/web/index.html by replacing stuff in web/index.html
// - - - - - - - - - - - - - - - - - - - -
gulp.task('mainhtml', (done) => {

    const htmlreplace = require('gulp-html-replace');

    let inputhtml   = path.normalize(path.join(__dirname,'./src/'+options.name+'.html'));
    console.log('\t fixing',inputhtml, '-->', options.outdir);
    
    gulp.src([ inputhtml])
        .pipe(htmlreplace({
            'js': options.alljs,
            'css': options.allcss
        })).pipe(gulp.dest(options.outdir)).on('end', () => {
            done();
        });
});

// - - - - - - - - - - - - - - - - - - - -
//  Set a flag to true that in turn (see below) makes webpack run in 'watch' mode
// - - - - - - - - - - - - - - - - - - - -
gulp.task('webackwatch', (done) => {
    options.webpackwatch=true;
    done();
});

// - - - - - - - - - - - - - - - - - - - -
// Run webpack as external process to compile web/index.js to build/web/index_bundle.js
// - - - - - - - - - - - - - - - - - - - -
gulp.task('webpack', (done) => {


    let cmd='webpack-cli --config '+path.join('config','webpack.config.js');
    if (options.webpackwatch)
        cmd+=" --watch";

    executeCommand(cmd,__dirname).then( () => {
        done();
    }).catch( (e) => {
        process.exit(1);
    });
    
});

// - - - - - - - - - - - - - - - - - - - -
// Start a light web server so we can test
// - - - - - - - - - - - - - - - - - - - -
gulp.task('webserver', (done) => {
    const webserver = require('gulp-webserver');
    console.log(colors.red(getTime()+' server options=',JSON.stringify(options.webserver)));
    return gulp.src('.').pipe(webserver(options.webserver));
});


// - - - - - - - - - - - - - - - - - - - - - - - 
// Run eslint to examine the js code for errors
// - - - - - - - - - - - - - - - - - - - - - - -
gulp.task('eslint',  () => { 
    // ESLint ignores files with "node_modules" paths.
    // So, it's best to have gulp ignore the directory as well.
    // Also, Be sure to return the stream from the task;
    // Otherwise, the task may end before the stream has finished.

    
    const eslint = require('gulp-eslint');
    return gulp.src(options.lintscripts)
    // eslint() attaches the lint output to the "eslint" property
    // of the file object so it can be used by other modules.
        .pipe(eslint({
            "env": {
                "browser": true,
                "node": true,
                "commonjs": true,
                "es6": true
            },
            "extends": "eslint:recommended",
            "parserOptions": {
                "sourceType": "module",
                "ecmaVersion": 2017
            },
            "rules": {
                'no-console': 'off',
                'indent' : 'off',
                "semi": [
                    "error",
                    "always"
                ]
            }
        })).pipe(eslint.format());
});

// - - - - - - - - - - - - - - - - - - - - - - -
// Watch JS code for changes and invoke ESLint
// - - - - - - - - - - - - - - - - - - - - - - -
gulp.task('watch', () => {
    console.log(colors.yellow(getTime()+' Beginning to watch js files',options.lintscripts.join(','),' with eslint'));
    return gulp.watch(options.lintscripts, gulp.series('eslint'));
});

// - - - - - - - - - - - - - - - - - - - - - - - - - 
// Create Electron package from build/web directory
//     store in build/dist
// - - - - - - - - - - - - - - - - - - - - - - - - -
gulp.task('electronpackage', (done) => {

    const indir=path.resolve(__dirname,path.join('build','web'));
    const distdir=path.normalize(path.resolve(__dirname,path.join('build','dist')));
    const gulpzip = require('gulp-zip');
    const platform = os.platform();
    let inwin32=false;
    
    if (platform==='win32') {
        inwin32=true;
    }

    const version=options.electronversion;
    console.log(colors.cyan(getTime()+' Using electron '+version+' for '+platform));


    let name=platform;
    let suffix=".zip";
    if (name==="darwin") {
        name="macos";
        suffix=".app.zip";
    }

    let zipindir=appinfo.name+'-'+name+'-x64';
    let appdir=path.join(distdir,zipindir);
    console.log(colors.red(getTime()+' removing '+appdir));
    rimraf.sync(appdir);

    let modules_dir=path.join(indir,'node_modules');
    console.log(colors.red(getTime()+' removing '+modules_dir));
    rimraf.sync(modules_dir);

    executeCommand('npm install',indir).then( () => {
        // Modules in node_modules have been updated
        // appinfo is package.json!
        let eversion = options.electronversion;
        let cmdline='electron-packager '+indir+' '+appinfo.name+' --arch=x64 --electron-version '+eversion+' --out '+path.resolve(distdir)+' --overwrite --app-version '+appinfo.version;

        executeCommand(cmdline,indir).then( () => {

            let zname=path.resolve(path.join(indir,path.join('..',`dist/${appinfo.name}_${appinfo.version}_${name}.zip`)));
            let basez=path.basename(zname);
            console.log(getTime()+' creating zip file: outfile = ',zname);
            console.log(getTime()+' input app directory=',appdir);
            gulp.src([appdir+'/**/*'], {base : appdir}).
                pipe(gulpzip(basez)).
                pipe(gulp.dest(distdir)).on('end', () => {
                    let mbytes=getFileSizeInMB(zname);
                    console.log(getTime()+' ____ zip file created in '+zname+' (size='+mbytes+' MB )');
                    done();
                });
        }).catch( (e) => {
            console.log(e);
            process.exit(1);
        });
    }).catch( (e) => {
        console.log(e);
        process.exit(1);
    });
});


// - - - - - - - - - - - - - - - - - - - - - - -
gulp.task('zip', (done) => {

    
    const gulpzip = require('gulp-zip');

    // appinfo IS package.json -- which specifies the name and version of the application
    // Zip file name
    let zname=path.resolve(path.join(__dirname,path.join('build/dist/',`${appinfo.name}_${appinfo.version}_webpage.zip`)));

    // Last part of zname without paths
    let basez=path.basename(zname);
    
    // Location of build/web (input to zip)
    let appdir=path.resolve(path.join(__dirname,'build/web'));

    // Location of build/dist (output of zip)
    let distdir=path.resolve(path.join(__dirname,'build/dist'));

    // Print something
    console.log(getTime()+' creating zip file: outfile = ',zname);

    // gulp.src  -> zip -> dest 
    gulp.src([appdir+'/**/*'], {base : appdir}).
        pipe(gulpzip(basez)).
        pipe(gulp.dest(distdir)).on('end', () => {
            let mbytes=getFileSizeInMB(zname);
            console.log(getTime()+' ____ zip file created in '+zname+' (size='+mbytes+' MB )');
            done();
        });
});
// - - - - - - - - - - - - - - - - - - - - - - -
// Build task -- create everything in build/web
// - - - - - - - - - - - - - - - - - - - - - - - 
gulp.task('build', gulp.series('clean',gulp.parallel('commonfiles','mainhtml','webpack')));

// - - - - - - - - - - - - - - - - - - - - - - -
// Package task, creates webpage package
// - - - - - - - - - - - - - - - - - - - - - - -webackwatch
gulp.task('webpage',gulp.series('build','zip'));

// - - - - - - - - - - - - - - - - - - - - - - -
// Devel task
// Build + webpack in watch mode plus
//   realtime eslint linting of js files plus
//     running webserver
// - - - - - - - - - - - - - - - - - - - - - - -
gulp.task('devel', gulp.series('webackwatch',gulp.parallel('build','watch','webserver')));


// -------------------------------------------
// Default is devel
// -------------------------------------------

gulp.task('default',gulp.series('devel'));
          
