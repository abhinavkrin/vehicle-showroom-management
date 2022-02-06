import { useState } from "react";
import { Container, Tab, Tabs } from "react-bootstrap";
import ManageDealers from "./ManageDealers";

function AdminDashboard(){
    const [key, setKey] = useState('cars');
    return (
        <Container>
            <Tabs activeKey={key} 
                id="uncontrolled-tab-example" 
                onSelect={setKey}
                className="my-3">
                <Tab eventKey="cars" title="Cars">
                    {key}
                </Tab>
                <Tab eventKey="dealers" title="Dealers">
                    <ManageDealers/>
                </Tab>
                <Tab eventKey="bookings" title="Bookings">
                    {key}
                </Tab>
            </Tabs>
        </Container>
    )
}

export default AdminDashboard;
