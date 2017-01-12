var MONGODB_URI = process.env.MONGODB_URI;
var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

if (MONGODB_URI == undefined){
    module.exports.useDB = false;
}else{
    module.exports.useDB = true;
}

// connect to mongodb
if (MONGODB_URI != undefined){
    mongoose.connect(MONGODB_URI)
    var db = mongoose.connection;
}

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
