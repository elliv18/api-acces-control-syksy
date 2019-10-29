import Home from "./components/Home";
import NavBar from "./components/NavBar"
import { withApollo } from "react-apollo";


const HomePage = props => (
    < NavBar>
        <Home />
    </NavBar >
);
export default withApollo(HomePage)

