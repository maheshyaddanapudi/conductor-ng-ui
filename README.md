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
	
#### Note: To avoid CORS issue while running on local host, open chrom with disabled security. Example (For Mac) is as below and should be similar on other OS too.

	open -n -a /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --args --user-data-dir="/tmp/chrome_dev_test" --disable-web-security

### Application URLs

	http://localhost - To access Angular Web UI.
