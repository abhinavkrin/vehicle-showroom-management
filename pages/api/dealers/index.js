import withApiAuth from "../../../lib/withApiAuth";
import Dealer from "../../../models/Dealer";
import { auth, firestore } from "firebase-admin";

const dealerHandler = async (req,res) => {
    if(req.method === 'POST'){
        const email = req.body.email;
        if(req.token.role === 'admin'){
            let user = null;
            try {
                user = await auth().getUserByEmail(email);
            } catch(e) {
                console.error(e);
            }
            if(!user){
                user = await auth().createUser({
                    displayName: req.body.name,
                    email: req.body.email,
                    phoneNumber: req.body.phone,
                    password: req.body.password,
                });
                await auth().setCustomUserClaims(user.uid,{...user.customClaims,role: "dealer"});
            }
            const dealer = new Dealer(user.uid,req.body); 
            await firestore().collection('dealers').doc(dealer.id).set(dealer.data);
            res.json(dealer);
        } else {
            res.statusCode = 403;
            res.json({error: "unauthorized"});
        }
    } else if(req.method === 'PUT'){
        const dealer = new Dealer(req.body.id,req.body.data);
        if(req.token.role === 'admin'){
            let user = null;
            try {
                user = await auth().getUser(dealer.id);
            } catch(e) {
                console.error(e);
            }
            if(user){
                user = await auth().updateUser(user.uid,{
                    displayName: dealer.data.name,
                    email: dealer.data.email,
                    phoneNumber: dealer.data.phone
                });
                await auth().setCustomUserClaims(user.uid,{...user.customClaims,role: "dealer"});
            }
            await firestore().collection('dealers').doc(dealer.id).set(dealer.data);
            res.json(dealer);
        } else {
            res.statusCode = 403;
            res.json({error: "unauthorized"});
        }
    } else if(req.method === 'DELETE'){
        const dealer = new Dealer(req.body.id,req.body.data);
        if(req.token.role === 'admin'){
            let user = null;
            try {
                user = await auth().getUserByEmail(dealer.data.email);
            } catch(e) {
                console.error(e);
            }
            if(user){
                await auth().setCustomUserClaims(user.uid,{...user.customClaims,role: null});
            }
            await firestore().collection('dealers').doc(dealer.id).delete();
            res.json({success: true});
        } else {
            res.statusCode = 403;
            res.json({error: "unauthorized"});
        }
    }
}

export default withApiAuth(dealerHandler);
