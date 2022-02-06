export default class Dealer {
    constructor(id,{
        name=null,
        email=null,
        phone=null
    } = {}){
        this.id = id;
        this.data = {
            name,
            email,
            phone
        }
    }
}
