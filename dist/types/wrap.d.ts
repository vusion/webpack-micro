interface Options {
    microName: string;
    afterContent?: string;
    beforeContent?: string;
}
export default class WrapMicroPlugin {
    private microName;
    private afterContent;
    private beforeContent;
    constructor(options: Options);
    apply(compiler: any): void;
}
export {};
