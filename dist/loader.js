import { r as require } from './pkgroll_create-require-631dad03.js';
import repl from 'repl';
import { transform } from '@esbuild-kit/core-utils';
export * from '@esbuild-kit/esm-loader';
import 'module';

function patchEval(nodeRepl) {
  const { eval: defaultEval } = nodeRepl;
  const preEval = async function(code, context, filename, callback) {
    try {
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
      );
      code = transformed.code;
    } catch {
    }
    return defaultEval.call(this, code, context, filename, callback);
  };
  nodeRepl.eval = preEval;
}
const { start } = repl;
repl.start = function() {
  const nodeRepl = Reflect.apply(start, this, arguments);
  patchEval(nodeRepl);
  return nodeRepl;
};

require("@esbuild-kit/cjs-loader");
