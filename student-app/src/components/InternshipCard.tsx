import {Link} from 'react-router-dom';
import {Card, CardContent, CardActions, Typography, Stack, Chip, Button} from "@mui/material";
import type {Internship} from "../api/internshipsApi.ts";

type  Props = {
    internship: Internship;
};

export default function InternshipCard({internship}: Readonly<Props>) {
    const MAX_TECHNOLOGIES = 3;
    const technologies = internship.technologies ?? [];
    const visible = technologies.slice(0, MAX_TECHNOLOGIES);
    const remaining = technologies.length - visible.length;

    return (
        <Card variant="outlined">
            <CardContent>
                <Typography variant="h6">
                    {internship.title}
                </Typography>

                <Typography variant="body2"
                            color="text.secondary"
                            sx={{mt: 1}}>
                    <strong>{internship.companyName}</strong>
                </Typography>

                <Typography variant="body2" sx={{mt: 2}}>
                    {internship.description}
                </Typography>

                {internship.technologies?.length > 0 && (
                    <Stack direction="row" spacing={1} sx={{flexWrap: "wrap"}}>
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