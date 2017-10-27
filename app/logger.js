var diskmgmt = require('./diskmgmt.js');
var currentLog;

function writeLog(time, entry) {
var timeStamp = new Date().toISOString();
var string;
var a = ": " + time;
var b = ": " + entry;
var string = timeStamp += a += b;
//console.log(string);
return new Promise(function(reject, resolve){
diskmgmt.writeStream(currentLog, string)
.then(resolve())
.catch(function(e) {console.log("error writing log"); reject(e); });
})}


function startLog(file) {
return new Promise(function(reject, resolve){
currentLog = file;
    diskmgmt.makeFile(file)
    .then(resolve())
    .catch(function(e) {console.log("error starting log"); reject(e)});
})
}

function readLog(file) {
return new Promise(function(reject, resolve){
diskmgmt.readFile(file)
.then(resolve())
.catch(function(e) {console.log("error reading log"); reject(e)});
})
}

function setLog(fileName, time){
return new Promise(function(reject, resolve){
fileName += time;
diskmgmt.writeFile(currentLog, fileName, function(err){
if (err) { reject(err)} else { resolve()};
})
})
}

module.exports.startLog = startLog;
module.exports.setLog = setLog;
module.exports.readLog = readLog;
module.exports.writeLog = writeLog;
