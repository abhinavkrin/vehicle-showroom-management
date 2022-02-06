import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import Dealer from "../../models/Dealer";

function DealerForm({mode='new', onSubmit = (dealer = new Dealer()) => dealer, disabled = false, editingDealer = new Dealer(), onCancel}){
    const [name,setName] = useState(()=>mode==='edit'?editingDealer.data.name:'');
    const [email,setEmail] = useState(()=>mode==='edit'?editingDealer.data.email:'');
    const [phone,setPhone] = useState(()=>mode==='edit'?editingDealer.data.phone:'')

    const onSubmitCallback = async (e) =>{
        e.preventDefault();
        const dealer = new Dealer(null,{
            name,
            email,
            phone
        })
        if(mode === 'edit')
            dealer.id = editingDealer.id;
        await onSubmit(dealer);
        setName('');
        setEmail('');
        setPhone('');
    }
    return (
        <Form onSubmit={onSubmitCallback}>
            <h3>{mode==='edit'?'Edit Dealer':'Add Dealer'}</h3>
            <Form.Group className="mb-3" controlId="dealer.name">
                <Form.Label>Name</Form.Label>
                <Form.Control 
                    disabled={disabled}
                    type="text" 
                    placeholder="Enter dealer's name" 
                    value={name} 
                    name="name"
                    onChange={e => setName(e.target.value)}/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="dealer.email">
                <Form.Label>Email address</Form.Label>
                <Form.Control 
                    disabled={disabled}
                    type="email" 
                    placeholder="Enter email" 
                    value={email}
                    name="email" 
                    onChange={e => setEmail(e.target.value)}/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="dealer.phone">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                    name="phone" 
                    disabled={disabled}
                    type="text" 
                    placeholder="Enter dealer's phone" 
                    value={phone} 
                    onChange={e => setPhone(e.target.value)}/>
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

export default DealerForm;
