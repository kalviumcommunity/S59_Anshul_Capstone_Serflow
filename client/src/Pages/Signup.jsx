import AuthHeader from  "../components/Auth/AuthHeader";
import SignupComponent from "../components/Auth/SignupComponent";

export default function SignupPage(){
    return(
        <div className='flex h-screen flex-col w-full justify-center items-center'> 
            <AuthHeader
              heading="Signup to create an account"
              paragraph="Already have an account? "
              linkName="Login"
              linkUrl="/login"
            />
            <SignupComponent/>
        </div>
    )
}