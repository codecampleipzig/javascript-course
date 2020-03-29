const FS = require('fs');

FS.writeFileSync('config.js', `const repoPath = "${__dirname.replace(/\\/g,'/')}";`);
