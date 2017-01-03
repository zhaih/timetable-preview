/**
* to generate random color
*/
function getRandomColor(){
    var res = (Math.random()*0xffffff<<0).toString(16);
    var zeros = ""
    if (res.length != 6){
        for (var i = 0; i < 6 - res.length; i++){
            zeros += "0"
        }
    }
    return "#"+zeros+res
}
/**
* given a color, generate the inverse color so that two
* colors contrast in order to view the text on a colored 
* block
*/
function antiColor(cString){
    cString = cString.replace("#","")
    var r = 255 - parseInt(cString.substring(0,2),16)
    var g = 255 - parseInt(cString.substring(2,4),16)
    var b = 255 - parseInt(cString.substring(4,6),16)
    var rc = r.toString(16)
    var gc = g.toString(16)
    var bc = b.toString(16)
    if (rc.length < 2){
        rc = '0'+rc
    }
    if (gc.length < 2){
        gc = '0'+gc
    }
    if (bc.length < 2){
        bc = '0'+bc
    }
    return "#"+rc+gc+bc
}
