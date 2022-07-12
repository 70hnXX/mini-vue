var VueReactivity = (() => {
  // packages/shared/src/index.ts
  var isObject = (value) => {
    return typeof value === "object" && value !== null;
  };

  // packages/reactivity/src/index.ts
  console.log(isObject(true));
  console.log(isObject(123));
})();
//# sourceMappingURL=reactivity.global.js.map