import {CognitoUserPool} from 'amazon-cognito-identity-js'
// client web: 4d8g49qjqd8dp2ru9qc06lfgvv
    const poolData = {
        UserPoolId:'us-east-1_hWk4yrp9P',
        ClientId:'2krfohp9k07tklvl8j9fb1q817'
    }

    export default new CognitoUserPool(poolData)


