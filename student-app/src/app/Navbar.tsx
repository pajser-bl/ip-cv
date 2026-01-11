import {NavLink} from 'react-router-dom';
import {useKeycloak} from "@react-keycloak/web";

const linkStyle = ({isActive}: { isActive: boolean }) => ({
    marginRight: 12,
    fontWeight: isActive ? "bold" as const : "normal" as const,
});

export default function Navbar() {
    const {keycloak} = useKeycloak();

    const username = (keycloak.tokenParsed?.preferred_username as string | undefined) ?? (keycloak.tokenParsed?.email as string | undefined) ?? "Unknown";


    const logout = () => {
        keycloak.logout();
    };

    return (

        <nav>
            <span style={{marginLeft: 16}}>
                Logged in as <strong>{username}</strong>
            </span>
            <NavLink to="/my-internships" style={linkStyle}>My Internships</NavLink>
            <NavLink to="/recommendations" style={linkStyle}>Recommendations</NavLink>
            <NavLink to="/internships" style={linkStyle}>Internships</NavLink>
            <NavLink to="/profile" style={linkStyle}>Profile / CV</NavLink>
            <button onClick={logout}>Logout</button>
        </nav>
    )
}
