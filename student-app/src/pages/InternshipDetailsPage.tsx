import {useParams, useNavigate} from 'react-router-dom';
import {Container, Typography, Card, CardContent, Stack, Button, Chip, Divider} from "@mui/material";

import {getInternship, type Internship} from "../api/internshipsApi.ts";
import {useEffect, useState} from "react";


export default function InternshipDetailsPage() {
    const {id} = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [internship, setInternship] = useState<Internship | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [notFound, setNotFound] = useState(false);


    useEffect(() => {
        const numId = Number(id);
        if (!Number.isFinite(numId)) {
            setNotFound(true);
            return;
        }
        const load = async () => {
            try {
                const data = await getInternship(Number(id));
                setInternship(data);
            } catch (e) {
                if (e instanceof Error && e.message.includes("HTTP 404")) {
                    setNotFound(true);
                    return;
                }
                setError(e instanceof Error ? e.message : String(e));
            }
        };
        load();
    }, [id]);
    if (error) {
        return <p style={{ color: "crimson" }}>{error}</p>;
    }

    if (internship === null && !notFound) {
        return <p>Loading…</p>;
    }

    if (!internship) {
        return (
            <Container maxWidth="md" sx={{py: 3}}>
                <Typography variant="h5" sx={{mb: 2}}>
                    Internship not found
                </Typography>
                <Button variant="contained" onClick={() => navigate("/internships")}>
                    Back to Internships
                </Button>
            </Container>
        )
    }

    return (
        <Container maxWidth="md" sx={{py: 3}}>
            <Stack direction="row"
                   justifyContent="space-between"
                   alignItems="center"
                   sx={{mb: 2}}>
                <Typography variant="h4">
                    {internship.title}
                </Typography>
                <Button variant="outlined" onClick={() => navigate(-1)}>
                    Back
                </Button>
            </Stack>

            <Card variant="outlined">
                <CardContent>
                    <Typography variant="h3"
                                color="text.secondary"
                                sx={{mb: 1}}>
                        {internship.companyName}
                    </Typography>

                    <Divider sx={{my: 2}}/>


                    <Typography variant="body2" sx={{ mb: 1 }}>
                        Details
                    </Typography>

                    <Stack spacing={0.5} sx={{ mb: 2 }}>
                        <Typography variant="body1" color="text.secondary">
                            Start date: <span style={{ color: "inherit" }}>{internship.startDate}</span>
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            End date: <span style={{ color: "inherit" }}>{internship.endDate}</span>
                        </Typography>
                        {internship.additionalRequirements && internship.additionalRequirements.trim() !== "" && (
                            <Typography variant="body1" color="text.secondary">
                                Requirements: <span style={{ color: "inherit" }}>{internship.additionalRequirements}</span>
                            </Typography>
                        )}
                    </Stack>

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="body2" sx={{mb: 1}}>
                        Description
                    </Typography>
                    <Typography variant="body1" sx={{mb: 2}}>
                        {internship.description}
                    </Typography>

                    <Typography variant="body2" sx={{mb: 1}}>
                        Technologies
                    </Typography>

                    {internship.technologies?.length ? (
                        <Stack direction="row"
                               spacing={1}
                               sx={{flexWrap: "wrap"}}>
                            {internship.technologies.map((tech: string) => (
                                <Chip key={tech} label={tech} size="small" sx={{mb: 1}}/>
                            ))}
                        </Stack>) : (
                        <Typography variant="body2" color="text.secondary">
                            No technologies specified
                        </Typography>
                    )}

                    <Divider sx={{my: 2}}/>

                    <Stack direction="row" spacing={2}>
                        <Button variant="contained"
                                onClick={() => alert("asd")}>
                            Apply
                        </Button>
                        <Button variant="outlined"
                                onClick={() => navigate("/internships")}>
                            Browse internships
                        </Button>
                    </Stack>
                </CardContent>
            </Card>
        </Container>
    );
}

