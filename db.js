var MONGODB_URI = process.env.MONGODB_URI || 'mongodb://heroku_698304zn:fb098us10fh01eq83fhn1trj5v@ds159998.mlab.com:59998/heroku_698304zn';
var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

// connect to mongodb
mongoose.connect(MONGODB_URI)
var db = mongoose.connection;

// Schema for each class
var classSchema = new Schema({
    C_E : String,
    desc : String,
    day : String,
    start : String,
    fin : String,
    loc : String,
    start_date : String
});
// Schema for course
var courseSchema = new Schema({
    title : String,
    classes : [classSchema]
});

// model of course
var courseModel = mongoose.model('Course',courseSchema);

// what to do when connected to database
module.exports.connect = function(callback){
    db.on('error',console.error.bind(console,'connection error:'));
    db.once('open',callback);
}

// insert or update a document
module.exports.insertOrUpdate = function(doc,callback){
    courseModel.findOne({title : doc.title},function(err,item){
        if (err){
            callback(err);
        }
        // if item is null then insert
        if (item == null){
            doc.save(callback);
        } else{ // else update
            doc._id = item._id;
            courseModel.update({_id : item._id},doc,callback);
        }
    });
}

// get all documents in courseModel
module.exports.allCourses = function(callback){
    courseModel.find(callback);
}

// get one course
module.exports.getCourse = function(title,callback){
    courseModel.findOne({title: title},callback);
}

// create new entry
module.exports.newEntry = function(title, classes){
    return new courseModel({
        title : title,
        classes : classes
    });
}
