import { recordMicroAppVersion, refreshMicroVersion } from 'vusion-api/out/ms';
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
interface AppVersionParams extends RecordSupAppVersionParams,RefreshAppVersionParams {

}
const check = {
    recordSupAppVersion(params: RecordSupAppVersionParams): Promise<void> | void {
        const {
            version,
            assets,
            microAppId,
        } = params;
        if (!version || !assets || !microAppId) {
            console.error('params missing');
            return Promise.reject();
        }
    },
    refreshAppVersion(params: RefreshAppVersionParams): Promise<void> | void {
        const {
            microId,
            microVersion,
            microAppVersion,
            microAppId,
        } = params;
        if (!microId || !microAppVersion || !microVersion || !microAppId) {
            console.error('params missing');
            return Promise.reject();
        }
    },
};
export default {
    recordRefresh(params: AppVersionParams): Promise<any> {
        const result = check.recordSupAppVersion(params) || check.refreshAppVersion(params);
        if (result) {
            return result;
        }
        return this.recordSupAppVersion(params).then((): Promise<any> => this.refreshAppVersion(params));
    },

    recordSupAppVersion(params: RecordSupAppVersionParams): Promise<any> {
        const result = check.recordSupAppVersion(params);
        if (result) {
            return result;
        }
        const {
            version,
            assets,
            microAppId,
            description,
        } = params;
        return recordMicroAppVersion({
            version,
            assets,
            description,
            microAppId,
        });
    },
    refreshAppVersion(params: RefreshAppVersionParams): Promise<any> {
        const result = check.refreshAppVersion(params);
        if (result) {
            return result;
        }
        const {
            microId,
            microVersion,
            microAppVersion,
            microAppId,
        } = params;
        return refreshMicroVersion({
            microId,
            microVersion,
            microAppVersion,
            microAppId,
        });
    },
};
