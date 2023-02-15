const Search = ({height, width}: {height: number, width: number}) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="#64748b" width={width} height={height} viewBox="0 0 48 48">
            <path
                d="M46.599 40.236L36.054 29.691C37.89 26.718 39 23.25 39 19.5 39 8.73 30.27 0 19.5 0S0 8.73 0 19.5 8.73 39 19.5 39c3.75 0 7.218-1.11 10.188-2.943l10.548 10.545a4.501 4.501 0 0 0 6.363-6.366zM19.5 33C12.045 33 6 26.955 6 19.5S12.045 6 19.5 6 33 12.045 33 19.5 26.955 33 19.5 33z" />
        </svg>
    )
};

export default Search;