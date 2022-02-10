import { useContext, useState } from "react";
import { Container, Tab, Table, Tabs } from "react-bootstrap";
import { MyBookingsDataContext } from "../../pages/mybookings";
import { useFirebaseAuthUser } from "../auth/firebase";

function MyBookingsDashboard(){
    const [key, setKey] = useState('bookings');
    const {bookings} = useContext(MyBookingsDataContext);
    const user = useFirebaseAuthUser();
    return (
        <Container>
            <Tabs activeKey={key} 
                id="uncontrolled-tab-example" 
                onSelect={setKey}
                className="my-3">
                <Tab eventKey="bookings" title="Bookings">
                    <h6>Customer Id: {user.id}</h6>
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>Id</th>
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
                                    <td>{booking.data.dealerId}</td>
                                    <td>{booking.data.bookingStatus}</td>
                                    <td>₹{booking.data.amount}</td>
                                    <td>{booking.data.paymentStatus}</td>
                                    <td>{new Date(booking.data.createdAt.seconds * 1000).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Tab>
            </Tabs>
        </Container>
    )
}

export default MyBookingsDashboard;
