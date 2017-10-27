var fs = require("fs-extra");
var path = "./public/data/";

function mkDir(folder) {
return new Promise(function(reject, resolve) {

    fs.mkdirp(path + folder, function(err, result){
    if (err) {
    console.log(err)
    reject(err);
    } else {
    resolve(result);
    }
    })
})
}

function readFile(file){
return new Promise(function(reject, resolve){
fs.readFile(file, 'utf8', function(err, data){
if (err) { reject(err)} else {resolve(data)}
})
})
}

function mkFile(file) {
return new Promise(function(reject, resolve) {
fs.createFile(file, function(err){
if (err) {
reject(err);
} else {
resolve(); }
})
})
}

function writeFile(file, string) {
return new Promise(function(reject, resolve) {
fs.writeFile(file, string, function(err) {
if (err) {
reject(err);} else {resolve();}
})
})
}

function writeStream(file, str){
var string = str += '\n';
return new Promise(function(reject, resolve){
fs.appendFile(file, string, function(err){
if (err) { reject(err) }
else {resolve();}
});

})}


module.exports.mkFile = mkFile;
module.exports.readFile = readFile;
module.exports.mkDir = mkDir;
module.exports.writeFile = writeFile;
module.exports.writeStream = writeStream;
