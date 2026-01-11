import {ReactKeycloakProvider} from "@react-keycloak/web";
import keycloak from "./keycloak";
import * as React from "react";


type Props = {
    children: React.ReactNode;
};

export default function AuthProvider({children}: Readonly<Props>) {
    return (
        <ReactKeycloakProvider authClient={keycloak}
                               initOptions={{
                                   onLoad: "login-required",
                                   pkceMethod: "S256",
                                   checkLoginIframe: false,
                               }}>
            {children}
        </ReactKeycloakProvider>
    );
}