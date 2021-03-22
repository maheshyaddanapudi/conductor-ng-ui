#!/usr/bin/env sh

WF_SERVER_DEFAULT="http://localhost:8080/api"; 
OAUTH_ENABLED_DEFAULT="N";
OAUTH_TOKEN_URL_DEFAULT="http://localhost:9990/auth/realms/conductor/protocol/openid-connect/token";
OAUTH_USER_INFO_URL_DEFAULT="http://localhost:8080/userinfo";
OAUTH_CLIENT_ID_DEFAULT="conductor_user_client";
OAUTH_CLIENT_SECRET_DEFAULT="8782ca99-decc-441a-8988-736350fafe67";
OAUTH_LOGOUT_URL_DEFAULT="http://localhost:9990/auth/realms/conductor/protocol/openid-connect/logout";
LOG_AGGREGATOR_ANALYTICS_IFRAME_URL_DEFAULT='undefined';
API_HITS_COUNTER_ANALYTICS_IFRAME_URL_DEFAULT='undefined';


echo "++===========================================================================================++"
echo "  Configuration from environment (nulls / empty values will be set to defaults. Refer ReadME)"
echo "++===========================================================================================++"
echo "  WF_SERVER : $WF_SERVER"
echo "  OAUTH_ENABLED : $OAUTH_ENABLED"
echo "  OAUTH_TOKEN_URL : $OAUTH_TOKEN_URL"
echo "  OAUTH_USER_INFO_URL : $OAUTH_USER_INFO_URL"
echo "  OAUTH_LOGOUT_URL : $OAUTH_LOGOUT_URL"
echo "  OAUTH_CLIENT_ID : $OAUTH_CLIENT_ID"
echo "  LOG_AGGREGATOR_ANALYTICS_IFRAME_URL : $LOG_AGGREGATOR_ANALYTICS_IFRAME_URL"
echo "  API_HITS_COUNTER_ANALYTICS_IFRAME_URL : $API_HITS_COUNTER_ANALYTICS_IFRAME_URL"
echo "++===========================================================================================++"
echo "  Starting Application Configuration. Pre Nginx Launch."
echo "++===========================================================================================++"

if [ $WF_SERVER ] ; 
    then 
        find '/usr/share/nginx/html' -name '*.js' -exec sed -i -e 's,WF_SERVER_VALUE,'"$WF_SERVER"',g' {} \; 
    else 
        find '/usr/share/nginx/html' -name '*.js' -exec sed -i -e 's,WF_SERVER_VALUE,'"$WF_SERVER_DEFAULT"',g' {} \; 
fi

if [ $OAUTH_ENABLED ] ; 
    then 
        find '/usr/share/nginx/html' -name '*.js' -exec sed -i -e 's,OAUTH_ENABLED_VALUE,'"$OAUTH_ENABLED"',g' {} \;
    else
        find '/usr/share/nginx/html' -name '*.js' -exec sed -i -e 's,OAUTH_ENABLED_VALUE,'"$OAUTH_ENABLED_DEFAULT"',g' {} \;
fi

if [ $OAUTH_TOKEN_URL ] ; 
    then 
        find '/usr/share/nginx/html' -name '*.js' -exec sed -i -e 's,OAUTH_TOKEN_URL_VALUE,'"$OAUTH_TOKEN_URL"',g' {} \; 
    else 
        find '/usr/share/nginx/html' -name '*.js' -exec sed -i -e 's,OAUTH_TOKEN_URL_VALUE,'"$OAUTH_TOKEN_URL_DEFAULT"',g' {} \; 
fi

if [ $OAUTH_USER_INFO_URL ] ; 
    then 
        find '/usr/share/nginx/html' -name '*.js' -exec sed -i -e 's,OAUTH_USER_INFO_URL_VALUE,'"$OAUTH_USER_INFO_URL"',g' {} \;
    else 
        find '/usr/share/nginx/html' -name '*.js' -exec sed -i -e 's,OAUTH_USER_INFO_URL_VALUE,'"$OAUTH_USER_INFO_URL_DEFAULT"',g' {} \;
fi

if [ $OAUTH_LOGOUT_URL ] ; 
    then 
        find '/usr/share/nginx/html' -name '*.js' -exec sed -i -e 's,OAUTH_LOGOUT_URL_VALUE,'"$OAUTH_LOGOUT_URL"',g' {} \;
    else 
        find '/usr/share/nginx/html' -name '*.js' -exec sed -i -e 's,OAUTH_LOGOUT_URL_VALUE,'"$OAUTH_LOGOUT_URL_DEFAULT"',g' {} \;
fi

if [ $OAUTH_CLIENT ] ; 
    then 
        find '/usr/share/nginx/html' -name '*.js' -exec sed -i -e 's,OAUTH_CLIENT_ID_VALUE,'"$OAUTH_CLIENT_ID"',g' {} \;
    else 
        find '/usr/share/nginx/html' -name '*.js' -exec sed -i -e 's,OAUTH_CLIENT_ID_VALUE,'"$OAUTH_CLIENT_ID_DEFAULT"',g' {} \;
fi

if [ $OAUTH_CLIENT_SECRET ] ; 
    then 
        find '/usr/share/nginx/html' -name '*.js' -exec sed -i -e 's,OAUTH_CLIENT_SECRET_VALUE,'"$OAUTH_CLIENT_SECRET"',g' {} \;
    else 
        find '/usr/share/nginx/html' -name '*.js' -exec sed -i -e 's,OAUTH_CLIENT_SECRET_VALUE,'"$OAUTH_CLIENT_SECRET_DEFAULT"',g' {} \;
fi

if [ $LOG_AGGREGATOR_ANALYTICS_IFRAME_URL ] ; 
    then 
        find '/usr/share/nginx/html' -name '*.js' -exec sed -i -e 's,LOG_AGGREGATOR_ANALYTICS_IFRAME_URL_VALUE,'"$LOG_AGGREGATOR_ANALYTICS_IFRAME_URL"',g' {} \;
    else 
        find '/usr/share/nginx/html' -name '*.js' -exec sed -i -e 's,LOG_AGGREGATOR_ANALYTICS_IFRAME_URL_VALUE,'"$LOG_AGGREGATOR_ANALYTICS_IFRAME_URL_DEFAULT"',g' {} \;
fi

if [ $API_HITS_COUNTER_ANALYTICS_IFRAME_URL ] ; 
    then 
        find '/usr/share/nginx/html' -name '*.js' -exec sed -i -e 's,API_HITS_COUNTER_ANALYTICS_IFRAME_URL_VALUE,'"$API_HITS_COUNTER_ANALYTICS_IFRAME_URL"',g' {} \;
    else 
        find '/usr/share/nginx/html' -name '*.js' -exec sed -i -e 's,API_HITS_COUNTER_ANALYTICS_IFRAME_URL_VALUE,'"$API_HITS_COUNTER_ANALYTICS_IFRAME_URL_DEFAULT"',g' {} \;
fi

echo "++===========================================================================================++"
echo "  Application Configuration Complete. Launching Nginx."
echo "++===========================================================================================++"

nginx -g "daemon off;"