export default function getFileExtension(file){
    const nameTokens = file.name.split('.');
    if(nameTokens.length){
        return nameTokens[nameTokens.length -1];
    }
    return '';
}
