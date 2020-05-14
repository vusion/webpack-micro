interface Options {
    latest: boolean;
    prefix: string;
    filename: string;
    entryName: string;
    microName: string;
}
export default class MicroPlugin {
    options: Options;
    constructor(options: Options);
    apply(compiler: any): void;
    recordAssets(compilation: any, data: any): void;
}
export {};
