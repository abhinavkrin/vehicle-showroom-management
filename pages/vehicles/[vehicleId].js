import Vehicle from "../../models/Vehicle";
import {withFirebaseAuthUser, useFirebaseAuthUser, withFirebaseAuthUserTokenSSR, FirebaseAuthUI} from '../../components/auth/firebase';
import {firestore} from 'firebase-admin';
import { Container, Button, Row, Col} from 'react-bootstrap';
import {useEffect,useState} from 'react';
import styles from './viewVehicle.module.css';
import { FaEnvelope, FaPhone, FaUserCircle } from "react-icons/fa";
import Link from "next/link";

function ViewVehicle({vehicle = new Vehicle(),dealer}){
    const user = useFirebaseAuthUser();
    const [name,] = useState(user.displayName);
    const [email,] = useState(user.email);
    const [phone,] = useState(user.phoneNumber);
    const [paymentResponse,setPaymentResponse] = useState(null)

    const onBuyClick = async () => {
        try {
            const token = await user.getIdToken(false)
            const response = await fetch('/api/payments/createOrder?vehicleId='+vehicle.id, {
                headers: {
                    Authorization: 'Bearer '+token,
                    'content-type': 'application/json'
                }
            });
            const order = await response.json(); 
            var options = {
                "key": process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                "amount": order.amount,
                "currency": order.currency,
                "name": "Showroom X",
                "order_id": order.id,
                "handler": (response) => setPaymentResponse(response),
                "prefill": {
                    "name": name,
                    "email": email,
                    "contact": phone
                },
                "notes": order.notes,
                "theme": {
                    "color": "#3399cc"
                }
            };
            var rzp1 = new window.Razorpay(options);
            rzp1.open();
        } catch(e) {
            console.error(e);
        }
    }
    useEffect(() => {
        const el = document.createElement('script');
        el.src = "https://checkout.razorpay.com/v1/checkout.js";
        document.body.appendChild(el);
        return () => document.body.removeChild(el);
    },[])
    if(!user.id){
        return (
            <Container className="d-flex justify-content-center my-5">
                <FirebaseAuthUI/>
            </Container>
        )
    }
    return (
        <Container>
            <Row>
                <Col xs={12} lg={7} className="d-flex justify-content-center">
                    <img 
                        src={vehicle.data.image} 
                        alt={vehicle.data.name}
                        className={styles.vehicleImage}
                    />
                </Col>
                <Col xs={12} lg={5}>
                    <h1 className={styles.vehicleName}>
                        {vehicle.data.name} {vehicle.data.model}
                    </h1>
                    <div className={
                        vehicle.data.status === 'AVAILABLE' ?
                        styles.vehicleStatus : styles.vehicleStatusDanger}>
                            {vehicle.data.status}
                    </div>
                    <div className={styles.vehicleType}>{vehicle.data.type}</div>
                    <div className={styles.vehiclePrice}>Price: ₹{vehicle.data.cost}</div>
                    {

                        paymentResponse ?
                        <div style={{margin: "0.5rem"}}>
                            <h3>Order Successfull</h3>
                            <div className={styles.orderDetails}>
                                <strong>Order ID: </strong>
                                <div>{paymentResponse.razorpay_order_id}</div>
                                <strong>Payment Id: </strong>
                                <div>{paymentResponse.razorpay_payment_id}</div>
                            </div>
                            <p className={styles.paymentSuccessMessage}>
                                We have received your order. It may take a few minutes to process your order. Go to <Link href="/mybookings"><a>My bookings</a></Link>.
                            </p>
                        </div>
                        :
                        <div style={{margin: "0.5rem"}}>
                            <Button type="button" 
                                disabled={vehicle.data.status !== 'AVAILABLE'}
                                onClick={onBuyClick} size="lg" style={{width: "200px"}}>
                                Buy Now
                            </Button>
                        </div>
                    }
                    <Col xs={12} style={{margin: "2rem 0.5rem"}}>
                        <h5 className="text-gray-dark">DEALER:</h5>
                        <div>
                            <FaUserCircle/> {dealer.data.name}
                        </div>
                        <div>
                            <FaEnvelope/> {dealer.data.email}
                        </div>
                        <div>
                            <FaPhone/> {dealer.data.phone}
                        </div>
                    </Col>
                </Col>
            </Row>
        </Container>
    )
}

export default withFirebaseAuthUser()(ViewVehicle);


export const getServerSideProps =  withFirebaseAuthUserTokenSSR()(async (ctx) => {
    const vehicleId = ctx.params.vehicleId;
    const vehicleDoc = await firestore().collection('vehicles').doc(vehicleId).get();
    if(!vehicleDoc.exists){
        return {
            notFound: true
        }
    }
    const dealerDoc = await firestore().collection('dealers').doc(vehicleDoc.data().dealerId).get();
    return {
        props: {
            vehicle: { id: vehicleDoc.id, data: vehicleDoc.data()},
            dealer: { id: dealerDoc.id, data: dealerDoc.data() || null}
        }
    }
})
