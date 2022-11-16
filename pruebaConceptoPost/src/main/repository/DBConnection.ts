const AWS = require('aws-sdk');

export default class DBConnection {
    
    private static _instance: any;

    static getInstance(awsRegion: string) {
        
        if (!DBConnection._instance)  {
            DBConnection._instance = new AWS.DynamoDB.DocumentClient({ region: awsRegion });
        }
        return DBConnection._instance;
    }

}