interface Options {
    microName: string;
    entry: string;
    afterContent?: string;
    beforeContent?: string;
}
export default class WrapMicroPlugin {
    private microName;
    private afterContent;
    private beforeContent;
    private entry;
    constructor(options: Options);
    apply(compiler: any): void;
}
export {};
