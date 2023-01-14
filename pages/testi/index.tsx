import { useEffect, useState } from "react";


const Testi = () => {
    const [globalMousePos, setGlobalMousePos] = useState<{x: number, y: number}>({x: 0, y: 1});
    // const [localMousePos, setLocalMousePos] = useState({});

    // const handleMouseMove = (event: { clientX: number; target: { offsetLeft: number; offsetTop: number; }; clientY: number; }) => {
    //     // 👇 Get mouse position relative to element
    //     const localX = event.clientX - event.target.offsetLeft;
    //     const localY = event.clientY - event.target.offsetTop;

    //     setLocalMousePos({ x: localX, y: localY });
    // };

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            setGlobalMousePos({
                x: event.clientX,
                y: window.innerHeight - event.clientY,
            });
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener(
                'mousemove',
                handleMouseMove
            );
        };
    }, []);



    return (
        <div
            className="h-screen w-screen bg-white text-black flex flex-col justify-end items-center"
        >
            {/* x: {globalMousePos.x} y: {globalMousePos.y} */}
            <div
                className="bg-blue-600 overflow-hidden"
                style={{
                    // position: 'absolute',
                    height: `${globalMousePos.y}px`,
                    width: '100vw',
                    // backgroundColor: '#2563eb',
                    bottom: 0,
                    zIndex: 10,
                }}
            >
                <div
                    className={`relative text-white font-JetBrainsMono text-9xl -translate-y-1/2 flex justify-center`}
                    style={{
                        top: `calc(-50vh + ${globalMousePos.y}px)`,
                        // left: '50%',
                        zIndex: 10,
                    }}
                >
                    <p className="select-none">
                        Git Gud
                    </p>
                </div>
            </div>
            <div
                className="absolute flex justify-center w-full select-none z-0 top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 text-blue-600 font-JetBrainsMono text-9xl"
            >
                <p>
                    Git Gud
                </p>
            </div>
        </div>
    );
}

export default Testi