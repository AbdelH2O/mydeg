const LeafIcon = ({ height, width, fill="#000", className="" }: { height: number, width: number, fill?: string, className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" height={height} width={width} fill={fill} className={className}>
        <path
            d="M19.025 3.587c-4.356 2.556-4.044 7.806-7.096 10.175-2.297 1.783-5.538.88-7.412.113 0 0-1.27 1.603-2.181 3.74-.305.717-1.644-.073-1.409-.68C3.905 9.25 14.037 5.416 14.037 5.416s-7.149-.303-11.927 5.94c-.128-1.426-.34-5.284 3.36-7.65 5.016-3.211 14.572-.715 13.555-.119z" />
    </svg>
);

export default LeafIcon;