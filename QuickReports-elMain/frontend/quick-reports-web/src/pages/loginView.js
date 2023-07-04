import React, {useEffect, useState} from 'react'
import LoginComp from '../components/login/loginComp'
import RegisterComp from '../components/login/registerComp'
import Card from '@material-ui/core/Card'
import Button from '@material-ui/core/Button'
import ForgotPassword from '../components/login/forgotPassword'
function LoginView(props) {
    const [register,setRegister] =useState(false)
    const [forgotPassword, setForgotPassword] = useState(false)
    // <RegisterComp setRegister={setRegister} register={register}/>
    const [logo , setLogo] = useState(undefined)
    useEffect(() => {
        let getLogo = async () => {
            let logo = await fetch('images/image3.png')
            let blob = await logo.blob()
            setLogo(URL.createObjectURL(blob))
        }
        getLogo()
    } ,[])

    if(register){
        return (
            <div style={{position: 'absolute', left: '50%', top: '15%',
            transform: 'translate(-50%)' }}>
                <Card style ={{minWidth:'460px'}}>
                    <h2 style= {{textAlign:'center'}}>{'Register'}</h2>
                    <div style = {{textAlign:'center'}}>
                        <RegisterComp register={register} setRegister ={setRegister}/>
                    </div>
                </Card>
            </div>
        )
    }
    else if(forgotPassword){
        return(
            <div style={{position: 'absolute', left: '50%', top: '15%',
            transform: 'translate(-50%)' }}>
                <Card style ={{minWidth:'460px'}}>
                    <h2 style= {{textAlign:'center'}}>{'Forgot Password'}</h2>
                    <div style = {{textAlign:'center'}}>
                        <ForgotPassword forgotPassword={forgotPassword} setForgotPassword ={setForgotPassword}/>
                    </div>
                </Card>
            </div>
        )
    }
    return (
    <div style={{position: 'absolute', left: '50%', top: '15%',
    transform: 'translate(-50%)' , backgroundColor:'aliceblue' }}>
        <Card style ={{minWidth:'460px' , backgroundColor:'aliceblue' }}>
            <img alt = "ciqa logo" src={logo} style = {{marginLeft:'auto' , marginRight:'auto' , display:'block' , height:'20%' , width:'20%' , marginTop:'5%'}}></img>
            <h2 style= {{textAlign:'center'}}>{'Login'}</h2>
            <div style = {{textAlign:'center'}}>
                <LoginComp 
                setUser={props.setUser} 
                role={props.role} 
                setRole={props.setRole} 
                setGroups={props.setGroups}
                userHasAuthenticated={props.userHasAuthenticated}
                />
            </div>
            <div style = {{textAlign:'center'}}>
                <Button color='primary' onClick={() => {
                    setForgotPassword(!forgotPassword)
                    }}>Forgot Password?</Button>
            </div>
            <div style = {{textAlign:'center'}}>
                <p>New Customer or Employee?</p>
                <p>Register {<Button color='primary' onClick={() => setRegister(!register)} ><p>here</p></Button>}</p>
            </div> 
        </Card>
    </div>
    )
}


export default LoginView