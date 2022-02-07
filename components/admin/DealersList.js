import { useContext } from "react";
import { Table } from "react-bootstrap";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { DealersContext } from "./ManageDealers";

function DealersList({onEdit,onDelete}){
    const {dealers} = useContext(DealersContext);
    return (
        <Table striped bordered hover responsive>
            <thead>
                <tr>
                    <th>Id</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {dealers.map(dealer => (
                    <tr key={dealer.id}>
                        <td>{dealer.id}</td>
                        <td>{dealer.data.name}</td>
                        <td>{dealer.data.email}</td>
                        <td>{dealer.data.phone}</td>
                        <td>
                            <FaTrashAlt className="mx-2" onClick={() => onDelete(dealer)}/>
                            <FaEdit className="mx-2" onClick={() => onEdit(dealer)}/>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    ) 
}

export default DealersList;
