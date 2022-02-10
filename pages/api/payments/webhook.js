const razorpay = require('razorpay');
const admin = require('firebase-admin');

const webhookPayloadParser = (req) =>
    new Promise((resolve) => {
        let data = "";
        req.on("data", (chunk) => {
            data += chunk;
        });
        req.on("end", () => {
            resolve(Buffer.from(data).toString());
    });
});
export const config = {
  api: {
    bodyParser: false,
  },
}
export default async function webhook(req,res){
    if(req.method !== 'POST'){
        res.statusCode = 404;
        res.json({error: true});
    }
    try {
        const body = await webhookPayloadParser(req);
        req.body = JSON.parse(body);
        const signature = req.headers['x-razorpay-signature'];
        const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
        if(!razorpay.validateWebhookSignature(body,signature,secret)){
            //invalid valid webhook signature
            res.status(401).end();
            console.log("Invalid signature");
            return;
        }
        if(req.body.event === 'order.paid'){
            const order = req.body.payload.order.entity;
            const payment = req.body.payload.payment.entity;
            const bookingId = order.notes.bookingId
            if(order.notes.source !== "SHOWROOM_WEBSITE"){
                res.statusCode = 200;
                res.json({skipped: true});
            }

            const bookingRef = admin.firestore().collection('bookings').doc(bookingId);

            const success = await admin.firestore().runTransaction( async t =>{
                const booking = await t.get(bookingRef);
                if(!booking.exists){
                    console.log("Booking "+bookingRef.id+" does not exist");
                    return true;
                }
                if(booking.data().paymentStatus === "PAID") 
                    return true;
                await t.update(bookingRef,{
                    paymentStatus: "PAID",
                    bookingStatus: "BOOKED",
                    updatedAt: admin.firestore.Timestamp.now(),
                    paymentId: payment.id
                });
                return true;
            });
            res.statusCode = success ? 200 : 501;
        } else {
            res.statusCode = 200;
        }
   } catch(e) {
       console.error(e);
       res.statusCode = 501;
   }
   if(res.statusCode===200){
        res.json({success: true})
   } else{
       res.json({error: true});
   }
}
