import { useState } from "react";
import { Container, Tab, Tabs } from "react-bootstrap";
import ManageBookings from "../common/ManageBookings";
import ManageVehicles from "../common/ManageVehicle";

function DealerDashboard(){
    const [key, setKey] = useState('vehicles');
    return (
        <Container>
            <Tabs activeKey={key} 
                id="uncontrolled-tab-example" 
                onSelect={setKey}
                className="my-3">
                <Tab eventKey="vehicles" title="Vehicle">
                    <ManageVehicles/>
                </Tab>
                <Tab eventKey="bookings" title="Bookings">
                    <ManageBookings/>
                </Tab>
            </Tabs>
        </Container>
    )
}

export default DealerDashboard;
