export default class Bookings {
    constructor(id,{
        vehicleId = null,
        customerId = null,
        date = null,
        deliveryDate = null,
        deliveryStatus = null,
        paymentStatus = null,
        paymentId = null,
    } = {}){
        this.id = id,
        this.data = {
            vehicleId,
            customerId,
            date,
            deliveryDate,
            deliveryStatus,
            paymentStatus,
            paymentId
        }
    }
}
