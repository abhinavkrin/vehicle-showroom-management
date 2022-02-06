export default class Vehicle {
    constructor(id,{
        name=null,
        type=null,
        cost=null,
        model=null,
        status=null,
        dealerId= null,
        image=null
    } = {}){
        this.id = id;
        this.data = {
            name,
            type,
            cost,
            model,
            status,
            dealerId,
            image
        }
    }
}
