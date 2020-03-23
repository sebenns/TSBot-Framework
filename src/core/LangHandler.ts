import {FileLoader} from '../utils/FileLoader';

/**
 * Language Handler (Wrapper for FileLoader):
 *  <ul>
 *      <li>Allows the easy loading of language.json files from the command directory.
 *      <li>You only have to provide the directory file for your language file.
 *      <li>Split your language files or put everything in one file - as you wish.
 * </ul>
 * @category Core
 */
export class LangHandler
{
    private static langLoader = new FileLoader();

    /**
     * Requires language file stored in provided directory named as 'language.json'
     *
     * ```typescript
     *
     * // Currently in PrideCMD directory (commands/PrideCMD/language.json)
     * public execute(...)
     * {
     *     const lang: LangHandler.getLanguage(__dirname);
     *     lang['test'];
     *     lang.test;
     * }
     *
     * ```
     *
     * @param {string} dir Directory with your 'language.json' file
     * @returns {any} JSON Object with contents
     */
    public static getLanguage(dir: string): any
    {
        this.langLoader.requireFiles(`${dir}/language.json`);
        const fileList = this.langLoader.getFileList();
        return fileList['language.json'] ? fileList['language.json'].contents : {};
    }
}
