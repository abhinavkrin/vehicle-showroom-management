import { createContext, useEffect, useState } from "react";
import Dealer from "../../models/Dealer";
import DealersList from "./DealersList";
import {collection, getDocs, getFirestore, query} from 'firebase/firestore';
import DealerForm from "./DealerForm";
import { Button } from "react-bootstrap";
import { useFirebaseAuthUser } from "../auth/firebase";
export const DealersContext = createContext();

function ManageDealers(){
    const [dealers,setDealers] = useState([]);
    const [editingDealer,setEditingDealer] = useState(null);
    const [loading,setLoading] = useState(false);
    const [addingDealer,setAddingDealer] = useState(false);
    const user = useFirebaseAuthUser();

    useEffect(() => {
        const q = query(collection(getFirestore(),'dealers'));
        getDocs(q)
            .then(docsSnapshot => {
                const docs = [];
                docsSnapshot.forEach(d => docs.push({id: d.id, data: d.data()}));
                setDealers(docs);
                setLoading(false);
            }).
            catch(console.error);
    },[]);

    const addDealer =  async (dealer = new Dealer(),password) => {
        setLoading(true);
        const token = await user.getIdToken();
        const response = await fetch('/api/dealers', {
            method: "POST",
            body: JSON.stringify({
                ...dealer.data,
                password
            }),
            headers: {
                Authorization: 'Bearer '+token,
                'content-type': 'application/json'
            }
        });
        const dealerDoc = await response.json();
        setDealers((oldList) => [...oldList,dealerDoc]);
        setLoading(false);
        setAddingDealer(false);
    };
    const updateDealer = async (dealer = new Dealer()) => {
        setLoading(true);
        const token = await user.getIdToken();
        const response = await fetch('/api/dealers', {
                method: "PUT",
                body: JSON.stringify(dealer),
                headers: {
                    Authorization: 'Bearer '+token,
                    'content-type': 'application/json'
                }
        });
        const dealerDoc = await response.json();
        setDealers((oldList) => {
            const newList = [...oldList];
            newList.find(d => d.id === dealer.id).data = dealerDoc.data;
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
        const token = await user.getIdToken();
        await fetch('/api/dealers', {
            method: "DELETE",
            body: JSON.stringify(dealer),
            headers: {
                Authorization: 'Bearer '+token,
                'content-type': 'application/json'
            }
        });
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
