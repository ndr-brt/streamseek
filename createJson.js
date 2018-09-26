var fs = require('fs');
var strJson = 'export const jsonInput = [\n';

var limitFolder = Math.floor((Math.random() * 300) + 200);
for (var i=0;i<limitFolder;i++) {
  strJson += '\
  {name: \''+(Math.random() + 1).toString(36).substring(7)+'\',\
  folder: \''+(Math.random() + 1).toString(36).substring(7)+'\',\
  user: \''+(Math.random() + 1).toString(36).substring(7)+'\',\
  speed: '+Math.floor((Math.random() * 1000000) + 1000)+',\
  songs: [';

  var limitSongs = Math.floor((Math.random() * 20) + 8);
  for (var j=0;j<limitSongs;j++) {
    strJson += '{name: \''+(Math.random() + 1).toString(36).substring(7)+'\', size: '+Math.floor((Math.random() * 10000000) + 1000)+', bitrate: '+Math.floor((Math.random() * 320) + 96)+'}';
    if (j < (limitSongs - 1)) strJson += ',\n';
  }
  strJson += '\n\
  ]}';
  if (i < (limitFolder -1 )) strJson += ',';
  strJson += '\n';
}
strJson += '];\n';

fs.writeFile("./json_test", strJson, function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("The file was saved!");
});
