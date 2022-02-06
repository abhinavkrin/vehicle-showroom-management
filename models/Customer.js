export default class Customer {
    constructor(id,{
        name=null,
        city=null,
        state=null,
        pincode=null,
        address=null,
        gender=null,
        phone=null
    } = {}){
        this.id = id;
        this.data = {
            name,
            city,
            state,
            pincode,
            address,
            gender,
            phone
        }
    }
}
