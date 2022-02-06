import { getFirebaseAdmin } from "next-firebase-auth";
import { createContext } from "react";
import { Alert, Button, Container } from "react-bootstrap";
import AdminDashboard from "../../components/admin/AdminDashboard";
import { useFirebaseAuthUser, withFirebaseAuthUser } from "../../components/auth/firebase";
import { withFirebaseAuthUserTokenSSR } from "../../components/auth/firebase/lib/functions";
import FirebaseAuthUI from "../../components/auth/firebase/ui/FirebaseAuthUI";

export const AdminDataContext = createContext();

function Admin({initialDealers,initalCustomers,initialCars}){
    const user = useFirebaseAuthUser();
    if(!user.id){
        return (
            <Container className="d-flex justify-content-center my-5">
                <FirebaseAuthUI/>
            </Container>
        )
    }
    if(user.claims.role !== 'admin'){
        return (
            <Container className="d-flex justify-content-center align-items-center flex-column my-5">
                <Alert variant="danger">
                    Only admins can access this page.
                </Alert>
                <Button onClick={user.signOut}>Logout</Button>
            </Container>
        )
    }
    return (
        <AdminDataContext.Provider value={{initalCustomers,initialCars, initialDealers}}>
            <AdminDashboard/>
        </AdminDataContext.Provider>
    )
};

export default withFirebaseAuthUser()(Admin);

export const getServerSideProps =  withFirebaseAuthUserTokenSSR()(async (ctx) => {
    const user = ctx.AuthUser;
    if(user.id && user.claims.role !== 'admin'){
        ctx.res.statusCode = 403;
    } else {
        const dealers = [];
        (await getFirebaseAdmin()
            .firestore()
            .collection('dealers')
            .orderBy('name')
            .get()
        ).forEach(dealerDoc => dealers.push({id: dealerDoc.id, data: dealerDoc.data()}));

        return {
            props: {
                initialDealers: dealers
            }
        }
    }
});
