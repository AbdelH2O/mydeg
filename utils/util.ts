const checkIndex = (index: { type: string; year: string }, term: { type: string; year: string; }, yes?: boolean): boolean => {
    const order = ["Spring", "Summer", "Fall"];
    // console.log(term);
    if(!term) return false;
    if(parseInt(term.year) === parseInt(index.year)) {     
        if(yes) console.log(term.type, index.type, order.indexOf(term.type) < order.indexOf(index.type));   
        return order.indexOf(term.type) < order.indexOf(index.type);
    }
    if(yes) console.log(parseInt(term.year), parseInt(index.year), parseInt(term.year) < parseInt(index.year));
    return parseInt(term.year) < parseInt(index.year);
}

export const matchIndex = (index: { type: string; year: string }, term: { type: string; year: string; }): boolean => {
    if(!term) return false;
    return parseInt(term.year) === parseInt(index.year) && term.type === index.type;
};

export default checkIndex;