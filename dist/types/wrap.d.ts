interface Options {
    microName: string;
    lib?: string;
    afterContent?: string;
    beforeContent?: string;
}
export default class WrapMicroPlugin {
    private content;
    private microName;
    private afterContent;
    private beforeContent;
    constructor(options: Options);
    apply(compiler: any): void;
}
export {};
