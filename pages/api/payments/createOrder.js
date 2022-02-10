import { firestore } from "firebase-admin";
import { razorpayInstance } from "../../../lib/razorpayInstance";
import withApiAuth from "../../../lib/withApiAuth"
import Booking from "../../../models/Booking";
import Vehicle from "../../../models/Vehicle";

const createOrder = async(req,res) => {
    if(req.method === 'GET'){
        try {
            const vehicleId = req.query.vehicleId;
            const vehicleDoc = await firestore().collection('vehicles').doc(vehicleId).get();
            if(!vehicleDoc.exists){
                res.statusCode = 400;
                res.json({error: "vehicle not found"});
                return;
            } 
            const vehicle = new Vehicle(vehicleDoc.id,vehicleDoc.data());
            const userId = req.token.uid;
            const bookingRef = firestore().collection('bookings').doc();
            //create a transaction
            const booking = new Booking(bookingRef.id, {
                createdAt: firestore.Timestamp.now(),
                updatedAt: firestore.Timestamp.now(),
                dealerId: vehicle.data.dealerId,
                vehicleId,
                customerId: userId,
                amount: vehicle.data.cost,
                bookingStatus: "PENDING",
                paymentStatus: "PENDING",
                orderID: null,
                paymentId: null
            });
            await bookingRef.set(booking.data);

            const order = await razorpayInstance.orders.create({
                amount: vehicle.data.cost*100, 
                currency: 'INR', 
                receipt: booking.id, 
                notes: {
                    customerId: booking.data.customerId,
                    vehicleId: booking.data.vehicleId,
                    bookingId: booking.id,
                    source: "SHOWROOM_WEBSITE"
                }
            });

            await bookingRef.update({orderId: order.id});

            res.json(order);
        }
        catch(e){
            console.error(e);
            res.statusCode = 501;
            res.json({error: "failed to create order"});
        }
    } else {
        res.statusCode = 404;
    }
}

export default withApiAuth(createOrder);
