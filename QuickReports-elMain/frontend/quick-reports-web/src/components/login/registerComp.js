import React, {useState} from 'react'
import { useFormik } from 'formik';
import {TextField, Button, Typography} from '@material-ui/core';
import { CardContent, Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { Auth} from 'aws-amplify';
import * as Yup from 'yup'
import MenuItem from '@material-ui/core/MenuItem'
import {UserServices} from '../../services/UserServices'
function RegisterComp(props) {
    
    const [codeSent , setCodeSent] = useState(false)
    const [redirect , setRedirect] = useState(false)
    const [username , setUsername] = useState('')
    const [userClass,setUserClass] = useState('')
    const [employeeIdExist, setEmployeeIdExist] = useState(false)
    const [userRegistered, setUserRegistered] = useState(true)
    // form 0 choose between employee or client
    // form 1 inside employee
    // form 2 inside client
    const [form, setForm] = useState(0) 

    const handleUserRegistered = () =>{
        setUserRegistered(false)
    }
    const handleEmployeeIdExist =()=>{
        setEmployeeIdExist(false)
    }
    const formik = useFormik({
        initialValues: {
            firstName:'',
            lastName:'',
            email: '',
            emailCopy:'',
            password: '',
            passwordCopy: '',
            role:'Validator',
            employeeId:''
        }, 
        validationSchema:Yup.object({
            firstName: Yup.string()
            .max(15, 'Must be  15 characters or less')
            .min(2, 'Must be  2 characters or more')
            .required('Required*'),
            lastName: Yup.string(),
            email: Yup.string()
            .email('Email Invalid')
            .required('Required*'),
            emailCopy: Yup.string()
            .email('Email Invalid')
            .oneOf([Yup.ref('email'), null], 'Emails must match')
            .required('Required*'),
            password: Yup.string()
            .min(8, 'Must be  8 characters or more')
            .required('Required*'),
            passwordCopy: Yup.string()
            .min(8, 'Must be  8 characters or more')
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
            .required('Required*'),
    
        }),
        onSubmit: async (values) => {
            // Manage difference in emails
            if(values.email !== values.emailCopy){
                alert('Emails do not match ')
            }
            // Manage difference in emails
            if(values.password !== values.passwordCopy){
                alert('Passwords do not match')
            }
            let roles ={
                'custom:isValidator':'0',
                'custom:isCalibrator':'0',
                'custom:isApprover':'0',
                'custom:isClient':'0'
            }
            switch (values.role) {
                case 'Validator':
                    roles['custom:isValidator'] = '1'
                    break;
                case 'Calibrator':
                    roles['custom:isCalibrator'] = '1'
                    break;
                case 'Approver':
                    roles['custom:isApprover'] = '1'
                    break;
                default:
                    break;
            }
            try{
                const allEmployees = await UserServices.getAllReporters()
                for(var i =0; i < allEmployees.length; i++){
                    if(values.employeeId == allEmployees[i].employeeId){
                        // set alert
                        setEmployeeIdExist(true)
                        return
                    }
                }
            }catch{
                console.log('Fallo')
            }
            
            const {user} = await Auth.signUp({username:values.email, password:values.password ,attributes:{
                email:values.email,
                name: values.firstName + ' ' + values.lastName,
                'custom:employeeId':values.employeeId,
                ...roles
            }})
            setCodeSent(true)
            setUsername(values.email)
        },
    })

    const company_formik = useFormik({
        initialValues: {
            companyName:'',
            email: '',
            emailCopy:'',
            password: '',
            passwordCopy: '',
        },
        
        onSubmit: async (values) => {
            // Manage difference in emails
            if(values.email !== values.emailCopy){
                alert('Emails do not match ')
            }
            // Manage difference in emails
            if(values.password !== values.passwordCopy){
                alert('Passwords do not match')
            }
            const {user} = await Auth.signUp({username:values.email, password:values.password ,attributes:{
                email:values.email,
                name: values.companyName,
                'custom:isClient':'1'
            }})

            setCodeSent(true)
            setUsername(values.email)

        }
    })
    // formik for code 
    const code_formik = useFormik({
        initialValues:{
            code:'',
            username:formik.values.username
        },
        
        onSubmit: (values) => {
            // After retrieveing the confirmation code from the user
            console.log(username)
            Auth.confirmSignUp(username, values.code, {
                // Optional. Force user confirmation irrespective of existing alias. By default set to True.
                forceAliasCreation: true
            }).then(data => 
                {
                    console.log(data)
                    let role
                    if(formik.values.role ==='Validator'){
                        role = 'validate'
                        let reporter = {
                            employeeId:formik.values.employeeId,
                            fname:formik.values.firstName,
                            lname:formik.values.lastName,
                            role:role // 'validate' or 'calibrate'
                        }
                        UserServices.createNewReporter(reporter)
                        .then(data=>{
                            console.log(data)
                        }).
                        catch(err=>{
                            console.log(err)
                        })
                    }
                    else if(formik.values.role ==='Calibrator'){
                        role = 'calibrate'
                        let reporter = {
                            employeeId:formik.values.employeeId,
                            fname:formik.values.firstName,
                            lname:formik.values.lastName,
                            role:role // 'validate' or 'calibrate'
                        }
                        UserServices.createNewReporter(reporter)
                        .then(data=>{
                            console.log(data)
                        }).
                        catch(err=>{
                            
                            console.log(err)
                        })
                    }
                    else{
                        let approver = {
                            approverFname: formik.values.firstName,
                            approverLname: formik.values.lastName,
                            approverEmployeeId: formik.values.employeeId,
                        }
                        UserServices.createNewApprover(approver)
                        .then(data=>{
                            console.log(data)
                        }).catch(err=>{
                            console.log(err)
                        })

                    }
                    setRedirect(true)
                })
                .catch(err => {
                    console.log(err)
                });
        }   

    })

    // formik for code 
    const code_formik_company = useFormik({
        initialValues:{
            code:'',
            username:company_formik.values.companyName
        },
        
        onSubmit: (values) => {
            // After retrieveing the confirmation code from the user
            console.log(username)
            Auth.confirmSignUp(username, values.code, {
                // Optional. Force user confirmation irrespective of existing alias. By default set to True.
                forceAliasCreation: true
            }).then(data => 
                {

                    let client ={
                        clientName: company_formik.values.companyName,
                        email: company_formik.values.email,
                        telephone:''
                    }

                    UserServices.createNewClient(client).then(data=>{
                        console.log(data)
                    }).catch(err=>console.log(err))

                    setRedirect(true)
                })
                .catch(err => console.log(err));
        }   

    })
    // save selected useClassType
    const handleChangeSelectUser =(e)=>{
        const user = e.target.value
        setUserClass(user)
    }
    // handle submit userClass
    const handleSubmitSelectUser = () =>{
        if(userClass ==='Employee') setForm(1)
        if(userClass ==='Client') setForm(2)
        if(userClass ==='Approver') setForm(1)
    }
    // jsx code 
    if(redirect){
        props.setRegister(!props.register)
        return null
    }
    if(!codeSent){
        if(form === 0){ // choose employye or client
            return(
                <div style={{minWidth:'430px'}}>
                    <Typography>Who are you?</Typography>
                    <TextField 
                    select
                    placeholder='User Type'
                    id="selectUser"
                    name="selectUser"
                    variant='outlined'
                    value={userClass}
                    onChange={handleChangeSelectUser}
                    >
                        <MenuItem key='Employee' value='Employee'>Employee</MenuItem>
                        <MenuItem key='Approver' value='Approver'>Approver</MenuItem>
                        <MenuItem key='Client' value='Client'>Client</MenuItem>
                    </TextField>
                    <CardContent fullwidth>
                        <Button fullwidth color='primary' onClick={() => props.setRegister(!props.register)} >Cancel</Button>
                        <Button fullwidth color='primary' onClick={handleSubmitSelectUser}>Continue</Button>
                    </CardContent>
                </div>
            )
        }
        if(form === 1){ // employee
            return (
                <form onSubmit={formik.handleSubmit}>
                    <div style={{minWidth:'430px'}}>
                        <CardContent>
                            <TextField
                            placeholder='First Name'
                            id="firstName"
                            name="firstName"
                            variant='outlined'
                            value={formik.values.firstName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                            helperText={formik.touched.firstName && formik.errors.firstName}
                            />
                            <TextField
                            placeholder='Last Name'
                            id="lastName"
                            name="lastName"
                            variant='outlined'
                            value={formik.values.lastName}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                            helperText={formik.touched.lastName && formik.errors.lastName}
                            />
                            </CardContent>
                            <CardContent>
                            <TextField
                            placeholder='Email'
                            id="email"
                            name="email"
                            type="email"
                            variant='outlined'
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email}
                            />
                            <TextField
                            placeholder='Confirm Email'
                            id="emailCopy"
                            name="emailCopy"
                            type="email"
                            variant='outlined'
                            value={formik.values.emailCopy}
                            onChange={formik.handleChange}
                            error={formik.touched.emailCopy && Boolean(formik.errors.emailCopy)}
                            helperText={formik.touched.emailCopy && formik.errors.emailCopy}
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
                            onBlur={formik.handleBlur}
                            error={formik.touched.password && Boolean(formik.errors.password)}
                            helperText={formik.touched.password && formik.errors.password}
                            />
                            <TextField
                            placeholder='Confirm Password'
                            id="passwordCopy"
                            name="passwordCopy"
                            type="password"
                            variant='outlined'
                            value={formik.values.passwordCopy}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            error={formik.touched.passwordCopy && Boolean(formik.errors.passwordCopy)}
                            helperText={formik.touched.passwordCopy && formik.errors.passwordCopy}
                            />
                            </CardContent>
                            <CardContent>
                                <TextField
                                defaultValue={formik.values.role}
                                fullwidth
                                placeholder='Role'
                                id="role"
                                name="role"
                                select
                                variant='outlined'
                                value={formik.values.role}
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                label='Group'
                                >
                                    <MenuItem key='Validator' value='Validator'>Validator</MenuItem>
                                    <MenuItem key='Calibrator' value='Calibrator'>Calibrator</MenuItem>
                                    <MenuItem key='Approver' value='Approver'>Approver</MenuItem>
                                </TextField>
                                <TextField
                                placeholder='Employee Id'
                                id="employeeId"
                                name="employeeId"
                                variant='outlined'
                                value={formik.values.employeeId}
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                error={formik.touched.employeeId && Boolean(formik.errors.employeeId)}
                                helperText={formik.touched.employeeId && formik.errors.employeeId}
                            />
                            </CardContent>
                            <CardContent fullwidth>
                                <Button fullwidth color='primary' onClick={() => props.setRegister(!props.register)} >Cancel</Button>
                                <Button fullwidth color='primary' type="submit">Register</Button>
                            </CardContent>
                            <Snackbar open={employeeIdExist} autoHideDuration={3000} onClose={handleEmployeeIdExist}>
                                <Alert onClose={handleEmployeeIdExist} severity="error">
                                    A user with that employee id already exists
                                </Alert>
                            </Snackbar>
                        </div>
                </form>
            )
        }
        if(form === 2){// client
            return(
                <form onSubmit={company_formik.handleSubmit}>
                    <div style={{minWidth:'430px'}}>
                        <CardContent>
                                <TextField
                                placeholder='Company Name'
                                id="companyName"
                                name="companyName"
                                variant='outlined'
                                value={company_formik.values.companyName}
                                onChange={company_formik.handleChange}
                                onBlur={company_formik.handleBlur}
                                error={company_formik.touched.companyName && Boolean(formik.errors.companyName)}
                                helperText={company_formik.touched.companyName && formik.errors.companyName}
                                />
                        </CardContent>
                        <CardContent>
                        <TextField
                        placeholder='Email'
                        id="email"
                        name="email"
                        type="email"
                        variant='outlined'
                        value={company_formik.values.email}
                        onChange={company_formik.handleChange}
                        onBlur={company_formik.handleBlur}
                        error={company_formik.touched.email && Boolean(company_formik.errors.email)}
                        helperText={company_formik.touched.email && company_formik.errors.email}
                        />
                        <TextField
                        placeholder='Confirm Email'
                        id="emailCopy"
                        name="emailCopy"
                        type="email"
                        variant='outlined'
                        value={company_formik.values.emailCopy}
                        onChange={company_formik.handleChange}
                        error={company_formik.touched.emailCopy && Boolean(company_formik.errors.emailCopy)}
                        helperText={company_formik.touched.emailCopy && company_formik.errors.emailCopy}
                        />
                    </CardContent>
                    <CardContent>
                        <TextField
                        placeholder='Password'
                        id="password"
                        name="password"
                        type="password"
                        variant='outlined'
                        value={company_formik.values.password}
                        onChange={company_formik.handleChange}
                        onBlur={company_formik.handleBlur}
                        error={company_formik.touched.password && Boolean(company_formik.errors.password)}
                        helperText={company_formik.touched.password && company_formik.errors.password}
                        />
                        <TextField
                        placeholder='Confirm Password'
                        id="passwordCopy"
                        name="passwordCopy"
                        type="password"
                        variant='outlined'
                        value={company_formik.values.passwordCopy}
                        onBlur={company_formik.handleBlur}
                        onChange={company_formik.handleChange}
                        error={company_formik.touched.passwordCopy && Boolean(company_formik.errors.passwordCopy)}
                        helperText={company_formik.touched.passwordCopy && company_formik.errors.passwordCopy}
                        />
                        </CardContent>
                        <CardContent fullwidth>
                            <Button fullwidth color='primary' onClick={() => props.setRegister(!props.register)} >Cancel</Button>
                            <Button fullwidth color='primary' type="submit">Register</Button>
                        </CardContent>
                    </div>
                </form>
            )
        }
    }
    if(codeSent){
        if(form === 2){ // client 
            return(
                <form onSubmit={code_formik_company.handleSubmit}>
                    <div style={{minWidth:'430px'}}>
                    <Snackbar open={userRegistered} autoHideDuration={3000} onClose={handleUserRegistered}>
                        <Alert onClose={handleUserRegistered} severity="info">
                            After you verify your account you need to wait for CIQA to autenticate your account
                        </Alert>
                    </Snackbar>
                        <CardContent>
                            <TextField
                            placeholder='confimation code'
                            id="code"
                            name="code"
                            variant='outlined'
                            value={code_formik_company.values.code}
                            onChange={code_formik_company.handleChange}
                            />
                        </CardContent>
                        <CardContent>
                            <Button type="submit">Verify</Button>
                        </CardContent>
                    </div>
                </form>
            )
        }
        if(form === 1){ // employee
            return(
                <form onSubmit={code_formik.handleSubmit}>
                    <div style={{minWidth:'430px'}}>
                    <Snackbar open={userRegistered} autoHideDuration={3000} onClose={handleUserRegistered}>
                        <Alert onClose={handleUserRegistered} severity="info">
                            After you verify your account you need to wait for CIQA to autenticate your account
                        </Alert>
                    </Snackbar>
                        <CardContent>
                            <TextField
                            placeholder='confimation code'
                            id="code"
                            name="code"
                            variant='outlined'
                            value={code_formik.values.code}
                            onChange={code_formik.handleChange}
                            />
                        </CardContent>
                        <CardContent>
                            <Button type="submit">Verify</Button>
                        </CardContent>
                    </div>
                </form>
            )
        }
    }
    
}

export default RegisterComp
