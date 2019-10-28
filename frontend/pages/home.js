import Home from "./components/Home";
import NavBar from "./components/NavBar"
import { getCurves } from "crypto";
import { withApollo } from "react-apollo";
import { CURRENTUSER } from "../lib/gql/mutations";


const HomePage = props => (
    < NavBar CU={getCU(props.client)}>
        <Home CU={getCU(props.client)} />
    </NavBar >
);
export default withApollo(HomePage)

async function getCU(client) {
    let CU = undefined
    await client
        .mutate({
            mutation: CURRENTUSER
        }).then(res => {
            CU = res.data.currentUser
        })
        .catch(e => console.log(e))

    return CU

}