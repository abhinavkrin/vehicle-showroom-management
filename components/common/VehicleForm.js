import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import Vehicle from "../../models/Vehicle";
import { useFirebaseAuthUser } from "../auth/firebase";

function VehicleForm({mode='new', onSubmit = (vehicle = new Vehicle()) => vehicle, disabled = false, editingVehicle = new Vehicle(), onCancel}){
    const user = useFirebaseAuthUser();
    const [name,setName] = useState(()=>mode==='edit'?editingVehicle.data.name:'');
    const [type,setType] = useState(()=>mode==='edit'?editingVehicle.data.type:'');
    const [cost,setCost] = useState(()=>mode==='edit'?editingVehicle.data.cost:'');
    const [model,setModel] = useState(()=>mode==='edit'?editingVehicle.data.model:'');
    const [status,setStatus] = useState(()=>mode==='edit'?editingVehicle.data.status:'AVAILABLE');
    const [dealerId,setDealerId] = useState(()=>mode==='edit'?editingVehicle.data.dealerId:'')
    const [image,setImage] = useState(null);
    useEffect(() => {
        if(user.claims.role === 'dealer'){
            setDealerId(user.id);
        }
    },[user.claims.role,user.id]);

    const onSubmitCallback = async (e) =>{
        e.preventDefault();
        const vehicle = new Vehicle(null,{
            name,
            type,
            cost,
            model,
            status,
            dealerId,
            image: image || editingVehicle.data.image
        })
        if(mode === 'edit')
            vehicle.id = editingVehicle.id;
        await onSubmit(vehicle);
        setName('');
        setType('');
        setCost('');
        setModel('');
        setStatus('AVAILABLE');
        setDealerId('');
        setImage('');
    }
    return (
        <Form onSubmit={onSubmitCallback}>
            <h3>{mode==='edit'?'Edit Vehicle':'Add Vehicle'}</h3>
            <Form.Group className="mb-3" controlId="vehicle.name">
                <Form.Label>Name</Form.Label>
                <Form.Control 
                    disabled={disabled}
                    type="text" 
                    placeholder="Enter vehicle's name" 
                    value={name} 
                    name="name"
                    onChange={e => setName(e.target.value)}/>
            </Form.Group>
            {
                user.claims.role === 'admin' &&
                <Form.Group className="mb-3" controlId="vehicle.dealerId">
                    <Form.Label>Dealer Id</Form.Label>
                    <Form.Control
                        disabled={disabled}
                        type="text" 
                        placeholder="Enter dealer id" 
                        value={dealerId}
                        name="dealerId"
                        onChange={e => setDealerId(e.target.value)}/>
                </Form.Group>
            }
            <Form.Group className="mb-3" controlId="vehicle.type">
                <Form.Label>Type</Form.Label>
                <Form.Control 
                    disabled={disabled}
                    type="text" 
                    placeholder="Enter vehicle type" 
                    value={type}
                    name="type" 
                    onChange={e => setType(e.target.value)}/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="vehicle.cost">
                <Form.Label>Cost</Form.Label>
                <Form.Control
                    name="cost" 
                    disabled={disabled}
                    type="number" 
                    placeholder="Enter vehicle's cost in rupees" 
                    value={cost} 
                    onChange={e => setCost(e.target.value)}/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="vehicle.model">
                <Form.Label>Model</Form.Label>
                <Form.Control
                    name="model" 
                    disabled={disabled}
                    type="text" 
                    placeholder="Enter vehicle's model" 
                    value={model} 
                    onChange={e => setModel(e.target.value)}/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="vehicle.status">
                <Form.Label>Status</Form.Label>
                <Form.Select
                    name="status" 
                    disabled={disabled}
                    value={status}
                    defaultValue={status} 
                    onChange={e => setStatus(e.target.value)}>
                    <option value={"AVAILABLE"}>AVAILABLE</option>
                    <option value={"NOT AVAILABLE"}>NOT AVAILABLE</option>
                </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="vehicle.image">
                <Form.Label>Image</Form.Label>
                {editingVehicle?.data?.image &&
                    <div className="w-100 my-1">
                        <img src={editingVehicle.data.image} alt={editingVehicle.data.name} style={{
                            maxWidth: "300px",
                            width: "100%",
                            height: "Auto"
                        }}/>
                    </div>
                }
                <Form.Control
                    name="image" 
                    disabled={disabled}
                    type="file" 
                    accept='image/*'
                    placeholder="Enter vehicle's image" 
                    onChange={e => setImage(e.target.files[0])}/>
            </Form.Group>
            <Button variant="primary" type="submit" disabled={disabled}>
                {mode==='edit'? 'Save':'Add'}
            </Button>
            <Button variant="light" onClick={onCancel} disabled={disabled}>
                Cancel
            </Button>
        </Form>

    )
}

export default VehicleForm;
