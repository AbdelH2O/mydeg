const ThreeDots = ({ fill, className }: { fill?: string, className?: string }) => (
    // <svg
    //     width="24"
    //     height="24"
    //     viewBox="0 0 24 24"
    //     fill="none"
    //     xmlns="http://www.w3.org/2000/svg"
    // >
    //     <path
    //         d="M12 12C13.1046 12 14 11.1046 14 10C14 8.89543 13.1046 8 12 8C10.8954 8 10 8.89543 10 10C10 11.1046 10.8954 12 12 12Z"
    //         fill="currentColor"
    //     />
    //     <path
    //         d="M12 16C13.1046 16 14 15.1046 14 14C14 12.8954 13.1046 12 12 12C10.8954 12 10 12.8954 10 14C10 15.1046 10.8954 16 12 16Z"
    //         fill="currentColor"
    //     />
    //     <path
    //         d="M12 20C13.1046 20 14 19.1046 14 18C14 16.8954 13.1046 16 12 16C10.8954 16 10 16.8954 10 18C10 19.1046 10.8954 20 12 20Z"
    //         fill="currentColor"
    //     />
    // </svg>
    <svg width="800" height="800" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill={fill}
        className={"bi bi-three-dots-vertical " + className}>
        <path
            d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
    </svg>
);

export default ThreeDots;