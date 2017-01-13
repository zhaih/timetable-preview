var express     = require('express');
var http        = require('http');
var bodyParser  = require('body-parser');
var path        = require('path');
var app         = express();
var server      = http.createServer(app);
var PORT        = process.env.PORT || 80;
var logger      = require('morgan');
var fs          = require('fs');
var scrapper    = require('./scrapper');
var db          = require('./db')

var classFiles = new Object();
var useDB       = db.useDB;

app.set('port',PORT);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'Template'));
app.use(logger('dev'));
app.use(express.static('Template'));
app.use('/static',express.static('Static'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

if (useDB){
    db.connect(function(err){
        if (err){
            console.error(err);
            return;
        }
        db.allCourses((err,data)=>{
            if (err){
                console.error(err);
                return;
            }
            data.forEach(function(item){
                classFiles[item.title] = item.classes;
            })
        })
        app.listen(app.get('port'),function(){
            console.log('server started at port:',app.get('port'));
        });
    });
}else{
    loadAllClassFiles();
    app.listen(app.get('port'),function(){
        console.log('server started at port:',app.get('port'));
    });
}


app.get('/',function(req,res){
    res.render('index');
});

app.get('/timetable',function(req,res){
    res.redirect('/');
})

app.get('/getCourseTitles',function(req,res){
    res.json(Object.keys(classFiles));
})

app.get('/getCourses',function(req,res){
    res.json(classFiles);
});

app.post('/getCourses',function(req,res){
    scrapeCourseInfo(req.body.subjectCode,req.body.year,function(err,courses){
        if (err){
            console.error(err);
            return;
        }
        for (course in courses){
            // use database to store info
            if (useDB){
                db.insertOrUpdate(db.newEntry(course,courses[course]),(err,data)=>{
                    if (err){
                        console.error(err);
                        return;
                    }
                    classFiles[course] = data.classes;
                });
            // use file system to store info
            }else{
                fs.writeFile(path.join(__dirname,'Timetable',course+'.json'),
                            JSON.stringify(courses[course]).replace(/,/g,",\n"),(err)=>{
                                if (err){
                                    console.error(err);
                                    return;
                                }
                                console.log('write file:',course+'.json','successed');
                                classFiles[course] = courses[course];

                            });
            }
        }
    });
    res.end();
});

app.post('/timetable',function(req,res){
    var courses = JSON.parse(req.body.courses);
    var injection = new Object();
    for (i in courses){
        injection[courses[i]] = classFiles[courses[i]];
    }
    res.render('timetable',{courses: JSON.stringify(injection)});
});


// scrape the timetable infomation based on given subject code and year,
// be careful with the call back since it would be called twice sometimes
// since there might be two file writing, if there's error, there will only be
// one parameter that is safe which is first one, err, if no error , the second
// one indicating the course data is also available
function scrapeCourseInfo(subjectCode, year, callback){
    scrapper.scrape('https://sws.unimelb.edu.au/'
        + year
        +'/Reports/List.aspx?objects='
        + subjectCode
        + '&weeks=1-52&days=1-7&periods=1-56&template=module_by_group_list',
        callback);

}

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
