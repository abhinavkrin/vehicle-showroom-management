import { useContext } from "react";
import { Table } from "react-bootstrap";
import { BookingsContext } from "./ManageBookings";

function BookingsList(){
    const {bookings} = useContext(BookingsContext);
    return (
        <Table striped bordered hover responsive>
            <thead>
                <tr>
                    <th>Id</th>
                    <th>Customer Id</th>
                    <th>Dealer Id</th>
                    <th>Booking Status</th>
                    <th>Amount</th>
                    <th>Payment Status</th>
                    <th>Date</th>
                </tr>
            </thead>
            <tbody>
                {bookings.map(booking => (
                    <tr key={booking.id}>
                        <td>{booking.id}</td>
                        <td>{booking.data.customerId}</td>
                        <td>{booking.data.dealerId}</td>
                        <td>{booking.data.bookingStatus}</td>
                        <td>₹{booking.data.amount}</td>
                        <td>{booking.data.paymentStatus}</td>
                        <td>{new Date(booking.data.createdAt.seconds * 1000).toLocaleDateString()}</td>
                    </tr>
                ))}
            </tbody>
        </Table>
    ) 
}

export default BookingsList;
