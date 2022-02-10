import Vehicle from "../../models/Vehicle";
import {withFirebaseAuthUser, useFirebaseAuthUser, withFirebaseAuthUserTokenSSR} from '../../components/auth/firebase';
import {firestore} from 'firebase-admin';
import { Container, Button} from 'react-bootstrap';
import {useEffect,useState} from 'react';
import Image from "next/image";

function ViewVehicle({vehicle = new Vehicle()}){
    const user = useFirebaseAuthUser();
    const [name,] = useState(user.displayName);
    const [email,] = useState(user.email);
    const [phone,] = useState(user.phoneNumber);
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
                "handler": console.log,
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
    return (
        <Container>
             <div>
                <Image 
                    src={vehicle.data.image} 
                    alt={vehicle.data.name}
                    width={300} height={300}
                    />
                <div className="flux-product-detail">
                    <h1 className="name">{vehicle.data.name} {vehicle.data.model}</h1>
                    <div className="description">{vehicle.data.status}</div>
                    <span className="price">Price: ₹{vehicle.data.cost}</span>
                    <Button type="button" onClick={onBuyClick}>
                        Buy
                    </Button>
                </div>
            </div>
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
