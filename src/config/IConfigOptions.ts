export interface IConfigOptions {
  namespace?: string
  type?: string,
  noCache?: boolean

  /**
   * Allow free key definitions
   */
  [k: string]: any

}
