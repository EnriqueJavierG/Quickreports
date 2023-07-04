import React, {createContext} from 'react'
import {CognitoUser, AuthenticationDetails} from 'amazon-cognito-identity-js'
import Pool from './UserPool'
const AccountContext = createContext()
function Accounts(props) {
    const authenticate = async (Username, Password) =>
    await new Promise((resolve, reject)=>{
        const user = new CognitoUser({Username, Pool})
        const authDetails = new AuthenticationDetails({Username, Password})

        user.authenticateUser(authDetails,{
            onSuccess: data =>{
                console.log('onSuccess', data)
                resolve(data)
            },
            onFailure: err =>{
                console.log('onFailure', err)
                reject(err)
            },
            newPasswordRequired: data =>{
                console.log('newPasswordRequired', data)
                resolve(data)
            }
        })
    })





    return (
        <AccountContext value={{
            authenticate
        }}>
            {props.children}
        </AccountContext>
    )
}

export {Accounts, AccountContext}

