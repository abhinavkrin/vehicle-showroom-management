import { firestore } from "firebase-admin";
import { createContext } from "react";
import { Container } from "react-bootstrap";
import { useFirebaseAuthUser, withFirebaseAuthUser } from "../../components/auth/firebase";
import { withFirebaseAuthUserTokenSSR } from "../../components/auth/firebase/lib/functions";
import FirebaseAuthUI from "../../components/auth/firebase/ui/FirebaseAuthUI";
import MyBookingsDashboard from "../../components/common/MyBookingsDashboard";
import Booking from "../../models/Booking";

export const MyBookingsDataContext = createContext();

function MyBookings({bookings}){
    const user = useFirebaseAuthUser();
    if(!user.id){
        return (
            <Container className="d-flex justify-content-center my-5">
                <FirebaseAuthUI/>
            </Container>
        )
    }
    return (
        <MyBookingsDataContext.Provider value={{bookings}}>
            <MyBookingsDashboard/>
        </MyBookingsDataContext.Provider>
    )
};

export default withFirebaseAuthUser()(MyBookings);

export const getServerSideProps =  withFirebaseAuthUserTokenSSR()(async (ctx) => {
    const bookings = await firestore().collection('bookings')
        .where("customerId","==",ctx.AuthUser.id)
        .where('paymentStatus',"==","PAID")
        .get();
    const bookingsDocs = bookings.docs.map(b => ({
        ...new Booking(b.id,{
            ...b.data(),
            createdAt: {
                seconds: b.data().createdAt._seconds,
                nanoseconds: b.data().createdAt._nanoseconds,
            },
            updatedAt: {
                seconds: b.data().updatedAt._seconds,
                nanoseconds: b.data().updatedAt._nanoseconds
            }
        })
    }));
    console.log(bookingsDocs);
    return {
        props: {
            bookings: bookingsDocs
        }
    }
});
