/**
 * see https://github.com/typeorm/typeorm/blob/master/src/platform/PlatformTools.ts
 */


import * as path from "path";
import * as fs from "fs";
import * as _ from 'lodash';


/**
 * Platform-specific tools.
 */
export class PlatformTools {

  /**
   * Type of the currently running platform.
   */
  static type: "browser" | "node" = "node";

  static workdir: string = null;

  /**
   * Gets global variable where global stuff can be stored.
   */
  static getGlobalVariable(): any {
    return global;
  }


  /**
   * set workdir
   */
  static setWorkDir(workdir:string){
    if(_.isString(workdir)){
      this.workdir = PlatformTools.pathResolve(workdir);
    }else{
      this.workdir = null;
    }

  }

  /**
   * Loads ("require"-s) given file or package.
   * This operation only supports on node platform
   */
  static load(name: string): any {

    // if name is not absolute or relative, then try to load package from the node_modules of the directory we are currenly in
    // this is useful when we are using typeorm package globally installed and it accesses drivers
    // that are not installed globally

    try {
      return require(name);

    } catch (err) {
      if (!path.isAbsolute(name) && name.substr(0, 2) !== "./" && name.substr(0, 3) !== "../") {
        return require(path.resolve(process.cwd() + "/node_modules/" + name));
      }

      throw err;
    }
  }

  /**
   * Normalizes given path. Does "path.normalize".
   */
  static pathNormilize(pathStr: string): string {
    return path.normalize(pathStr);
  }

  /**
   * Gets file extension. Does "path.extname".
   */
  static pathExtname(pathStr: string, dotted: boolean = true): string {
    if (dotted) {
      return path.extname(pathStr);
    } else {
      return path.extname(pathStr).replace('.', '');
    }

  }

  /**
   * Resolved given path. Does "path.resolve".
   */
  static pathResolve(pathStr: string): string {
    if(this.workdir){
      return path.resolve(this.workdir,pathStr);
    }
    return path.resolve(pathStr);
  }

  /**
   * Resolved given path. Does "path.resolve".
   */
  static pathNormAndResolve(pathStr: string): string {
    return this.pathNormilize(this.pathResolve(pathStr))
  }

  static isFile(pathStr: string): boolean {
    return fs.statSync(pathStr).isFile();
  }

  static isDir(pathStr: string): boolean {
    return fs.statSync(pathStr).isDirectory()
  }

  /**
   * Synchronously checks if file exist. Does "fs.existsSync".
   */
  static fileExist(pathStr: string): boolean {
    return fs.existsSync(pathStr);
  }

  /**
   * Returns the basename of a file
   */
  static basename(pathStr: string): string {
    return path.basename(pathStr);
  }

  /**
   * Returns the filename only (without extension)
   */
  static filename(pathStr: string): string {
    return path.basename(pathStr).replace(new RegExp('\\.' + path.extname(pathStr).replace('.', '') + '$'), '');
  }

  /**
   * Returns the dirname of the file
   */
  static dirname(pathStr: string): string {
    return path.dirname(pathStr);
  }

  /**
   * Gets environment variable.
   */
  static getEnvVariable(name: string): any {
    return process.env[name];
  }

}
