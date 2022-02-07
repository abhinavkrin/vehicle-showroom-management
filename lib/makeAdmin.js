import admin from 'firebase-admin';
export default async function makeAdmin({email,userId}){
    let user = null;
    if(email){
        user = await admin.auth().getUserByEmail(email);
    } else {
        user = await admin.auth().getUser(userId);
    }
    await admin.auth().setCustomUserClaims(user.uid,{
        ...(user.customClaims?user.customClaims:{}),
        role: 'admin'
    });
}
