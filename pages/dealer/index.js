import { createContext } from "react";
import { Alert, Button, Container } from "react-bootstrap";
import { useFirebaseAuthUser, withFirebaseAuthUser } from "../../components/auth/firebase";
import { withFirebaseAuthUserTokenSSR } from "../../components/auth/firebase/lib/functions";
import FirebaseAuthUI from "../../components/auth/firebase/ui/FirebaseAuthUI";
import DealerDashboard from "../../components/dealer/DealerDashboard";

export const DealerDataContext = createContext();

function Dealer({initialDealers,initalCustomers,initialCars}){
    const user = useFirebaseAuthUser();
    if(!user.id){
        return (
            <Container className="d-flex justify-content-center my-5">
                <FirebaseAuthUI/>
            </Container>
        )
    }
    if(user.claims.role !== 'dealer'){
        return (
            <Container className="d-flex justify-content-center align-items-center flex-column my-5">
                <Alert variant="danger">
                    Only dealers can access this page.
                </Alert>
                <Button onClick={user.signOut}>Logout</Button>
            </Container>
        )
    }
    return (
        <DealerDataContext.Provider value={{initalCustomers,initialCars, initialDealers}}>
            <DealerDashboard/>
        </DealerDataContext.Provider>
    )
};

export default withFirebaseAuthUser()(Dealer);

export const getServerSideProps =  withFirebaseAuthUserTokenSSR()(async (ctx) => {
    const user = ctx.AuthUser;
    if(user.id && user.claims.role !== 'dealer'){
        ctx.res.statusCode = 403;
    }
});
