import {Link} from 'react-router-dom';
import {Card, CardContent, CardActions, Typography, Stack, Chip, Button, Box} from "@mui/material";
import type {MyInternship} from "../api/internshipsApi.ts";

type Props = {
    internship: MyInternship;
};

export default function MyInternshipCard({internship}: Readonly<Props>) {
    const MAX_TECHNOLOGIES = 3;
    const technologies = internship.technologies ?? [];
    const visible = technologies.slice(0, MAX_TECHNOLOGIES);
    const remaining = technologies.length - visible.length;

    // Determine card color based on status
    const getStatusColor = () => {
        switch (internship.myStatus) {
            case "ACCEPTED":
                return {
                    border: "#4caf50",
                    label: "Accepted",
                };
            case "APPLIED":
                return {
                    border: "#2196f3",
                    label: "Applied",
                };
            case "REJECTED":
                return {
                    border: "#f44336",
                    label: "Rejected",
                };
            default:
                return {
                    border: "#e0e0e0",
                    label: "Unknown",
                };
        }
    };

    const statusStyle = getStatusColor();

    return (
        <Card
            variant="outlined"
            sx={{
                borderColor: statusStyle.border,
                borderWidth: 2,
            }}
        >
            <CardContent>
                <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1}}>
                    <Typography variant="h6" sx={{flex: 1}}>
                        {internship.title}
                    </Typography>
                    <Chip
                        label={statusStyle.label}
                        size="small"
                        sx={{
                            backgroundColor: statusStyle.border,
                            color: "white",
                            fontWeight: "bold",
                        }}
                    />
                </Box>

                <Typography variant="body2"
                            color="text.secondary"
                            sx={{mt: 1}}>
                    <strong>{internship.companyName}</strong>
                </Typography>

                <Typography variant="body2" sx={{mt: 2}}>
                    {internship.description}
                </Typography>

                {internship.technologies?.length > 0 && (
                    <Stack direction="row" spacing={1} sx={{flexWrap: "wrap", mt: 2}}>
                        {visible.map((tech: string) => (
                            <Chip key={tech} label={tech} size="small" sx={{mb: 1}}/>))}
                        {remaining > 0 && (
                            <Chip label={`+${remaining} more`}
                                  size="small"
                                  variant="outlined"
                                  sx={{mb: 1}}/>
                        )}
                    </Stack>
                )}
            </CardContent>

            <CardActions sx={{px: 2, pb: 2}}>
                <Button component={Link}
                        to={`/internships/${internship.id}`}
                        variant="contained"
                        size="small">
                    View Details
                </Button>
            </CardActions>
        </Card>
    );
}

