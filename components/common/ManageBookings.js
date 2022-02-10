import { createContext, useEffect, useState } from "react";
import BookingsList from "./BookingsList";
import getBookings from "../../lib/getBookings";
import { useFirebaseAuthUser } from "../auth/firebase";
export const BookingsContext = createContext();

function ManageBookings(){
    const [bookings,setBookings] = useState([]);
    const [loading,setLoading] = useState(true);
    const [,setData] = useState({ids: [], docs: {}});
    const user = useFirebaseAuthUser();
    useEffect(() => {
        getBookings(user)
        .then(data => {
            setLoading(true);
            setData(data);
            setBookings(data.bookings.ids.map(bid => data.bookings.docs[bid]));
        });
    },[user]);

    
    return (
        <BookingsContext.Provider value={{bookings}}>
            <BookingsList loading={loading}/>
        </BookingsContext.Provider>   
    )
}

export default ManageBookings;
