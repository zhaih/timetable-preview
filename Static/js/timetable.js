/**
* class timetable, has five days and each day has several rows
* depend on how many classes on that day, each row is an array
* of _class
*/
function timetable(){
    this.Monday = new Array()
    this.Monday[0] = new Array()
    this.Tuesday = new Array()
    this.Tuesday[0] = new Array()
    this.Wednesday = new Array()
    this.Wednesday[0] = new Array()
    this.Thursday = new Array()
    this.Thursday[0] = new Array()
    this.Friday = new Array()
    this.Friday[0] = new Array()
    this.addClass = function(_class){
        // first check if that day another class has already taken the place
        var day = this[_class.day]
        var row = 0
        var slotExist = false
        while (row < day.length){
            slotExist = true
            day[row].forEach(function(c){
                if ((c.start >= _class.start && c.start < _class.end)||
                (_class.start >= c.start && _class.start < c.end)){
                    slotExist = false
                }
            })
            if (slotExist){
                break;
            }
            row++
        }
        if (row == day.length){
            day[row] = new Array()
        }
            day[row].push(_class)
    }
    this.rows = function(){
        return this.Monday.length + this.Tuesday.length + this.Wednesday.length +
                this.Thursday.length + this.Friday.length
    }
}
/**
* class of class
*/
function _class(subjectCode, courseTitle, name, day, start, end, place, color){
    this.subjectCode = subjectCode
    this.courseTitle = courseTitle
    this.name = name
    this.start = start
    this.end = end
    this.day = day
    this.place = place
    this.color = color
    this.fontColor = antiColor(color)
    this.chooseStatus = 0
    // 0 for not chosen and no other same type classes chosen
    // 1 for chosen
    // -1 for not chosen and one of same type class chosen
}
/**
* class of course
* classify the _class according to its name
*/
function _course(color){
    this.color = color
    this.fontColor = antiColor(color)
    this.visible = false;
    this.classType = new Array()
    this.addClass = _class => {
        if (this[_class.name] == undefined){
            this[_class.name] = new Array()
            this.classType.push(_class.name)

        }
        this[_class.name].push(_class)
    }
    this.forEachType = callback => {
        this.classType.forEach(item => {
            callback(item, this[item])
        })
    }
    this.forEachClass = callback => {
        this.classType.forEach(item => {
            this[item].forEach(callback)
        })
    }
}
// transfer number to weekdays
function toWeekday(num){
    switch(num){
        case 1:
            return 'Monday'
        case 2:
            return 'Tuesday'
        case 3:
            return 'Wednesday'
        case 4:
            return 'Thursday'
        case 5:
            return 'Friday'
    }
}
