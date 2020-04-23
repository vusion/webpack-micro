interface Options {
    microName: string;
    entry: string;
}
export default class WrapMicroPlugin {
    private microName;
    private entry;
    constructor(options: Options);
    apply(compiler: any): void;
}
export {};
