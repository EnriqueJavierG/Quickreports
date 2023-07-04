import React,{useState} from 'react'
import { useFormik } from 'formik';
import {TextField, Button} from '@material-ui/core';
import { CardContent } from '@material-ui/core';
import {Redirect, useHistory} from 'react-router-dom'
import { Auth} from 'aws-amplify';
import * as Yup from 'yup'
import {UserServices} from '../../services/UserServices'
import {Snackbar} from '@material-ui/core'
import { Alert } from '@material-ui/lab'
function LoginComp(props){
    // formik object
    let history = useHistory()
    const [errorLogin, setErrorLogin] = useState(false)
    const [errorAuth, setErrorAuth] = useState(false)

    const handleErrorLogClose= () =>{
        setErrorLogin(false)
    }

    const handleErrorAuthClose= () =>{
        setErrorAuth(false)
    }
    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema:Yup.object({
            email: Yup.string()
            .email('Email Invalid')
            .required('Required*'),
            password: Yup.string()
            .min(8, 'Must be  8 characters or more')
            .required('Required*'),
        }),
        onSubmit: async (values) => {
            // need to manage different cases if failed 
            let user
            try{
                user = await Auth.signIn(values.email, values.password);
            }catch{
                setErrorLogin(true)
            }
            const userAuth = await Auth.currentAuthenticatedUser()
            const userInfo = await Auth.currentUserInfo()
            // get attributes
            const attributes = await userInfo.attributes
            const name = attributes['name']
            const employeeId =attributes['custom:employeeId']
            console.log('Company Name',name)
            console.log('Attributes',attributes)
            localStorage.setItem('name',name)
            localStorage.setItem('id',employeeId)
            //const groups = await userAuth.signInUserSession.accessToken.payload["cognito:groups"]
            // getting all the attributes 
            const isApprover = attributes['custom:isApprover']
            const isValidator = attributes['custom:isValidator']
            const isClient = attributes['custom:isClient']
            const isCalibrator = attributes['custom:isCalibrator']

            let authRep = '';   
            if(isValidator==1){
                authRep = await UserServices.isEmployeeAuthorized(employeeId)
                console.log(authRep)
                if(!authRep){
                    setErrorAuth(true)
                    return props.userHasAuthenticated(false)
                }
            }
            
            else if(isCalibrator==1){
                authRep = await UserServices.isEmployeeAuthorized(employeeId)
                if(!authRep){
                    setErrorAuth(true)
                    return props.userHasAuthenticated(false)
                }
            }
            else if(isClient==1){
                authRep= await UserServices.isClientAuthorized(name)
                if(!authRep){
                    setErrorAuth(true)
                    return props.userHasAuthenticated(false)
                }
                
            }

            console.log(authRep)
            if(isApprover==1){
                console.log('approver')
                props.setRole(4)
            }
            else if(isValidator==1 && authRep){
                console.log('validator')
                props.setRole(1)
            }
            else if(isClient==1 && authRep){    
                console.log('cliente')
                props.setRole(3)
            }
            else if(isCalibrator==1 && authRep){
                props.setRole(2)
            }
            else{
                props.setRole(0)
            }
            history.push('/')
            props.setUser(user.username)      
            props.userHasAuthenticated(true)
            // return(<Redirect to='/' />)
        },
    })

  
    // jsx 
    return(
        <form onSubmit={formik.handleSubmit}>
            <div style={{minWidth:'430px' }}>
                <CardContent>
                    <TextField
                    placeholder='Email'
                    id="email"
                    name="email"
                    type="email"
                    variant='outlined'
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                    />
                </CardContent>
                <CardContent>
                    <TextField
                    placeholder='Password'
                    id="password"
                    name="password"
                    type="password"
                    variant='outlined'
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    error={formik.touched.password && Boolean(formik.errors.password)}
                    helperText={formik.touched.password && formik.errors.password}
                    />
                    </CardContent>
                    <CardContent><Button onClick={()=><Redirect to='/'></Redirect>} fullwidth color='primary' type="submit">Login</Button></CardContent>
                
                    <Snackbar open={errorLogin} autoHideDuration={3000} onClose={handleErrorLogClose}>
                        <Alert onClose={handleErrorLogClose} severity="error">
                            Email or Password is wrong
                        </Alert>
                    </Snackbar>
                    <Snackbar open={errorAuth} autoHideDuration={3000} onClose={handleErrorAuthClose}>
                        <Alert onClose={handleErrorAuthClose} severity="error">
                            User has not been authorized still
                        </Alert>
                    </Snackbar>
                </div>
        </form>
    )
}
export default LoginComp