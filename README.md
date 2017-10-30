# replace-in-files
Replace text in one or more files or globs. Work asynchronously with promises.

[![npm version](https://img.shields.io/npm/v/replace-in-files.svg)](https://www.npmjs.com/package/replace-in-files)
[![github issues](https://img.shields.io/github/issues/wj42ftns/replace-in-files.svg)](https://github.com/wj42ftns/replace-in-files/issues)
## Installation
```shell
# Using npm
npm install replace-in-files

# Using yarn
yarn add replace-in-files
```

## Usage

### Specify options

```js
const replaceInFiles = require('replace-in-files');

const options = {
  // See more: https://www.npmjs.com/package/globby
  // Single file or glob
  files: 'path/to/file',
  // Multiple files or globs
  files: [
    'path/to/file',
    'path/to/other/file',
    'path/to/files/*.html',
    'another/**/*.path',
  ],


  // See more: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace
  // Replacement
  from: /foo/g,  // string or regex
  to: 'bar', // string or fn  (fn: carrying last argument - path to replaced file)


  // See more: https://www.npmjs.com/package/glob
  optionsForFiles: { // default
    "ignore": [
      "**/node_modules/**"
    ]
  }


  // format: `${fileName}-${year}-${month}-${day}_${hour}:${minute}:${second}.{fileExtension}`
  // date of createFile old file or last modificate (if not find create date)
  saveOldFile: false // default


  //Character encoding for reading/writing files
  encoding: 'utf8',  // default


  onlyFindPathsWithoutReplace: false // default
  returnPaths: true // default
  returnCountOfMatchesByPaths: true // default
};
```

### Replacing multiple occurrences
Please note that the value specified in the `from` parameter is passed straight to the native [String replace method](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace). As such, if you pass a string as the `from` parameter, it will _only replace the first occurrence_.

To replace multiple occurrences at once, you must use a regular expression for the `from` parameter with the global flag enabled, e.g. `/foo/g`.

### Asynchronous replacement with promises

```js
const replaceInFiles = require('replace-in-files');

// ...

replaceInFiles(options)
  .then({ changedFiles, countOfMatchesByPaths } => {
    console.log('Modified files:', changedFiles);
    console.log('Count of matches by paths:', countOfMatchesByPaths);
  })
  .catch(error => {
    console.error('Error occurred:', error);
  });
```

### Asynchronous replacement with co yield

```js
const replaceInFiles = require('replace-in-files');
const co = require('co');

// ...

co(function* () {
  const {
    changedFiles,
    countOfMatchesByPaths
  } = yield replaceInFiles(options);
  console.log('Modified files:', changedFiles);
  console.log('Count of matches by paths:', countOfMatchesByPaths);
}).catch((error) => {
  console.log('Error occurred:', error);
});
```

### Asynchronous replacement with async await (node 8+)

```js
const replaceInFiles = require('replace-in-files');

// ...

async function main() {
  try {
    const {
      changedFiles,
      countOfMatchesByPaths
    } = await replaceInFiles(options);
    console.log('Modified files:', changedFiles);
    console.log('Count of matches by paths:', countOfMatchesByPaths);
  } catch (error) {
    console.log('Error occurred:', error);
  }
}

main();
```


### Return value

The return value of the library is an object with: countOfMatchesByPaths and paths

For example:

```js
const replaceInFiles = require('replace-in-files');

const data = replaceInFiles({
  files: 'path/to/files/*.html',
  from: 'a',
  to: 'b',
});

// data could like:
{
  countOfMatchesByPaths: {
    'path/to/files/file1.html': 5,
    'path/to/files/file3.html': 1,
    'path/to/files/file5.html': 3
  },
  paths: [
    'path/to/files/file1.html',
    'path/to/files/file3.html',
    'path/to/files/file5.html',
  ]
}

// if empty:
{
  countOfMatchesByPaths: {},
  paths: []
}

```

## License
(MIT License)
