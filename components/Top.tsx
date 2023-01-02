import Image from "next/image";
import { useCourses } from "../hooks/useCourses";

const Top = () => {
    const { minor, major } = useCourses();
    return (
        <div className="text-white text-2xl absolute top-0 h-16 bg-cyan-700 brightness-110 w-full border-b-2 border-sky-300/20 shadow-lg z-20 grid grid-cols-3 grid-rows-1">
            <div className="px-4 py-2 rounded ml-2 flex justify-start items-center">
                <div className="select-none cursor-pointer">
                    <span className="pr-[0.125rem] font- text-2xl font-Raleway">my</span>
                    <span className="text-white bg-black p-1 px-2 rounded font-bold font-JetBrainsMono">Degree</span>
                </div>
            </div>
            <div className="w-full flex justify-center items-center">
                <div className="flex flex-row justify-center items-center select-none max-w-xs">
                    <div className="flex flex-row justify-start items-center bg-white align-middle h-fit rounded my-auto mx-auto">
                        <p
                            className="font-JetBrainsMono font-extrabold px-4 py-2 rounded text-2xl text-cyan-900"
                        >
                            {major}
                        </p>
                    </div>
                    <p className="font-extrabold mx-5">
                        /
                    </p>
                    <div className="flex flex-row justify-start items-center bg-cyan-900 align-middle h-fit rounded my-auto mx-auto">
                        <p
                            className="font-JetBrainsMono font-extrabold px-4 py-2 rounded text-2xl text-yellow-500"
                        >
                            {minor}
                        </p>
                    </div>
                </div>
            </div>
            <div className="flex justify-end items-center mr-4">
                <div className="w-fit">
                    <Image src={"https://avatars.dicebear.com/api/micah/4.svg"} width={40} height={40} alt={""} className="rounded-full bg-white "/>
                </div>
            </div>
        </div>
    );
};

export default Top;