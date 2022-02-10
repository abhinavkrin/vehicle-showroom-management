import { collection, doc, getDoc, getDocs, getFirestore, query, where } from "firebase/firestore"
import normalizeData from "./normalizeData";

export default async function getBookings(user){
    const collec = collection(getFirestore(),'bookings');
    let q;
    if(!user.id){
        throw new Error("Unauthenticated");
    }
    if(user.claims.role === 'dealer')
        q = query(collec,where("dealerId","==",user.id),where("paymentStatus","==","PAID"));
    else if(user.claims)
        q = query(collec,where("paymentStatus","==",'PAID'));
    else
        q = query(collec,where("customerId","==",user.id),where("paymentStatus","==","PAID"));
    
    const bookingDocs = await getDocs(q);
    const bookings = normalizeData(bookingDocs.docs.map(b => ({
        id: b.id,
        data: b.data()
    })));
    const dealerIds = [];
    const dealerData = {};
    await Promise.all(bookings.ids.map(async bid => {
        const b = bookings.docs[bid];
        if(dealerData[b.data.dealerId]){
            return;
        }
        const dealerDoc = await getDoc(doc(getFirestore(),"dealers",b.data.dealerId));
        if(dealerDoc.exists){
            dealerIds.push(dealerDoc.id);
            dealerData[dealerDoc.id] = {id: dealerDoc.id,data: dealerDoc.data()};
        }
    }));
    const returnData = {
        bookings,
        dealers: {
            ids: dealerIds,
            docs: dealerData
        }
    };
    console.log(returnData);
    return returnData;
}
