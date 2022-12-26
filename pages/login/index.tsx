import { msalLogin } from "../../components/providers/AuthProvider";

const Login = () => {
    const handleLogin = async () => {
        const response = await msalLogin();
        console.log(response);
    }
    return (
        <div className="h-screen w-screen flex justify-center items-center">
            <button onClick={handleLogin}>Login</button>
        </div>
    )
}

export default Login;