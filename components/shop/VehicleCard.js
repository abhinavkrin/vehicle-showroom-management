import Link from "next/link";
import { Col, Container, Row } from "react-bootstrap";
import Vehicle from "../../models/Vehicle";
import styles from './VehicleCard.module.css';
export default function VehicleCard({vehicle = new Vehicle}){
    return (
        <Link href={`/vehicles/${vehicle.id}`}>
            <a style={{textDecoration: "none", color: "unset"}}>
                <Container className={styles.vehicleCard}>
                    <Row>
                        <Col xs={12} className="d-flex justify-content-center">
                            <img 
                                src={vehicle.data.image} 
                                alt={vehicle.data.name}
                                className={styles.vehicleImage}
                                />
                        </Col>
                        <Col xs={12}>
                            <h1 className={styles.vehicleName}>
                                {vehicle.data.name} {vehicle.data.model}
                            </h1>
                            <div className={styles.vehicleStatus}>{vehicle.data.status}</div>
                            <div className={styles.vehicleType}>{vehicle.data.type}</div>
                            <div style={{margin: "0.5rem"}}>
                                <span className={styles.vehiclePrice}>Price: ₹{vehicle.data.cost}</span>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </a>
        </Link>
    )
}
