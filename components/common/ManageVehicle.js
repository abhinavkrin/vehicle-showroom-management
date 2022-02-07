import { createContext, useEffect, useState } from "react";
import Vehicle from "../../models/Vehicle";
import VehiclesList from "./VehiclesList";
import {addDoc, collection, deleteDoc, doc, getDocs, getFirestore, query, updateDoc} from 'firebase/firestore';
import VehicleForm from "./VehicleForm";
import { Button } from "react-bootstrap";
export const VehiclesContext = createContext();

function ManageVehicles(){
    const [vehicles,setVehicles] = useState([]);
    const [editingVehicle,setEditingVehicle] = useState(null);
    const [loading,setLoading] = useState(true);
    const [addingVehicle,setAddingVehicle] = useState(false);

    useEffect(() => {
        const q = query(collection(getFirestore(),'vehicles'));
        getDocs(q)
            .then(docsSnapshot => {
                const docs = [];
                docsSnapshot.forEach(d => docs.push({id: d.id, data: d.data()}));
                setVehicles(docs);
                setLoading(false);
            }).
            catch(console.error);
    },[]);

    const addVehicle =  async (vehicle = new Vehicle()) => {
        setLoading(true);
        const vehicleDocRef = await addDoc(collection(getFirestore(),'vehicles'),vehicle.data);
        setVehicles((oldList) => [...oldList,{...vehicle, id: vehicleDocRef.id}]);
        setLoading(false);
        setAddingVehicle(false);
    };

    const updateVehicle = async (vehicle = new Vehicle()) => {
        console.log(vehicle);
        setLoading(true);
        await updateDoc(doc(getFirestore(),'vehicles',vehicle.id),vehicle.data);
        setVehicles((oldList) => {
            const newList = [...oldList];
            newList.find(d => d.id === vehicle.id).data = vehicle.data;
            return newList;
        });
        setLoading(false);
        setEditingVehicle(null);
    };

    const deleteVehicle = async (vehicle = new Vehicle()) => {
        const res = confirm("Delete vehicle '"+vehicle.data.name+"'");
        if(!res)
            return;
        setLoading(true);
        await deleteDoc(doc(getFirestore(),'vehicles',vehicle.id));
        setVehicles((oldList) => {
            const newList = [...oldList].filter(d => d.id !== vehicle.id);
            return newList;
        });
        setLoading(false);
    };
    const onCancel = () => {
        setEditingVehicle(null);
        setAddingVehicle(false);
    }
    if(addingVehicle){
        return  (
            <VehiclesContext.Provider value={{vehicles}}>
                <VehicleForm onSubmit={addVehicle} 
                    onCancel={onCancel}
                    mode='new' 
                    disabled={loading}/>
            </VehiclesContext.Provider>
        )
    }
    if(editingVehicle){
        return  (
            <VehiclesContext.Provider value={{vehicles}}>
                <VehicleForm 
                    onSubmit={updateVehicle} 
                    mode="edit"
                    onCancel={onCancel}
                    editingVehicle={editingVehicle}
                    disabled={loading}/>
            </VehiclesContext.Provider>
        )
    }
    return (
        <VehiclesContext.Provider value={{vehicles}}>
            <VehiclesList
                onEdit={setEditingVehicle}
                onDelete={deleteVehicle}
                />
            <Button onClick={() => setAddingVehicle(true)}>Add Vehicle</Button>
        </VehiclesContext.Provider>   
    )
}

export default ManageVehicles;
