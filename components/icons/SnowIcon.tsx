const style = {
    lineHeight: "normal",
    textIndent: 0,
    textAlign: "start",
    textDecorationLine: "none",
    textDecorationStyle: "solid",
    textDecorationColor: "#000",
    textTransform: "none",
    msBlockProgression: "tb",
    whiteSpace: "normal",
    isolation: "auto",
    mixBlendMode: "normal",
    solidOpacity: 1
} as React.CSSProperties;

const SnowIcon = ({ height, width, className }: { height: number, width: number, className: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} className={className}>
        <g fillRule="evenodd" color="#000" fontFamily="sans-serif" fontWeight="400">
            <path
                style={style}
                d="M15.984 1022.361a1 1 0 0 0-.984 1.016v25.97a1 1 0 1 0 2 0v-25.97a1 1 0 0 0-1.016-1.016z"
                overflow="visible" transform="translate(0 -1020.362)" />
            <path
                style={style}
                d="M13.018 1023.37a1 1 0 0 0-.553 1.837l2.976 2a1 1 0 0 0 1.118 0l2.976-2a1 1 0 1 0-1.117-1.66L16 1025.172l-2.418-1.625a1 1 0 0 0-.564-.178zm2.974 21.97a1 1 0 0 0-.55.17l-2.977 2.002a1 1 0 1 0 1.117 1.66l2.418-1.627 2.418 1.627a1 1 0 1 0 1.117-1.66l-2.976-2.002a1 1 0 0 0-.567-.17zm11.297-16.47a1 1 0 0 0-.543.14l-22.492 12.986a1 1 0 1 0 1 1.73l22.492-12.984a1 1 0 0 0-.457-1.873z"
                overflow="visible" transform="translate(0 -1020.362)" />
            <path
                style={style}
                d="M24.842 1026.78a1 1 0 0 0-.951.945l-.245 3.578a1 1 0 0 0 .56.966l3.22 1.579a1 1 0 1 0 .879-1.797l-2.617-1.282.199-2.908a1 1 0 0 0-1.045-1.082zm-20.75 11.99a1 1 0 0 0-.397 1.904l2.617 1.281-.199 2.908a1 1 0 1 0 1.996.137l.245-3.578a1 1 0 0 0-.56-.967l-3.22-1.578a1 1 0 0 0-.482-.107zm.588-9.913a1 1 0 0 0-.426 1.872l22.492 12.986a1 1 0 1 0 1-1.733l-22.492-12.986a1 1 0 0 0-.574-.139z"
                overflow="visible" transform="translate(0 -1020.362)" />
            <path
                style={style}
                d="M27.879 1038.77a1 1 0 0 0-.453.107l-3.22 1.578a1 1 0 0 0-.56.967l.245 3.578a1 1 0 1 0 1.996-.137l-.2-2.908 2.618-1.281a1 1 0 0 0-.426-1.905zm-20.752-11.99a1 1 0 0 0-1.014 1.081l.2 2.908-2.618 1.282a1 1 0 1 0 .88 1.797l3.22-1.578a1 1 0 0 0 .559-.967l-.245-3.578a1 1 0 0 0-.982-.946zm5.89.581a1 1 0 0 0-.552 1.838l2.976 2a1 1 0 0 0 1.118 0l2.976-2a1 1 0 1 0-1.117-1.66L16 1029.164l-2.418-1.625a1 1 0 0 0-.564-.178zm2.975 13.989a1 1 0 0 0-.55.17l-2.977 2.002a1 1 0 0 0 1.117 1.66l2.418-1.627 2.418 1.627a1 1 0 0 0 1.117-1.66l-2.976-2.003a1 1 0 0 0-.567-.17z"
                overflow="visible" transform="translate(0 -1020.362)" />
            <path
                style={style}
                d="M24.422 1036.772a1 1 0 0 0-.453.107l-3.221 1.578a1 1 0 0 0-.557.967l.243 3.578a1 1 0 0 0 1.996-.137l-.198-2.908 2.618-1.281a1 1 0 0 0-.428-1.904zm-13.838-8a1 1 0 0 0-1.014 1.082l.198 2.908-2.618 1.281a1 1 0 1 0 .881 1.797l3.221-1.578a1 1 0 0 0 .557-.965l-.243-3.578a1 1 0 0 0-.982-.947zm-3.035 8a1 1 0 0 0-.399 1.904l2.618 1.281-.198 2.908a1 1 0 0 0 1.996.137l.245-3.578a1 1 0 0 0-.559-.967l-3.22-1.578a1 1 0 0 0-.483-.107zm13.838-7.999a1 1 0 0 0-.953.946l-.245 3.578a1 1 0 0 0 .559.965l3.22 1.578a1 1 0 1 0 .882-1.797l-2.618-1.281.198-2.909a1 1 0 0 0-1.043-1.08z"
                overflow="visible" transform="translate(0 -1020.362)" />
        </g>
    </svg>
);

export default SnowIcon;