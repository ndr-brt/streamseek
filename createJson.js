var fs = require('fs');

var results = {results: []};
var limitFolder = Math.floor((Math.random() * 80) + 20);
for (var i=0;i<limitFolder;i++) {
  var fold = {
    name: (Math.random() + 1).toString(36).substring(7),
    folder: (Math.random() + 1).toString(36).substring(7),
    user: (Math.random() + 1).toString(36).substring(7),
    speed: Math.floor((Math.random() * 1000000) + 1000),
    songs: []
  }
  var limitSongs = Math.floor((Math.random() * 20) + 8);

  for (var j=0;j<limitSongs;j++) {
    var song = {
      name: (Math.random() + 1).toString(36).substring(7),
      size: Math.floor((Math.random() * 10000000) + 1000),
      bitrate: Math.floor((Math.random() * 320) + 96)
    }
    fold.songs.push(song)
  }
  results.results.push(fold)
}

fs.writeFile("./json_test.json", JSON.stringify(results), function(err) {
    if (err) return console.log(err);
    return console.log("The file was saved!");
});
