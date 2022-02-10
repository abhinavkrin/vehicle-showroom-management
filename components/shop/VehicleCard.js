import Link from "next/link";
import { Button } from "react-bootstrap";
import Dealer from "../../models/Dealer";
import Vehicle from "../../models/Vehicle";

export default function VehicleCard({vehicle = new Vehicle, dealer = new Dealer()}){
    return (
        <div className="flux-product">
            <img src={vehicle.data.image} alt={vehicle.data.name}/>
            <div className="flux-product-detail">
              <h1 className="name">{vehicle.data.name} {vehicle.data.model}</h1>
              <div className="description">{vehicle.data.status}</div>
              <span className="price">Price: ₹{vehicle.data.cost}</span>
              <Link href={`/vehicles/${vehicle.id}`}>
                    <a>
                        <Button type="button">
                            View
                        </Button>
                    </a>
              </Link>
            </div>
        </div>
    )
}
