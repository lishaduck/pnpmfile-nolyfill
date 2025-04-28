/// Ported code from the Yarn plugin.

/**
 * A full list of nolyfilled packages.
 *
 * Based on <https://github.com/wojtekmaj/yarn-plugin-nolyfill/blob/main/src/index.ts>.
 * Keep in sync with <https://github.com/SukkaW/nolyfill/blob/master/packages/tools/cli/src/all-packages.ts>.
 * Do note that nolyfill doesn't use CD, so check that the versions listed there have been published.
 */
const allPackages: string[] = [
  "abab",
  "array-buffer-byte-length",
  "array-flatten",
  "array-includes",
  "array.from",
  "array.of",
  "array.prototype.at",
  "array.prototype.every",
  "array.prototype.find",
  "array.prototype.findlast",
  "array.prototype.findlastindex",
  "array.prototype.flat",
  "array.prototype.flatmap",
  "array.prototype.flatmap",
  "array.prototype.foreach",
  "array.prototype.reduce",
  "array.prototype.toreversed",
  "array.prototype.tosorted",
  "arraybuffer.prototype.slice",
  "assert",
  "asynciterator.prototype",
  "available-typed-arrays",
  "deep-equal",
  "deep-equal-json",
  "define-properties",
  "es-aggregate-error",
  "es-iterator-helpers",
  "es-set-tostringtag",
  "es6-object-assign",
  "function-bind",
  "function.prototype.name",
  "get-symbol-description",
  "globalthis",
  "gopd",
  "harmony-reflect",
  "has",
  "has-property-descriptors",
  "has-proto",
  "has-symbols",
  "has-tostringtag",
  "hasown",
  "internal-slot",
  "is-arguments",
  "is-array-buffer",
  "is-core-module",
  "is-date-object",
  "is-generator-function",
  "is-nan",
  "is-regex",
  "is-shared-array-buffer",
  "is-string",
  "is-symbol",
  "is-typed-array",
  "is-weakref",
  "isarray",
  "iterator.prototype",
  "json-stable-stringify",
  "jsonify",
  "number-is-nan",
  "object-is",
  "object-keys",
  "object.assign",
  "object.entries",
  "object.fromentries",
  "object.getownpropertydescriptors",
  "object.groupby",
  "object.hasown",
  "object.values",
  "promise.allsettled",
  "promise.any",
  "reflect.getprototypeof",
  "reflect.ownkeys",
  "regexp.prototype.flags",
  "safe-array-concat",
  "safe-regex-test",
  "set-function-length",
  "side-channel",
  "string.prototype.at",
  "string.prototype.codepointat",
  "string.prototype.includes",
  "string.prototype.matchall",
  "string.prototype.padend",
  "string.prototype.padstart",
  "string.prototype.repeat",
  "string.prototype.replaceall",
  "string.prototype.split",
  "string.prototype.startswith",
  "string.prototype.trim",
  "string.prototype.trimend",
  "string.prototype.trimleft",
  "string.prototype.trimright",
  "string.prototype.trimstart",
  "typed-array-buffer",
  "typed-array-byte-length",
  "typed-array-byte-offset",
  "typed-array-length",
  "typedarray",
  "typedarray.prototype.slice",
  "unbox-primitive",
  "util.promisify",
  "which-boxed-primitive",
  "which-typed-array",
];

/**
 * A map of all nolyfilled packages.
 * The keys are the original package names, the values are the nolyfilled package names.
 *
 * @type {Map<string, string>}
 */
const PATCHES: Map<string, string> = new Map(
  allPackages.map((name) => [name, `@nolyfill/${name}`])
);

/// Wiring code (pnpm specific)

const readPackage: ReadPackageHook = (pkg, context) => {
  // If the package has dependencies, check if any of them need to be nolyfilled.
  if (pkg.dependencies) {
    // Iterate over all dependencies.
    for (const name of Object.keys(pkg.dependencies)) {
      // Get the possible nolyfill package name.
      const nolyfill = PATCHES.get(name);

      // Check if there is nolyfill for the package.
      if (nolyfill !== undefined) {
        // Replace the original package with the nolyfill.
        pkg.dependencies[name] = `npm:${nolyfill}@^1`;

        // Tell the user that the package has been nolyfilled.
        context.log(`${name} => ${nolyfill}`);
      }
    }
  }

  // Return the (possibly modified) package.
  return pkg;
};

/// Exports

/**
 * A pnpmfile allows you to use hooks to modify the behavior of pnpm.
 *
 * From <https://pnpm.io/pnpmfile>.
 */
export const hooks = {
  readPackage,
};
