'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var pkgroll_createRequire = require('./pkgroll_create-require-2198c66a.cjs');
var repl = require('repl');
var coreUtils = require('@esbuild-kit/core-utils');
var esmLoader = require('@esbuild-kit/esm-loader');
require('module');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var repl__default = /*#__PURE__*/_interopDefaultLegacy(repl);

function patchEval(nodeRepl) {
  const { eval: defaultEval } = nodeRepl;
  const preEval = async function(code, context, filename, callback) {
    try {
      const transformed = await coreUtils.transform(
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
const { start } = repl__default["default"];
repl__default["default"].start = function() {
  const nodeRepl = Reflect.apply(start, this, arguments);
  patchEval(nodeRepl);
  return nodeRepl;
};

pkgroll_createRequire.require("@esbuild-kit/cjs-loader");

Object.keys(esmLoader).forEach(function (k) {
	if (k !== 'default' && !exports.hasOwnProperty(k)) Object.defineProperty(exports, k, {
		enumerable: true,
		get: function () { return esmLoader[k]; }
	});
});
