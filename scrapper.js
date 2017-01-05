

var request = require('request');
var cheerio = require('cheerio');
var path = require('path');
var fs = require('fs');

// class for stored class
function classTime(C_E,desc,day,start,fin,loc,start_date){
    this.C_E = C_E;
    this.desc = desc;
    this.day = day;
    this.start = start;
    this.fin = fin;
    this.loc = loc;
    this.start_date = start_date;
}
// scrape the timetable from given url and save to fileLoc as json file
module.exports.scrape = function(url,fileLoc,callback){
    if (url == undefined){
        console.log("ERROR: url not specified");
        return;
    }
    if (fileLoc == undefined){
        fileLoc = './';
    }
    if (callback == undefined){
        if (typeof fileLoc == 'function'){
            callback = fileLoc;
        }
        else{
            callback = success=>{
                return;
            }
        }
    }
    request(url,function(err,html){
        if (err){
            console.log(err);
            return;
        }
        var $ = cheerio.load(html.body);
        $('div h3').each(function(i){
            var h3 = $(this).text();
            var fileName = h3.substring(h3.indexOf(':')+1,h3.length)
                .replace(/[\s\n\r]*$/,'').replace(/\s-\s/,'_').replace(/^\s/,'')
                .replace(/\//g,'_');
            fileName += '.json';
            fileName = path.join(__dirname,fileLoc,fileName)
            var classes = new Array();
            var trs = $(this).siblings('table.cyon_table').children('tbody').children('tr');
            trs.each(function(i){
                var tds = $(this).children("td");
                var C_E = tds.eq(0).html();
                var desc = tds.eq(1).html();
                var day = tds.eq(2).html();
                var start = tds.eq(3).html();
                var fin = tds.eq(4).html();
                var loc = tds.eq(7).html();
                var start_date = tds.eq(9).html();
                classes.push(new classTime(C_E,desc,day,start,fin,loc,start_date));
            });
            while(classes.length < trs.length );
            fs.writeFile(fileName,JSON.stringify(classes).replace(/,/g,",\n"),function(err){
                if (!err){
                    console.log("file :",fileName,"write successed");
                    callback(true);
                }else{
                    console.error(err);
                    callback(false);
                }
            });

        })
    });
}
