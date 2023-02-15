const Creeper = ({ width, height }: { width: number, height: number }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height}>
        <path fillRule="evenodd"
            d="M18 14h2V6h-2v8zm-1 4h-1v2h2a2 2 0 0 0 2-2v-2h-2v1a1 1 0 0 1-1 1zM16 0v2h1a1 1 0 0 1 1 1v1h2V2a2 2 0 0 0-2-2h-2zM0 14h2V6H0v8zm2 2H0v2a2 2 0 0 0 2 2h2v-2H3a1 1 0 0 1-1-1v-1zM3 2h1V0H2a2 2 0 0 0-2 2v2h2V3a1 1 0 0 1 1-1zm3 0h8V0H6v2zm2 16h4v-2H8v2zm5-6a1 1 0 0 1 1 1v7H6v-7a1 1 0 0 1 1-1 1 1 0 0 0 1-1v-1h4v1a1 1 0 0 0 1 1zm2-6h-2a1 1 0 0 0-1 1v3h3a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1zm-7 4H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3z" />
    </svg>
);

export default Creeper;