var express    = require('express');
var http       = require('http');
var bodyParser = require('body-parser');
var path       = require('path');
var app        = express();
var server     = http.createServer(app);
var PORT       = process.env.PORT || 80;
var logger     = require('morgan');
var fs         = require('fs');
var scrapper   = require('./scrapper');

// scrapper.scrape('https://sws.unimelb.edu.au/2017/Reports/List.aspx?objects=INFO30005&weeks=1-52&days=1-7&periods=1-56&template=module_by_group_list')

var classFiles;

app.set('port',PORT);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'Template'));
app.use(express.static('Template'));
app.use('/static',express.static('Static'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/',function(req,res){
    res.render('index');
});

app.get('/timetable',function(req,res){
    res.render('timetable');
})

app.get('/getCourseTitles',function(req,res){
    res.json(Object.keys(classFiles));
})

app.get('/getCourses',function(req,res){
    res.json(classFiles);
});

app.post('/timetable',function(req,res){
    var courses = JSON.parse(req.body.courses);
    var injection = new Object();
    for (i in courses){
        injection[courses[i]] = classFiles[courses[i]];
    }
    res.render('timetable',{courses: JSON.stringify(injection)})
})

// load single class file, and a callback function could be passed and will be
// called after everything is done
function loadClassFile(file,callback){
    if (file == undefined){
        console.log('pass undefined filename to loadClassFile');
        return;
    }
    if (callback == undefined){
        callback = err=>{
            if (err){
                console.error(err);
                return;
            }
        }
    }
    fs.readFile(file,function(err,data){
        if (err){
            callback(err);
        }
        var key = path.basename(file);
        key = key.substring(0,key.lastIndexOf('.'));
        classFiles[key] = JSON.parse(data);
        callback(null);
    })
}


// loadAll class files, will be called once when the server start
// the old classFiles will be replaced by a whole new one, so be careful
// to use this one
function loadAllClassFiles(){
    classFiles = new Object();
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
                    return;
                }
                var key = file.substring(0,file.lastIndexOf('.'));
                classFiles[key] = JSON.parse(data);
            });
        });
    });
}
loadAllClassFiles();
app.listen(app.get('port'),function(){
    console.log("server has started");
})
