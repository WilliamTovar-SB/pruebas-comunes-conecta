import * as AWS from 'aws-sdk';
import * as constants from '../types/Constants';

class SSMParameterStore {
    private static instance: SSMParameterStore;
    private _parameters : Map<string, string>;
    private _region : string;
    private _path : string;
    private _env : string;

    private constructor() {
        this._parameters = new Map();
        this._region = '';
        this._path = '';
        this._env = '';
    }

    public static getInstance = () : SSMParameterStore => {
        SSMParameterStore.instance = SSMParameterStore.instance || new SSMParameterStore();
        return SSMParameterStore.instance;
    }

    public setRegion = (region: string) => {
        this._region = region;
    }

    public setPath = (stage: string) => {
        this._env = stage;
        this._path = `/firmaelectronica/${stage}`;
    }

    private setParameters = async () => {        
        console.log('settings setParameters');
        if (this._env !== 'local') {
            this._parameters.set(constants.URL_ONESPAN, process.env.URL_ONESPAN || "");
            this._parameters.set(constants.APIKEY_ONESPAN, process.env.APIKEY_ONESPAN+"==" || "");
            this._parameters.set(constants.TABLE, process.env.TABLE || "");
            this._parameters.set(constants.COMMONS_URL, process.env.COMMONS_URL || "");
            this._parameters.set(constants.COMMONS_API_KEY, process.env.COMMONS_API_KEY || "");
            this._parameters.set(constants.IP, process.env.IP || "");
        }
        else{
            this._parameters.set(constants.URL_ONESPAN, "https://sandbox.e-signlive.com/api");
            this._parameters.set(constants.APIKEY_ONESPAN, "UG1YcVdNYXk3ZFEzOnRQU0h4dGtZbk1jTQ==");
            this._parameters.set(constants.TABLE, "commons-dev-parametrizacion_firma_electronica");
            this._parameters.set(constants.COMMONS_URL, "https://fz73xehwah.execute-api.us-east-1.amazonaws.com/dev");
            this._parameters.set(constants.COMMONS_API_KEY, "2IrTvCrNUS3ETSNIMYNQS1QMnL03EZeZ6BNFaTOV");
            this._parameters.set(constants.IP, "");
        }
           
    }

    public getParameters = async () => {
        if(this._parameters.size === 0){
            await this.setParameters();
        }
        return this._parameters;
    } 
}

const Store = SSMParameterStore;

export default Store.getInstance();