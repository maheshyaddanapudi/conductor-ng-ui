# Conductor NG UI
## Task & Workflow Definitions Management
## Workflow Execution Management
## Analytic Dashboards


[![SonarCloud](https://sonarcloud.io/images/project_badges/sonarcloud-black.svg)](https://sonarcloud.io/dashboard?id=maheshyaddanapudi_conductor-ng-ui)

Before starting, for details on Conductor Boot, refer to <a href="https://github.com/maheshyaddanapudi/conductor-boot/blob/main/README.md">Conductor Boot Documentation</a>

## Overview

The idea is to build a single production grade Angular Web UI, to let the user interact with Conductor API, for the following
      
      • Task definitions - Create / View / Update / Delete / Requeue Task / See Polling Data

      • Workflow definitions - View / Execute / Delete

      • Workflow Executions - View / Pause / Resume / Terminate / Retry / Restart / Archive / Delete

## Motivation

To avoid the pain points of

      • Referring to documentation manually and then develop / write Request JSONs for API requests.
      
      • Better visual representation of the workflows and tasks.

## Tech / Framework used

      --> Docker Image to host the Angular Web UI. 
	  			
      --> Angular 7 

            Used an existing "Architect UI" template for development

## Code quality

SonarQube: [![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=maheshyaddanapudi_conductor-ng-ui&metric=alert_status)](https://sonarcloud.io/dashboard?id=maheshyaddanapudi_conductor-ng-ui)

## Build using Node

    npm run build
      - for development build
    npm run build-prod
      - for production build
		
	The node build should place the build content inside the target dist/conductor-ng-ui folder.

## Containerization CI (Continuous Integration)

| CI Provider | Status          |
| ------- | ------------------ |
| Docker   | ![Docker](https://github.com/maheshyaddanapudi/conductor-ng-ui/workflows/Docker/badge.svg?branch=main) |
| Docker Image CI   | ![Docker Image CI](https://github.com/maheshyaddanapudi/conductor-ng-ui/workflows/Docker%20Image%20CI/badge.svg?branch=main) |

Docker Image published to <a href="https://hub.docker.com/repository/docker/zzzmahesh/conductor-ng-ui" target="_blank">DockerHub here</a>

To pull the image :

	docker pull zzzmahesh/conductor-ng-ui

## Run Conductor NG UI : Standalone

	cd <to project root folder>
		
    Below command will start the Conductor NG UI

    	export WF_SERVER=http://localhost:8080/api
	
    	export OAUTH_ENABLED=N
	
    	npm run server

    Replace your Conductor Server Endpoint accordingly

#### Note: To avoid CORS issue while running on local host, open chrom with disabled security. Example (For Mac) is as below and should be similar on other OS too.

	open -n -a /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --args --user-data-dir="/tmp/chrome_dev_test" --disable-web-security

### Application URLs

	http://localhost:4200/ - To access Angular Web UI.

## Run Conductor NG UI : Docker

To run the container :

    docker run --name conductor-ng-ui -p 80:80 -d zzzmahesh/conductor-ng-ui:latest

Few other examples / ways / configurations to run the container as:

    Running with a complete suite - Consisting of a OAUTH2.0 Login Validation

        docker run --name conductor-ng-ui -p 80:80 \
            -e WF_SERVER=http://localhost:8080/api
            -e OAUTH_ENABLED=Y
            -e OAUTH_TOKEN_URL=http://localhost:9990/auth/realms/master/protocol/openid-connect/token
            -e OAUTH_USER_INFO_URL=http://localhost:8080/userinfo
            -e OAUTH_LOGOUT_URL=http://localhost:9990/auth/realms/master/protocol/openid-connect/logout
            -e OAUTH_CLIENT_ID=conductor_user_client
            -e OAUTH_CLIENT_SECRET=8782ca99-decc-441a-8988-736350fafe67
            -d zzzmahesh/conductor-ng-ui:latest

    All the above mentioned environment variables with start with OAUTH_ should be provided accordingly.

    Note: If you are using Conductor Boot instead of pure conductor, then the userinfo url will http://<<conductor_server_url>>/userinfo . Here the conductor_server_url refers to the base url and not the API endpoint.

#### Note: To avoid CORS issue while running on local host, open chrom with disabled security. Example (For Mac) is as below and should be similar on other OS too.

	open -n -a /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --args --user-data-dir="/tmp/chrome_dev_test" --disable-web-security

### Application URLs

	http://localhost - To access Angular Web UI.

## Run Conductor NG UI : Docker Compose

    1) A simple setup

        docker-compose up -d

    2) A full fledged setup

        docker-compose -f docker-compose-suite.yml up -d
	
#### Note: For a full suite, it is assumed, the persistence also will be expected to be mapped. Hence create the below folder structure before "A full fledged setup"

	mkdir container container/persistence container/persistence/mysql container/persistence/postgres container/persistence/elasticsearch
	
#### Note: To avoid CORS issue while running on local host, open chrom with disabled security. Example (For Mac) is as below and should be similar on other OS too.

	open -n -a /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --args --user-data-dir="/tmp/chrome_dev_test" --disable-web-security

### Application URLs

	http://localhost - To access Angular Web UI.
	
## Sample Web UI Screenshots

#### Login

![Screenshot 2021-03-23 at 12 31 45 AM](https://user-images.githubusercontent.com/24351133/112046181-b5a53300-8b71-11eb-9504-0d1099dfc97f.png)

#### Home Page - Swagger UI (read only mode)

![Screenshot 2021-03-23 at 12 32 00 AM](https://user-images.githubusercontent.com/24351133/112046239-c8b80300-8b71-11eb-9858-7b70db8c6fa9.png)

#### Workflow Analytics Dashboards

##### API Hits Counter

![Screenshot 2021-03-23 at 12 32 28 AM](https://user-images.githubusercontent.com/24351133/112046323-e2594a80-8b71-11eb-8cc7-f03910e19738.png)

##### Workflow Execution Analytics

![Screenshot 2021-03-23 at 12 32 46 AM](https://user-images.githubusercontent.com/24351133/112046369-f309c080-8b71-11eb-88af-cde9b7c7a2d2.png)


##### Execitions and Definitions Stats

![Screenshot 2021-03-23 at 12 33 05 AM](https://user-images.githubusercontent.com/24351133/112046432-087eea80-8b72-11eb-9263-07f421583d1f.png)


#### Log Aggregation Analytics Dashboard

##### Log Levels and Java Class invocations

![Screenshot 2021-03-23 at 12 33 31 AM](https://user-images.githubusercontent.com/24351133/112046509-23e9f580-8b72-11eb-8188-8de4c2858295.png)

##### Error and Pending Tasks Counter

![Screenshot 2021-03-23 at 12 33 42 AM](https://user-images.githubusercontent.com/24351133/112046571-39f7b600-8b72-11eb-9794-a0fb8b6c2fe0.png)

#### Create Task Definition

![Screenshot 2021-03-23 at 12 55 30 AM](https://user-images.githubusercontent.com/24351133/112047787-b3dc6f00-8b73-11eb-83a4-a194078cc833.png)

![Screenshot 2021-03-23 at 12 55 59 AM](https://user-images.githubusercontent.com/24351133/112047809-bb9c1380-8b73-11eb-83c6-44142e7342bc.png)

![Screenshot 2021-03-23 at 12 56 34 AM](https://user-images.githubusercontent.com/24351133/112047824-c0f95e00-8b73-11eb-9e7f-9e2281e2a3c0.png)

![Screenshot 2021-03-23 at 12 56 47 AM](https://user-images.githubusercontent.com/24351133/112047828-c35bb800-8b73-11eb-8642-fcb96749f3fd.png)

![Screenshot 2021-03-23 at 12 56 58 AM](https://user-images.githubusercontent.com/24351133/112047835-c5257b80-8b73-11eb-9070-6f1b72ced9a1.png)


#### View Task Definitions

![Screenshot 2021-03-23 at 12 57 10 AM](https://user-images.githubusercontent.com/24351133/112047886-d53d5b00-8b73-11eb-9123-3cf94b42366b.png)

![Screenshot 2021-03-23 at 12 57 21 AM](https://user-images.githubusercontent.com/24351133/112048037-0584f980-8b74-11eb-98d6-90d6b3bb64f7.png)

![Screenshot 2021-03-23 at 12 57 25 AM](https://user-images.githubusercontent.com/24351133/112048061-087fea00-8b74-11eb-90eb-d39de6689677.png)

![Screenshot 2021-03-23 at 12 57 29 AM](https://user-images.githubusercontent.com/24351133/112048069-0a49ad80-8b74-11eb-88b5-a6dda0654dc4.png)

![Screenshot 2021-03-23 at 12 57 36 AM](https://user-images.githubusercontent.com/24351133/112048080-0cac0780-8b74-11eb-8f0d-d6cdd2e55033.png)

![Screenshot 2021-03-23 at 12 57 44 AM](https://user-images.githubusercontent.com/24351133/112048087-0e75cb00-8b74-11eb-8288-4050a440ca21.png)

![Screenshot 2021-03-23 at 12 57 49 AM](https://user-images.githubusercontent.com/24351133/112048088-0fa6f800-8b74-11eb-84fe-07bafaf465b1.png)

#### View Task Definition Detail

![Screenshot 2021-03-23 at 12 58 02 AM](https://user-images.githubusercontent.com/24351133/112048133-19306000-8b74-11eb-8a98-84e92f8dc94a.png)

![Screenshot 2021-03-23 at 12 58 15 AM](https://user-images.githubusercontent.com/24351133/112048148-1c2b5080-8b74-11eb-90ed-b12f2db3e0b5.png)

#### View Workflow Definitions

![Screenshot 2021-03-23 at 12 58 29 AM](https://user-images.githubusercontent.com/24351133/112048217-2fd6b700-8b74-11eb-81be-41fb55c95aae.png)

![Screenshot 2021-03-23 at 12 58 38 AM](https://user-images.githubusercontent.com/24351133/112048231-336a3e00-8b74-11eb-932b-53845fbce049.png)

![Screenshot 2021-03-23 at 12 58 44 AM](https://user-images.githubusercontent.com/24351133/112048241-35cc9800-8b74-11eb-98d2-ffcfcfe5a9eb.png)

![Screenshot 2021-03-23 at 12 58 50 AM](https://user-images.githubusercontent.com/24351133/112048249-382ef200-8b74-11eb-95c5-254b05289694.png)

![Screenshot 2021-03-23 at 12 58 58 AM](https://user-images.githubusercontent.com/24351133/112048260-39f8b580-8b74-11eb-8775-4262e841ef58.png)

![Screenshot 2021-03-23 at 12 59 02 AM](https://user-images.githubusercontent.com/24351133/112048267-3bc27900-8b74-11eb-9609-e03f226121f1.png)

#### View Workflow Definition Detail

![Screenshot 2021-03-23 at 12 59 14 AM](https://user-images.githubusercontent.com/24351133/112048346-50067600-8b74-11eb-953c-33e008d349e6.png)

![Screenshot 2021-03-23 at 12 59 33 AM](https://user-images.githubusercontent.com/24351133/112048362-54cb2a00-8b74-11eb-8a08-38008c280451.png)

![Screenshot 2021-03-23 at 1 00 17 AM](https://user-images.githubusercontent.com/24351133/112048401-5eed2880-8b74-11eb-9226-3d00472143e3.png)

![Screenshot 2021-03-23 at 1 00 26 AM](https://user-images.githubusercontent.com/24351133/112048412-61e81900-8b74-11eb-869f-bf6524ae0d84.png)

![Screenshot 2021-03-23 at 1 00 39 AM](https://user-images.githubusercontent.com/24351133/112048423-64e30980-8b74-11eb-8101-c2668c6fa03a.png)

#### View Workflow Executions

![Screenshot 2021-03-23 at 1 00 56 AM](https://user-images.githubusercontent.com/24351133/112048469-74fae900-8b74-11eb-8bbe-2c4b3afc3ad0.png)

![Screenshot 2021-03-23 at 1 01 09 AM](https://user-images.githubusercontent.com/24351133/112048482-77f5d980-8b74-11eb-93ca-6580a2b96857.png)

![Screenshot 2021-03-23 at 1 01 26 AM](https://user-images.githubusercontent.com/24351133/112048491-79bf9d00-8b74-11eb-892d-2e6dca84cf97.png)

#### View Workflow Execution Detail

![Screenshot 2021-03-23 at 1 01 46 AM](https://user-images.githubusercontent.com/24351133/112048541-880db900-8b74-11eb-8229-0e9f3979684e.png)

![Screenshot 2021-03-23 at 1 02 12 AM](https://user-images.githubusercontent.com/24351133/112048558-8b08a980-8b74-11eb-9c47-59dc89fa8648.png)

![Screenshot 2021-03-23 at 1 02 33 AM](https://user-images.githubusercontent.com/24351133/112048565-8e039a00-8b74-11eb-988d-d327a5d4475a.png)

#### System Configuration and Queue Poll Data

![Screenshot 2021-03-23 at 1 02 54 AM](https://user-images.githubusercontent.com/24351133/112048640-a2e02d80-8b74-11eb-9172-03d045640ad6.png)

![Screenshot 2021-03-23 at 1 03 02 AM](https://user-images.githubusercontent.com/24351133/112048652-a5db1e00-8b74-11eb-9117-0e49135e80ce.png)

#### User Profile 

![Screenshot 2021-03-23 at 1 03 13 AM](https://user-images.githubusercontent.com/24351133/112048690-aecbef80-8b74-11eb-9640-e95ead4e7ef1.png)