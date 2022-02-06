import { createContext, useContext, useState } from "react";
import Dealer from "../../models/Dealer";
import DealersList from "./DealersList";
import {addDoc, collection, deleteDoc, doc, getFirestore, updateDoc} from 'firebase/firestore';
import DealerForm from "./DealerForm";
import { AdminDataContext } from "../../pages/admin";
import { Button } from "react-bootstrap";
export const DealersContext = createContext();

function ManageDealers(){
    const {initialDealers} = useContext(AdminDataContext);
    const [dealers,setDealers] = useState(initialDealers);
    const [editingDealer,setEditingDealer] = useState(null);
    const [loading,setLoading] = useState(false);
    const [addingDealer,setAddingDealer] = useState(false);

    const addDealer =  async (dealer = new Dealer()) => {
        setLoading(true);
        const dealerDocRef = await addDoc(collection(getFirestore(),'dealers'),dealer.data);
        setDealers((oldList) => [...oldList,{...dealer, id: dealerDocRef.id}]);
        setLoading(false);
        setAddingDealer(false);
    };
    const updateDealer = async (dealer = new Dealer()) => {
        console.log(dealer);
        setLoading(true);
        await updateDoc(doc(getFirestore(),'dealers',dealer.id),dealer.data);
        setDealers((oldList) => {
            const newList = [...oldList];
            newList.find(d => d.id === dealer.id).data = dealer.data;
            return newList;
        });
        setLoading(false);
        setEditingDealer(null);
    };
    const deleteDealer = async (dealer = new Dealer()) => {
        const res = confirm("Delete dealer '"+dealer.data.name+"'");
        if(!res)
            return;
        setLoading(true);
        await deleteDoc(doc(getFirestore(),'dealers',dealer.id));
        setDealers((oldList) => {
            const newList = [...oldList].filter(d => d.id !== dealer.id);
            return newList;
        });
        setLoading(false);
    };
    const onCancel = () => {
        setEditingDealer(null);
        setAddingDealer(false);
    }
    if(addingDealer){
        return  (
            <DealersContext.Provider value={{dealers}}>
                <DealerForm onSubmit={addDealer} 
                    onCancel={onCancel}
                    mode='new' 
                    disabled={loading}/>
            </DealersContext.Provider>
        )
    }
    if(editingDealer){
        return  (
            <DealersContext.Provider value={{dealers}}>
                <DealerForm 
                    onSubmit={updateDealer} 
                    mode="edit"
                    onCancel={onCancel}
                    editingDealer={editingDealer}
                    disabled={loading}/>
            </DealersContext.Provider>
        )
    }
    return (
        <DealersContext.Provider value={{dealers}}>
            <DealersList
                onEdit={setEditingDealer}
                onDelete={deleteDealer}
                />
            <Button onClick={() => setAddingDealer(true)}>Add Dealer</Button>
        </DealersContext.Provider>   
    )
}

export default ManageDealers;
