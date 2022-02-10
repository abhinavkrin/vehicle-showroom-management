export default function normalizeData(data = []){
    const ids = data.map(d => d.id);
    const docs = [];
    data.forEach(d => docs[d.id] = d);
    return {
        ids,
        docs
    };  
}
