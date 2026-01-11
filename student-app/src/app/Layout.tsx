import {Outlet} from 'react-router-dom';
import Navbar from "./Navbar";
import {useKeycloak} from "@react-keycloak/web";

export default function Layout() {
    const {keycloak} = useKeycloak();
    const roles =
        (keycloak.tokenParsed?.realm_access?.roles) ?? [];

    const isStudent = roles.includes("ROLE_STUDENT");

    if (!isStudent) {
        return (
            <div style={{padding: 32}}>
                <h2>Access denied</h2>
                <p>This application is only for students.</p>
                <button onClick={() => keycloak.logout()}>
                    Logout
                </button>
            </div>
        );
    }

    return (
        <div style={{padding: 16}}>
            <Navbar/>
            <div style={{marginTop: 16}}>
                <Outlet/>
            </div>
        </div>
    );
}