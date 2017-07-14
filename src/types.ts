export type StringOrFunction = string | Function


export const DEFAULT_JAR_NAME: string = 'default';

export const SELECTOR_SEPARATOR: string = '.';


export const NAMING_BY_DIRECTORY:string = 'by_dirname';
export const NAMING_BY_FILENAME:string = 'by_filename';
export const NAMING_BY_DIRECTORYPATH:string = 'by_dirpath';
export const NAMING_BY_FULLPATH:string = 'by_filepath';


export type NamingResolvePattern = 'by_dirname' | 'by_filename' | 'by_dirpath' | 'by_filepath'