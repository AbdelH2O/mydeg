const TrashCan = ({ height = 100, width = 100 }: { height?: number, width?: number }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" height={height} width={width}>
        <rect width="256" height="256" fill="none" />
        <line x1="215.996" x2="39.996" y1="56" y2="56" fill="none" stroke="#fff" stroke-linecap="round"
            stroke-linejoin="round" stroke-width="12" />
        <line x1="104" x2="104" y1="104" y2="168" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round"
            stroke-width="12" />
        <line x1="152" x2="152" y1="104" y2="168" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round"
            stroke-width="12" />
        <path fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="12"
            d="M200 56V208a8 8 0 0 1-8 8H64a8 8 0 0 1-8-8V56M168 56V40a16 16 0 0 0-16-16H104A16 16 0 0 0 88 40V56" />
    </svg>
);

export default TrashCan;