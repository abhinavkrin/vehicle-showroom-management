require('dotenv').config();
const admin = require('firebase-admin');
admin.initializeApp();

async function makeDealer({email,userId}){
    let user = null;
    if(email){
        user = await admin.auth().getUserByEmail(email);
    } else {
        user = await admin.auth().getUser(userId);
    }
    await admin.auth().setCustomUserClaims(user.uid,{
        ...(user.customClaims?user.customClaims:{}),
        role: 'dealer'
    });
}


const email =  (process.argv.find(arg => arg.startsWith("email=")) || "").replace("email=","") || null;
if(!email)
    throw new Error("Email required");

console.log("Assigning admin role to email: "+email);
makeDealer({email})
.then(()=> {
    return admin.auth().getUserByEmail(email)
})
.then(user => {
    console.log(user);
});
