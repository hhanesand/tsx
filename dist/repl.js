import repl from 'repl';
import { transform } from '@esbuild-kit/core-utils';
import { v as version } from './package-5a2461d7.js';

console.log(
  `Welcome to tsx v${version} (Node.js ${process.version}).
Type ".help" for more information.`
);
const nodeRepl = repl.start();
const { eval: defaultEval } = nodeRepl;
const preEval = async function(code, context, filename, callback) {
  const transformed = await transform(
    code,
    filename,
    {
      loader: "ts",
      tsconfigRaw: {
        compilerOptions: {
          preserveValueImports: true
        }
      },
      define: {
        require: "global.require"
      }
    }
  ).catch(
    (error) => {
      console.log(error.message);
      return { code: "\n" };
    }
  );
  return defaultEval.call(this, transformed.code, context, filename, callback);
};
nodeRepl.eval = preEval;
