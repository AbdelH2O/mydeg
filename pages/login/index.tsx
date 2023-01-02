import { msalLogin } from "../../components/provider/AuthProvider";
import { Lock, Outlook, Email } from "../../components/icons";
import { useRouter } from "next/router";

const Login = () => {
    const router = useRouter();
    const handleLogin = async () => {
        const response = await msalLogin();
        console.log({response, type: typeof response});
        if(response !== undefined && response?.accessToken) {
            router.push("/dashboard");
        }

    }
    return (
        <div
            className="h-screen w-screen flex justify-center items-center"
            style={{
                background: `linear-gradient(90deg, #cffafe 20.8px, transparent 1%) center, linear-gradient(#cffafe 20.8px, transparent 1%) center, #000`,
                backgroundSize: "22px 22px",
            }}
        >
            <div className="h-1/2 flex flex-col justify-center items-center w-full">
                <div className="flex w-full h-full items-center justify-center">
                    <div className="max-w-2xl grow flex flex-col mx-4 h-full bg-cyan-700 shadow-md rounded-md">
                        <div className="bg-cyan-700 p-6 w-fit rounded mx-auto">
                            <div className="select-none cursor-pointer bg-cyan-700 mx-auto w-fit">
                                <span className="pr-[0.125rem] font- text-3xl font-Raleway">my</span>
                                <span className="text-white bg-black p-1 px-2 text-3xl rounded font-bold font-JetBrainsMono">Degree</span>
                            </div>
                        </div>
                        <div className="h-full rounded-md overflow-hidden text-black bg-white m-6 mt-0 shadow-md">
                            <div className="flex flex-col justify-start items-center h-full">
                                <div className="font-Lato font-bold mt-6 text-center mb-3 text-4xl flex flex-col items-center justify-center">
                                    <div className="rounded-full bg-black p-2 mb-2">
                                        <Lock height={30} width={30} fill={"#fff"}/>
                                    </div>
                                    <h1>
                                        Sign in
                                    </h1>
                                </div>
                                <div className="border-b border-gray-400 w-2/6 "></div>
                                <div className="flex flex-col gap-4 grow justify-center">
                                    <button className="min-w-fit w-64 bg-cyan-50 border-cyan-600 hover:border-transparent hover:bg-cyan-700 hover:text-white transition border text-black rounded py-1 px-4 flex flex-row items-center font-Lato" onClick={handleLogin}>
                                        <Outlook height={38} width={38}/>
                                        <p className="ml-2">
                                            Continue with Outlook
                                        </p>
                                    </button>
                                    <button disabled className="min-w-fit w-64 bg-cyan-50 border-cyan-600 brightness-95 opacity-50 cursor-not-allowed transition border text-black rounded py-2 px-4 flex flex-row items-center font-Lato" onClick={handleLogin}>
                                        <Email height={30} width={30} fill={"#155e75"}/>
                                        <p className="ml-2">
                                            Continue with Email
                                        </p>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;