// server.js set up ========================
var express  = require('express');
var app      = express(); // create our app w/ express

var server = require('http').Server(app);
//var io = require('socket.io')(server);

var socket = require('socket.io');
var io = socket.listen(server);
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var fs = require('fs');

app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); 
app.use(methodOverride());

var port = process.env.PORT || 4000 ;

/* configure socket io*/
//io.set("transports", ["xhr-polling"]);
//io.set("polling duration", 3);
/*io.set('heartbeat interval', 5);
io.set('heartbeat timeout', 11);*/


io.sockets.on('connection', function (socket) {
    console.log('\ngot a new connection from: ' + socket.id + '\n');
});

// allow CORS
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
  if (req.method == 'OPTIONS') {
    res.status(200).end();
  } else {
    next();
  }
});

// application -------------------------------------------------------------
app.get('/main', function(req, res) {
    res.sendfile('./public/templates/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});


 function hexToRgb(hex) {
    hex = hex.replace('#','');
    r = parseInt(hex.substring(0,2), 16);
    g = parseInt(hex.substring(2,4), 16);
    b = parseInt(hex.substring(4,6), 16);

    result = r+','+g+','+b;
    return result;
}
// brand1 api -------------------------------------------------------------
app.get('/brand1', function(req, res) {
    fs.readFile('./public/content/Facebook/Facebook.json', function read(err, dat) {
        if (err) {
            throw err;
        }

        res.type('application/json');
        var obj = dat.toString();
        var data = JSON.parse(obj);
        console.log("brand 1 ====", data)
        console.log("brand val ====",hexToRgb(data.bgColor))
        var obj = {
            "header": data.header,
            "bgColor": hexToRgb(data.bgColor),
            "lgColor": hexToRgb(data.lgColor),
            "hColor": hexToRgb(data.hColor),
            "logoUrl":data.logoUrl
            }
        res.send(obj);
    });
});

// brand2 api -------------------------------------------------------------
app.get('/brand2', function(req, res) {

     fs.readFile('./public/content/Google/Google.json', function read(err, dat) {
          if (err) {
            throw err;
        }

        res.type('application/json');
        var obj = dat.toString();
        var data = JSON.parse(obj);
        console.log("brand 1 ====", data)
        console.log("brand val ====",hexToRgb(data.bgColor))
        var obj = {
            "header": data.header,
            "bgColor": hexToRgb(data.bgColor),
            "lgColor": hexToRgb(data.lgColor),
            "hColor": hexToRgb(data.hColor),
            "logoUrl":data.logoUrl
            }
        res.send(obj);
    });
   
});

// brand2 api -------------------------------------------------------------
app.get('/brand3', function(req, res) {
    fs.readFile('./public/content/Microsoft/Microsoft.json', function read(err, dat) {
        if (err) {
            throw err;
        }

        res.type('application/json');
        var obj = dat.toString();
        var data = JSON.parse(obj);
        console.log("brand 1 ====", data)
        console.log("brand val ====",hexToRgb(data.bgColor))
        var obj = {
            "header": data.header,
            "bgColor": hexToRgb(data.bgColor),
            "lgColor": hexToRgb(data.lgColor),
            "hColor": hexToRgb(data.hColor),
            "logoUrl":data.logoUrl
            }
        res.send(obj);
    });
});


/*saving data into local json file and socket.io web socket communication i.e., server side pushing */
app.post('/updateFile', function (req, res, next) {
  console.log("helooooooooooooooooooooooooooooo===================", req.body);
  var dat = req.body;
  var data = null
  var parseData = null;
  var payload = null
  if(req.body.company == "Facebook"){
    dat.logoUrl = ":4000/content/Facebook/Facebook-lg.png";
    data = JSON.stringify(dat);
    console.log("new infoo is ", data)
    parseData = JSON.parse(data);
    console.log("parseData header name is -------------------", parseData.header)
    payload = {
          "header": parseData.header,
          "bgColor": hexToRgb(parseData.bgColor),
          "lgColor": hexToRgb(parseData.lgColor),
          "hColor": hexToRgb(parseData.hColor),
          "logoUrl":parseData.logoUrl
          }

     io.sockets.emit('newPreview', payload);
    fs.writeFile('./public/content/Facebook/Facebook.json', data , function (err) {
        if (err) 
            return console.log(err);
        console.log('file is saved');
    });
  }else if(req.body.company == "Google"){
    dat.logoUrl = ":4000/content/Google/Google-lg.png";
    data = JSON.stringify(dat);
    console.log("new infoo is ", data)
    parseData = JSON.parse(data);
    console.log("parseData header name is -------------------", parseData.header)
    payload = {
          "header": parseData.header,
          "bgColor": hexToRgb(parseData.bgColor),
          "lgColor": hexToRgb(parseData.lgColor),
          "hColor": hexToRgb(parseData.hColor),
          "logoUrl":parseData.logoUrl
          }
     io.sockets.emit('newPreview', payload);
    fs.writeFile('./public/content/Google/Google.json', data , function (err) {
        if (err) 
            return console.log(err);
        console.log('file is saved');
    });
  } else{
     dat.logoUrl = ":4000/content/Microsoft/Microsoft-lg.png";
     data = JSON.stringify(dat);
    console.log("new infoo is ", data)
    parseData = JSON.parse(data);
    console.log("parseData header name is -------------------", parseData.header)
    payload = {
          "header": parseData.header,
          "bgColor": hexToRgb(parseData.bgColor),
          "lgColor": hexToRgb(parseData.lgColor),
          "hColor": hexToRgb(parseData.hColor),
          "logoUrl":parseData.logoUrl
          }

    io.sockets.emit('newPreview', payload);
    fs.writeFile('./public/content/Microsoft/Microsoft.json',data , function (err) {
        if (err) 
            return console.log(err);
        console.log('file is saved');
    });
  }   
});

//upload image and replace the existing one
app.post('/upload', function(req, res) {
    var image =  req.files.image;
    var newImageLocation = path.join(__dirname, 'content/'+image.name, image.name);

    fs.readFile(image.path, function(err, data) {
        fs.writeFile(newImageLocation, data, function(err) {
            res.json(200, {
                src: image.name+'/' + image.name,
                size: image.size
            });
        });
    });
});


// creating a new websocket to keep the content updated without any AJAX request
/*io.on('connection', function(socket) {
  console.log(__dirname);
  // watching the json file
  fs.watchFile('./public/content/Google/Google.json', function(curr, prev) {
    // on file change we can read the new data
    fs.readFile('./public/content/Google/Google.json', function(err, data) {
      if (err) throw err;
      // parsing the new data
      //console.log("file got changed and reading file data", data)
       var jsonData = data.toString();;
       console.log("file got changed and reading file data======", jsonData)
      // send the new data to the client
      socket.emit('updatedPreview', jsonData);
    });
  });

});*/

// listen (start app with node server.js) ======================================
server.listen(port, function(){
  console.log("Server listening on port ", port);
});
