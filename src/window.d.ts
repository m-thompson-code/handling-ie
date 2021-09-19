// source: https://www.typescriptlang.org/docs/handbook/declaration-merging.html#global-augmentation
export {};

declare global {
    interface Window {
        /**
         * Used to detect if browser has es6 support. When nomodule is true, current browser does not support es6 (like IE 11)
         */
        // TODO: Remove nomodule property once es5 browsers are no longer supported
        nomodule?: boolean;
    }
}