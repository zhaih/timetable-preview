var express    = require('express');
var http       = require('http');
var bodyParser = require('body-parser');
var path       = require('path');
var app        = express();
var server     = http.createServer(app);
var PORT       = process.env.PORT || 80;
var logger     = require('morgan');
var fs         = require('fs');

var classFiles = new Object();

app.set('port',PORT);
app.use(express.static('Template'));
app.use('/static',express.static('Static'));

app.get('/',function(req,res){
    res.redirect('/timetable.html')
});

app.get('/getCourses',function(req,res){
    res.json(classFiles);
});

function loadClassFile(){
    fs.readdir(path.join(__dirname,'/Timetable'),function(err,files){
        if (err){
            console.log('Timetable dir read error');
            console.log(err);
            return;
        }
        // reload classFiles
        files.forEach(function(file){
            fs.readFile(path.join(__dirname,'/Timetable/',file),
            function(err,data){
                if (err){
                    console.log('reading file',file,'error');
                    console.log(err);
                }
                var key = file.substring(0,file.lastIndexOf('.'));
                classFiles[key] = JSON.parse(data);
            });
        });
    });
}

loadClassFile();
app.listen(app.get('port'),function(){
    console.log("server has started");
})
