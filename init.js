var fs = require('fs');

var target = './src/lib';
if (!fs.existsSync(target)) {
    fs.mkdirSync(target);
}
fs.createReadStream('./node_modules/d3/d3.js').pipe(fs.createWriteStream(target + '/d3.js'));
fs.createReadStream('./node_modules/requirejs/require.js').pipe(fs.createWriteStream(target + '/require.js'));