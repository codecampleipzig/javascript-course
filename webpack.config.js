const fs = require ('fs');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// grab before config.json is overwritten by generate-config.js side-effects
const { existingChallengeScriptFiles } = loadJSONifExists('config.json');

const config = require('./generate-config.js')
{ inputDir, outputDirHidden, outputDirPublic, flatFilePathObject } = config;

//////////////////
// definitions

function loadJSONifExists (inputPath) {
  if ( fs.existsSync(inputPath) )
    return JSON.parse( fs.readFileSync(inputPath) );
  else
    return {};
};

function newArrayByExtension (filePathObject, extension) {
  const filePathArray = [];
  keyArray = Obj.keys(filePathObject);
  keyArray.forEach( elem => {
    if (filePathObject[elem] == extension) {
      filePathArray.push(elem)
      return
    } else {
      return
    }
  });
  return filePathArray
});

function filterArrayByName (filePathArray, nameWithExtension) {
  filePathArray.filter( elem => {
    return elem.endsWith(nameWithExtension)
  });
};

preventOverwrite (filterArray, activeArray) {
  activeArray.filter( (elem) => {
    return filterArray.includes(elem)
  });
  return activeArray
};

function generateMultipleEntryObject (filePathArray) {
  return filePathArray.reduce( (acc, val, index, selfArray) => {
    acc[val] = path.join(inputDir, val);
    return acc
  }, {});
};

function generateMultipleHtmlWebpackPlugin (filePathArray) {
  return filePathArray.reduce( (acc, val, index, selfArray) => {
    return acc.push(
      new HtmlWebpackPlugin({
        inject: 'true',
        // chunk value must be same as key of associated entry
        chunks: [ val ],
        filename: `${ path.join(outputDirHidden, val) }`,
        template: './template.md'
      })
    );
  }, []);
};


//////////////////
// computation

challengeScriptFiles = filterArrayByName( newArrayByExtension(flatFilePathObject, '.js'), 'challenge.js' );
challengeScriptFiles = preventOverwrite(existingChallengeScriptFiles, challengeScriptFiles);
challengeIndexFiles = newArrayByExtension(flatFilePathObject, '.html');


//////////////////
// side-effects

config.existingChallengeScriptFiles = challengeScriptFiles;
fs.writeFileSync('config.json', JSON.stringify(config) );


//////////////////
// exports

module.exports = {
  entry: generateMultipleEntryObject(challengeScriptFiles),
  output: {
    filename:'[name].js',
    path: outputDirPublic
  },
  plugins: [].concat( generateMultipleHtmlWebpackPlugin(challengeIndexFiles) );
};
