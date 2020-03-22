interface Options {
    microName: string;
    lib?: string;
    global?: string[];
}
export default class WrapMicroPlugin {
    private content;
    private microName;
    constructor(options: Options);
    apply(compiler: any): void;
}
export {};
