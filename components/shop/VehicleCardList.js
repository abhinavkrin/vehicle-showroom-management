import { Container } from "react-bootstrap";
import Dealer from "../../models/Dealer";
import VehicleCard from "./VehicleCard";

export default function VehicleCardList({vehicles,dealers}){
    return (
        <Container>
            {
            vehicles.ids.map(vid => 
                <VehicleCard key={vid} 
                    vehicle={vehicles.vehicles[vid]} 
                    dealer={dealers.dealers[vehicles.vehicles[vid].dealerId] || new Dealer()}/>
            )}
        </Container>
    )
}
