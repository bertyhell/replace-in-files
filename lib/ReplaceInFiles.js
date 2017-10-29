const nodePath = require('path');
const _ = require('lodash');
const globby = require('globby');

const Validator = require('./Validator');
const Configurator = require('./Configurator');
const Finder = require('./Finder');
const Patcher = require('./Patcher');
const Logger = require('./Logger');
const DateFormatter = require('./DateFormatter');
const helpers = require('./helpers');

const fs = helpers.fs;

class ReplaceInFiles {
  static* getPathsToFiles({ files, optionsForFiles }) {
    const paths = yield globby(files, optionsForFiles);
    return paths;
  }

  static* handlerActions(replaceOptions, pathsToFiles) {
    yield _.map(pathsToFiles, path => ReplaceInFiles.handlerAction(
      replaceOptions,
      path
    ));
  }

  static* handlerAction(
    replaceOptions,
    path
  ) {
    const {
      encoding,
      from,
      onlyFindPathsWithoutReplace,
      replaceFileOnlyIfMatchRegxpInFile: regexp,
      to,
      saveOldFile,
    } = replaceOptions;
    const data = yield fs.readFile(path, encoding);

    if (onlyFindPathsWithoutReplace) {
      ReplaceInFiles.findMatches({ path, data, from });
      return;
    }


    const isReplaceFile = _.some([
      regexp === null,
      regexp !== null && Finder.isFindRegxInString(data, regexp)
    ], Boolean);

    if (isReplaceFile) {
      yield ReplaceInFiles.replaceMatches({ path, data, from, to, saveOldFile, encoding });
    }
  }

  static findMatches({ path, data, from }) {
    new Finder({ path, data, from }).run();
  }

  static getOldFilePath({ path, birthtime, ctime }) {
    const ext = nodePath.extname(path) || '';
    const startExt = -ext.length || path.length;
    const date = birthtime || ctime || new Date();
    const postfix = new DateFormatter({ date }).run();
    const oldFilePath = `${path.slice(0, startExt)}-${postfix}${ext}`;

    return oldFilePath;
  }

  static* saveOldFile({ path, data }) {
    const { birthtime, ctime } = yield fs.stat(path);
    const oldFilePath = ReplaceInFiles.getOldFilePath({ path, birthtime, ctime });


    yield fs.writeFile(oldFilePath, data);
  }

  static* replaceMatches({ path, data, from, to, saveOldFile, encoding }) {
    if (saveOldFile) {
      yield ReplaceInFiles.saveOldFile({ path, data });
    }
    const updated = new Patcher({ path, data, from, to }).run();
    yield fs.writeFile(path, updated, encoding);
  }

  constructor(options) {
    this.options = options;
  }

  validateOptions() {
    new Validator(this.options).run();
  }

  setConfings() {
    const configs = new Configurator(this.options).run();
    return configs;
  }

  * run() {
    this.validateOptions();

    const {
      findFilesOptions,
      loggerOptions,
      replaceOptions,
    } = this.setConfings();

    const logger = new Logger(loggerOptions);
    logger.run();

    const pathsToFiles = yield ReplaceInFiles.getPathsToFiles(findFilesOptions);
    yield ReplaceInFiles.handlerActions(replaceOptions, pathsToFiles);

    return logger.getResult();
  }
}

module.exports = ReplaceInFiles;
