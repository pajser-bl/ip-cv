import {Routes, Route, Navigate} from 'react-router-dom'
import Layout from "./app/Layout"
import MyInternshipsPage from "./pages/MyInternshipsPage";
import InternshipsPage from "./pages/InternshipsPage"
import InternshipDetailsPage from "./pages/InternshipDetailsPage"
// import ProfilePage from "./pages/ProfilePage"

function App() {

    return (
        <Routes>
            <Route path="/" element={<Layout/>}>
                <Route index element={<Navigate to="/my-internships" replace/>}/>
                <Route path="/my-internships" element={<MyInternshipsPage/>}/>
                <Route path="/internships" element={<InternshipsPage/>}/>
                <Route path="/internships/:id" element={<InternshipDetailsPage/>}/>
                {/*<Route path="/profile" element={<ProfilePage/>}/>*/}
            </Route>
        </Routes>
    )
}

export default App
