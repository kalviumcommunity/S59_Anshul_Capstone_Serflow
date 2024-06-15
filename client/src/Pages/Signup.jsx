import AuthHeader from  "../components/Auth/AuthHeader";
import SignupComponent from "../components/Auth/SignupComponent";
import {Link} from 'react-router-dom'

export default function SignupPage(){
    return(
        <div className='flex h-screen flex-row w-full justify-around items-center'> 
         <Link to={'/'}>
            <img src="/icon-red.svg" className='h-20 m-5 absolute left-5 top-1' alt="" />
        </Link>

            <div className='flex flex-col w-3/5 items-center'>
                <div className='w-full text-center'>
                    <h1 className='text-3xl  my-10'>Welcome to <span className='text-red-500'>Serflow</span></h1>
                <hr />
                </div>
                <img src="/cover.png" style={{
                    height : '60vh',
                    borderRadius : '20px'
                }} alt="" />
                <div className='flex '>
                    <img src="/physics.png"    className='h-16 mr-5 hover:cursor-pointer' title='React'  alt="" />
                    <img src="/programing.png" className='h-16 mr-5 hover:cursor-pointer' title='NodeJs'  alt="" />
                    <img src="/mongodb.svg"    className='h-16 mr-5 hover:cursor-pointer' title='MongoDB' alt="" />
                    <img src="/express.png"    className='h-16 mr-5 hover:cursor-pointer' title='ExpressJs'  alt="" />
                </div>
            </div>
            <div className='h-screen ' style={
                {
                    padding:'140px 64px 0px',
                    minWidth:'480px',
                    maxWidth:'500px',
                    // marginTop : '160px'  
                }
             }>
            <AuthHeader
              heading="Signup to create an account"
              paragraph="Already have an account? "
              linkName="Login"
              linkUrl="/auth"
            />
            <SignupComponent/>
            </div>
        </div>
    )
}