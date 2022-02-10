export default class Booking {
    constructor(id,{
        vehicleId = null,
        customerId = null,
        dealerId = null,
        bookingStatus = null,
        paymentStatus = null,
        paymentId = null,
        orderId = null,
        amount = null,
        createdAt = null,
        updatedAt = null
    } = {}){
        this.id = id,
        this.data = {
            vehicleId,
            customerId,
            dealerId,
            bookingStatus,
            paymentStatus,
            paymentId,
            orderId,
            amount,
            createdAt,
            updatedAt
        }
    }
}
