const fs = require('fs');
const path = require ('path');


//////////////////
// definitions

function getFolderContents (readPath) {
  const output = {};
  // https://nodejs.org/dist/latest-v10.x/docs/api/fs.html#fs_class_fs_dirent
  fs.readdirSync(readPath, { withFileTypes: true })
    .forEach( dirent => {
      switch (dirent.isDirectory()) {
        case true:
          output[dirent.name] = ['folder'];
          break;
        case false;
          //assumes all non-directories are files for simplicity of implementation
          output[dirent.name] = ['file'];
          break;
        default:
          break;
      }
    });
  return output
};

getFileExtension (inputString) {
  return inputString.slice((inputString.lastIndexOf(".") - 1 >>> 0) + 2)
};

// recursive breadth-first traversal of directory structure
function getDirectoryStructureAndFilePathObject (currentInputPath, currentOutputPath,
flatFilePathObject) {
  const contents = getFolderContents(currentInputPath);
  let entryNames = Object.keys(contents);
  entryNames.forEach( entryName => {
    if ( contents[entryName][0] === 'folder') {
      return contents[entryName].unshift(
        getDirectoryStructureAndFilePathObject( path.join(currentInputPath, entryName), path.join(currentOutputPath, entryName), flatFilePathObject)
      )
    }
    else {
      //assumes all non-directories are files for simplicity of implementation
      fileExt = getFileExtension(contents[entryName][0]);
      flatFilePathObject[ path.join(currentOutputPath, entryName) ] = fileExt;
      return
    }
  })
  return contents, flatFilePathObject
};


//////////////////
// computations

const inputDir = path.resolve(__dirname, 'src');
const outputDirHidden = path.resolve(__dirname, 'dist');
const outputDirPublic = path.resolve(__dirname, 'lessons');

const { dirTreeObj, flatFilePathObject } = getDirectoryStructureAndFilePathObject(inputDir, outputDir, {});

const exportData = {
  "inputDir": inputDir,
  "outputDirHidden": outputDirHidden,
  "outputDirPublic": outputDirPublic,
  "flatFilePathObject": flatFilePathObject
};


//////////////////
// side-effects

exportData['repoPath'] = __dirname.replace(/\\/g,'/');
fs.writeFileSync('config.json', JSON.stringify(exportData) );


//////////////////
// exports

module.exports = {
  ...exportData
};
