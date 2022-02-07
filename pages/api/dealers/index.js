import withApiAuth from "../../../lib/withApiAuth";
import makeDealer from "../../../lib/makeDealer";
import Dealer from "../../../models/Dealer";

const dealerHandler = async (req,res) => {
    if(req.method === 'POST'){
        if(req.token.role !== 'admin'){
            const doc = await makeDealer(new Dealer(null,req.body));
            res.json(doc);
        } else {
            res.statusCode = 403;
            res.json({error: "unauthorized"});
        }
    }
}

export default withApiAuth(dealerHandler);
