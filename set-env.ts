const fs = require('fs');
// Configure Angular `environment.ts` file path
const targetPath = './src/environments/environment.ts';
// Load node modules
const colors = require('colors');
require('dotenv').load();

let WF_SERVER: string = 'http://localhost:8080/api'; 

if(process.env.WF_SERVER){
    WF_SERVER = process.env.WF_SERVER
}

// `environment.ts` file structure
const envConfigFile = `export const environment = {
   WF_SERVER: '${WF_SERVER}',
   WF_SERVER_HC_TIME_INTERVAL_MS: 60000,
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