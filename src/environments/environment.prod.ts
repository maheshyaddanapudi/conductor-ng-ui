export const environment = {
    WF_SERVER: 'http://localhost:8080/api',
    WF_SERVER_HC_TIME_INTERVAL_MS: 60000,
    OAUTH_TOKEN_URL: 'http://localhost:9990/auth/realms/master/protocol/openid-connect/token',
    OAUTH_USER_INFO_URL: 'http://localhost:8080/userinfo',
    OAUTH_LOGOUT_URL: 'http://localhost:9990/auth/realms/master/protocol/openid-connect/logout',
    OAUTH_ENABLED: 'N',
    OAUTH_CLIENT_ID: 'conductor_user_client',
    OAUTH_CLIENT_SECRET: '205bf09a-7df8-4c4a-9a79-c27efae878ab',
    LOG_AGGREGATOR_ANALYTICS_IFRAME_URL: 'undefined',
    API_HITS_COUNTER_ANALYTICS_IFRAME_URL: 'undefined',
    production: true
 };
 