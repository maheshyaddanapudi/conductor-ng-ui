const fs = require('fs');
// Configure Angular `environment.ts` file path
const targetPath = './src/environments/environment.ts';
const targetPathProd = './src/environments/environment.prod.ts';
// Load node modules
const colors = require('colors');
require('dotenv').load();
//const dotenv = require('dotenv')
//dotenv.load()
let DOCKER_MODE: boolean = false;
let WF_SERVER: string = 'http://localhost:8080/api'; 
let OAUTH_ENABLED: string = 'N';
let OAUTH_TOKEN_URL: string = 'http://localhost:9990/auth/realms/conductor/protocol/openid-connect/token';
//let OAUTH_USER_INFO_URL: string = 'http://localhost:9990/auth/realms/master/protocol/openid-connect/userinfo';
let OAUTH_USER_INFO_URL: string = 'http://localhost:8080/userinfo';
let OAUTH_CLIENT_ID: string = 'conductor_user_client';
let OAUTH_CLIENT_SECRET: string = '205bf09a-7df8-4c4a-9a79-c27efae878ab';
let OAUTH_LOGOUT_URL: string = 'http://localhost:9990/auth/realms/conductor/protocol/openid-connect/logout';
let LOG_AGGREGATOR_ANALYTICS_IFRAME_URL='http://localhost:5601/app/kibana#/dashboard/AXha5nuTVg2JJ__RTm0Q?embed=true&_g=(refreshInterval%3A(display%3AOff%2Cpause%3A!f%2Cvalue%3A0)%2Ctime%3A(from%3Anow%2Fd%2Cmode%3Aquick%2Cto%3Anow%2Fd))';
let API_HITS_COUNTER_ANALYTICS_IFRAME_URL='http://localhost:5601/app/kibana#/dashboard/AXha5afhVg2JJ__RTm0P?embed=true&_g=(refreshInterval%3A(display%3AOff%2Cpause%3A!f%2Cvalue%3A0)%2Ctime%3A(from%3Anow%2Fd%2Cmode%3Aquick%2Cto%3Anow%2Fd))';


if(DOCKER_MODE || process.env.DOCKER_MODE)
{
    if(DOCKER_MODE || process.env.DOCKER_MODE == 'true')
    {
        DOCKER_MODE = true

        console.log(colors.magenta('############## ENABLING DOCKER MODE BUILD ############## \n'));

        WF_SERVER = 'WF_SERVER_VALUE'
        OAUTH_TOKEN_URL = 'OAUTH_TOKEN_URL_VALUE'
        OAUTH_USER_INFO_URL = 'OAUTH_USER_INFO_URL_VALUE'
        OAUTH_LOGOUT_URL = 'OAUTH_LOGOUT_URL_VALUE'
        OAUTH_CLIENT_ID = 'OAUTH_CLIENT_ID_VALUE'
        OAUTH_CLIENT_SECRET = 'OAUTH_CLIENT_SECRET_VALUE'
        OAUTH_ENABLED = 'OAUTH_ENABLED_VALUE'
        LOG_AGGREGATOR_ANALYTICS_IFRAME_URL = 'LOG_AGGREGATOR_ANALYTICS_IFRAME_URL_VALUE'
        API_HITS_COUNTER_ANALYTICS_IFRAME_URL = 'API_HITS_COUNTER_ANALYTICS_IFRAME_URL_VALUE'
    }
}
else
{
    if(process.env.LOG_AGGREGATOR_ANALYTICS_IFRAME_URL){
        LOG_AGGREGATOR_ANALYTICS_IFRAME_URL = process.env.LOG_AGGREGATOR_ANALYTICS_IFRAME_URL
    }
    else{
        LOG_AGGREGATOR_ANALYTICS_IFRAME_URL = undefined
    }

    if(process.env.API_HITS_COUNTER_ANALYTICS_IFRAME_URL){
        API_HITS_COUNTER_ANALYTICS_IFRAME_URL = process.env.API_HITS_COUNTER_ANALYTICS_IFRAME_URL
    }
    else{
        API_HITS_COUNTER_ANALYTICS_IFRAME_URL = undefined
    }

    if(process.env.WF_SERVER){
        WF_SERVER = process.env.WF_SERVER
    }
    
    if(process.env.OAUTH_TOKEN_URL){
        OAUTH_TOKEN_URL = process.env.OAUTH_TOKEN_URL
    }
    
    if(process.env.OAUTH_USER_INFO_URL){
        OAUTH_USER_INFO_URL = process.env.OAUTH_USER_INFO_URL
    }
    
    if(process.env.OAUTH_LOGOUT_URL){
        OAUTH_LOGOUT_URL = process.env.OAUTH_LOGOUT_URL
    }
    
    if(process.env.OAUTH_CLIENT_ID){
        OAUTH_CLIENT_ID = process.env.OAUTH_CLIENT_ID
    }
    
    if(process.env.OAUTH_CLIENT_SECRET){
        OAUTH_CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET
    }
    
    if(process.env.OAUTH_ENABLED){
        if(process.env.OAUTH_ENABLED == 'Y')
        {
            OAUTH_ENABLED = 'Y'
        }
        else{
            OAUTH_ENABLED = 'N'
        }
    }
}


// `environment.ts` file structure
const envConfigFile = `export const environment = {
   WF_SERVER: '${WF_SERVER}',
   WF_SERVER_HC_TIME_INTERVAL_MS: 60000,
   OAUTH_TOKEN_URL: '${OAUTH_TOKEN_URL}',
   OAUTH_USER_INFO_URL: '${OAUTH_USER_INFO_URL}',
   OAUTH_LOGOUT_URL: '${OAUTH_LOGOUT_URL}',
   OAUTH_ENABLED: '${OAUTH_ENABLED}',
   OAUTH_CLIENT_ID: '${OAUTH_CLIENT_ID}',
   OAUTH_CLIENT_SECRET: '${OAUTH_CLIENT_SECRET}',
   LOG_AGGREGATOR_ANALYTICS_IFRAME_URL: '${LOG_AGGREGATOR_ANALYTICS_IFRAME_URL}',
   API_HITS_COUNTER_ANALYTICS_IFRAME_URL: '${API_HITS_COUNTER_ANALYTICS_IFRAME_URL}',
   production: true
};
`;

// `environment.prod.ts` file structure
const envConfigFileProd = `export const environment = {
    WF_SERVER: '${WF_SERVER}',
    WF_SERVER_HC_TIME_INTERVAL_MS: 60000,
    OAUTH_TOKEN_URL: '${OAUTH_TOKEN_URL}',
    OAUTH_USER_INFO_URL: '${OAUTH_USER_INFO_URL}',
    OAUTH_LOGOUT_URL: '${OAUTH_LOGOUT_URL}',
    OAUTH_ENABLED: '${OAUTH_ENABLED}',
    OAUTH_CLIENT_ID: '${OAUTH_CLIENT_ID}',
    OAUTH_CLIENT_SECRET: '${OAUTH_CLIENT_SECRET}',
    LOG_AGGREGATOR_ANALYTICS_IFRAME_URL: '${LOG_AGGREGATOR_ANALYTICS_IFRAME_URL}',
    API_HITS_COUNTER_ANALYTICS_IFRAME_URL: '${API_HITS_COUNTER_ANALYTICS_IFRAME_URL}',
    production: true
 };
 `;
console.log(colors.magenta('The file `environment.ts` will be written with the following content: \n'));
console.log(colors.grey(envConfigFile));
fs.writeFile(targetPath, envConfigFile, function (err) {
   if (err) {
       throw console.error(err);
   } else {
       console.log(colors.magenta(`Angular environment.ts file generated correctly at ${targetPath} \n`));
   }
});
console.log(colors.magenta('The file `environment.prod.ts` will be written with the following content: \n'));
console.log(colors.grey(envConfigFileProd));
fs.writeFile(targetPathProd, envConfigFileProd, function (err) {
    if (err) {
        throw console.error(err);
    } else {
        console.log(colors.magenta(`Angular environment.prod.ts file generated correctly at ${targetPathProd} \n`));
    }
 });