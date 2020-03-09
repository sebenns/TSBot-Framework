import * as ts from 'typescript';

export class TSCompiler
{
    /**
     * Compiles a list of typescript files to javascript
     * @author leehao: https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API
     * @param {string[]} fileList - list of filePaths
     * @param {ts.CompilerOptions} options - compiler options to provide
     */
    public static compile(fileList: string[], options: ts.CompilerOptions): void
    {
        const program = ts.createProgram(fileList, options);
        const emitResult = program.emit();

        const allDiagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);

        allDiagnostics.forEach(diagnostic =>
        {
            if (diagnostic.file)
            {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                const {line, character} = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start!);
                const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
                console.log(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
            }
            else
            {
                console.log(ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'));
            }
        });
    }
}
