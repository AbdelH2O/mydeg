const checkIndex = (index: { type: string; year: string }, term: { type: string; year: string; }): boolean => {
    const order = ["Spring", "Summer", "Fall"];
    console.log(term);
    if(!term) return false;
    if(parseInt(term.year) === parseInt(index.year)) {        
        return order.indexOf(term.type) < order.indexOf(index.type);
    }
    return parseInt(term.year) < parseInt(index.year);
}

export default checkIndex;