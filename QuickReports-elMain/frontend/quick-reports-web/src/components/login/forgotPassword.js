import React, {useState} from 'react'
import { useFormik } from 'formik';
import {TextField, Button} from '@material-ui/core';
import { CardContent } from '@material-ui/core';
import { Auth} from 'aws-amplify';
function ForgotPassword(props) {

    // state for stages
    const [stage, setStage] = useState(1) // 1 for email, 2 for code
    const [email, setEmail] = useState('')
    const formik = useFormik({
        initialValues: {
            email:''
        },
        onSubmit: async (values) => {
            Auth.forgotPassword(values.email)
            setEmail(values.email)
            setStage(2)
        }
    })
    const formik_code = useFormik({
        initialValues: {
            password:'',
            confirmPassword:'',
            code:''
        },
        validate:(values)=>{
            const errors= {}
            if(values.password !== values.confirmPassword){
                errors.password = 'Passwords need to match'
                errors.confirmPassword ='Passwords need to match'
            }
            return errors
        },
        onSubmit: async (values) => {
            const {resp} = await Auth.forgotPasswordSubmit(email,values.code, values.password)
            setStage(1)
        }
    })

    if(stage === 2){
        return (
            <form onSubmit={formik_code.handleSubmit}>
                <div>
                    <CardContent>
                    <TextField
                        placeholder='Verification Code'
                        id="code"
                        name="code"
                        variant='outlined'
                        value={formik_code.values.code}
                        onChange={formik_code.handleChange}
                        error={formik_code.touched.code && Boolean(formik_code.errors.code)}
                        helperText={formik_code.touched.code && formik_code.errors.code}
                        />
                    </CardContent>
                    <CardContent>
                        <TextField
                        placeholder='New Password'
                        id="password"
                        name="password"
                        type="password"
                        variant='outlined'
                        value={formik_code.values.password}
                        onChange={formik_code.handleChange}
                        error={formik_code.touched.password && Boolean(formik_code.errors.password)}
                        helperText={formik_code.touched.password && formik_code.errors.password}
                        />
                    </CardContent>
                    <CardContent>
                        <TextField
                        placeholder='Confirmed Password'
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        variant='outlined'
                        value={formik_code.values.confirmPassword}
                        onChange={formik_code.handleChange}
                        error={formik_code.touched.confirmPassword && Boolean(formik_code.errors.confirmPassword)}
                        helperText={formik_code.touched.confirmPassword && formik_code.errors.confirmPassword}
                        />
                    </CardContent>
                    
                    <CardContent fullwidth>
                        <Button fullwidth color='primary' onClick={() => props.setForgotPassword(!props.forgotPassword)} >Cancel</Button>
                        <Button fullwidth color='primary' type="submit">Submit</Button>
                    </CardContent>
                </div>
            </form>
        )
    }
    return (
        <form onSubmit={formik.handleSubmit}>
            <div>
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
                <CardContent fullwidth>
                    <Button fullwidth color='primary' onClick={() => props.setForgotPassword(!props.forgotPassword)} >Cancel</Button>
                    <Button fullwidth color='primary' type="submit">Send verification code</Button>
                </CardContent>
            </div>
        </form>
    )
}

export default ForgotPassword
