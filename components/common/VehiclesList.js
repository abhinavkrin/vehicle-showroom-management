import { useContext } from "react";
import { Table } from "react-bootstrap";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { VehiclesContext } from "./ManageVehicle";

function VehiclesList({onEdit,onDelete}){
    const {vehicles} = useContext(VehiclesContext);
    return (
        <Table striped bordered hover responsive>
            <thead>
                <tr>
                    <th>Id</th>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Model</th>
                    <th>Cost</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {vehicles.map(vehicle => (
                    <tr key={vehicle.id}>
                        <td>{vehicle.id}</td>
                        <td>{vehicle.data.name}</td>
                        <td>{vehicle.data.type}</td>
                        <td>{vehicle.data.model}</td>
                        <td>{vehicle.data.cost}</td>
                        <td>{vehicle.data.status}</td>
                        <td>
                            <FaTrashAlt className="mx-2" onClick={() => onDelete(vehicle)}/>
                            <FaEdit className="mx-2" onClick={() => onEdit(vehicle)}/>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    ) 
}

export default VehiclesList;
