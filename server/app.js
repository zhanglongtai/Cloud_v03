var fs = require('fs');
var path = require('path');
var express = require('express');
var multer = require('multer');
var bodyParser = require('body-parser');
var serveStatic = require('serve-static');

var upload = multer({ dest: path.join(__dirname, '/static/uploads')});

//var app = express();
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.set('port', (process.env.PORT || 8000));

app.use(bodyParser());
app.use(bodyParser.json());
app.use(serveStatic(__dirname + '/static'));
app.use(bodyParser.urlencoded({extended: true}));

var COMMENTS_FILE = path.join(__dirname, '/static/models/data.json');

app.get('/', function(request, response) {
	response.sendFile(__dirname + '/static/public/html/index.html');
});

app.get('/mesh-generator', function(request, response) {
    response.sendFile(__dirname + '/static/public/html/index.html');
});

app.get('/simulation', function(request, response) {
    response.sendFile(__dirname + '/static/public/html/index.html');
});

app.get('/post-processor', function(request, response) {
    response.sendFile(__dirname + '/static/public/html/index.html');
});

app.post('/api/upload', upload.single('modelfile'), function(request, response) {
    var tmp_path = request.file.path;
    var target_path = path.join(__dirname, '/static/models/', request.body.filename);
    fs.rename(tmp_path, target_path, function() {
        fs.unlink(tmp_path, function() {
            console.log("[+] upload finished.");
            response.json({model: request.body.filename});
        });
    });

	fs.exists(COMMENTS_FILE, function(exists) {
		if (exists) {
			fs.readFile(COMMENTS_FILE, function(err, data) {
        	    if (err) {
        		    console.log('line 36');
        		    console.error(err);
        		    process.exit(1);
        	    }

                //var modelInfo =  JSON.parse(data);
                var modelInfo = [];
        	    var newmodelInfo = {
        		    name: request.body.filename,
        	    };

        	    modelInfo.push(newmodelInfo);

        	    fs.writeFile(COMMENTS_FILE, JSON.stringify(modelInfo, null, 4), function(err) {
        		    if (err) {
        			    console.log('line 50');
        			    console.error(err);
        			    process.exit(1);
        		    }
        	    });

            });
		}
		else {
			fs.open(COMMENTS_FILE, 'w', function(err) {
        	    if (err) {
        		    console.log('line 62');
        		    console.error(err);
        		    process.exit(1);
        	    }

        	    var newmodelInfo = {
        		    name: request.body.filename,
        	    };
        	    var modelInfo = [];

        	    modelInfo.push(newmodelInfo);

        	    fs.writeFile(COMMENTS_FILE, JSON.stringify(modelInfo, null, 4), function(err) {
        		    if (err) {
        			    console.log('line 76');
        			    console.error(err);
        			    process.exit(1);
        		    }
        	    });
            });
		}
	});
});

app.get('/api/model', function(request, response) {
    fs.exists(COMMENTS_FILE, function(exists) {
        if (exists) {
        	fs.readFile(COMMENTS_FILE, function(err, data) {
                if (err) {
    	            console.log('line 99');
                    console.error(err);
                    process.exit(1);
                }
                response.json(JSON.parse(data));
            });
        }
    }); 
});

// var uploadIo = io
//     .of('/upload')
//     .on('connection', function(socket) {
//         console.log('[+] Upload socket connected.');
//         fs.exists(COMMENTS_FILE, function(exists) {
//             if (exists) {
//                 fs.watchFile(COMMENTS_FILE, function(current, previous) {
//                     if (current.mtime !== previous.mtime) {
//                         dirpath = __dirname + '/static/models';
//                         dirContent = fs.readdirSync(dirpath);
//                         console.log(dirContent);
//                         socket.emit('uploadFinished', dirContent);
//                         socket.emit('updateModel');
//                     }
//                 });
//                 fs.unwatchFile(COMMENTS_FILE);
//             }
//         });
//     });


io.on('connection', function(socket) {
    console.log('[+] Socket connected.');

    socket.on('getDir', function() {
        dirpath = __dirname + '/static/models';
        dirContent = fs.readdirSync(dirpath);
        console.log(dirContent);
        socket.emit('sendDir', dirContent);
    });

    socket.on('getDirData',function() {
        var dirData = [
            {
                text: "dir1",
                nodes: [
                            {
                                text: "cycle-0.stl",
                            },
                            
                            {
                                text: "cycle-17.stl"
                            }
                        ]
            },

            {
                text: "pipe.stl"
            },
            
            {
                text: "slotted_disk.stl"
            },

            {
                text: "airplane.stl"
            }
        ];

        socket.emit('sendDirData', dirData);
    });

    socket.on('updateModel', function(model) {
        console.log('[+] Recive updateModel: ' + model);
        socket.emit('sendModel', model);
    });

    socket.on('feedback', function(msg) {
        console.log(msg);
    });

    socket.on('loadModel', function() {
        socket.emit('showModel');
    });
});

server.listen(app.get('port'), function() {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});
