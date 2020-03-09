interface RecordSupAppVersionParams {
    version: string;
    assets: string;
    microAppId: string;
    description?: string;
}
interface RefreshAppVersionParams {
    microId: string;
    microVersion: string;
    microAppVersion: string;
    microAppId: string;
}
interface AppVersionParams extends RecordSupAppVersionParams, RefreshAppVersionParams {
}
declare const _default: {
    recordRefresh(params: AppVersionParams): Promise<any>;
    recordSupAppVersion(params: RecordSupAppVersionParams): Promise<any>;
    refreshAppVersion(params: RefreshAppVersionParams): Promise<any>;
};
export default _default;
