import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
    url: "http://localhost:18080/",
    realm: "ip_cv_realm",
    clientId: "ip_cv_student",
});

export default keycloak;
