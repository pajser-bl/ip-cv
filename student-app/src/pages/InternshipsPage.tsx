import {useEffect, useMemo, useState} from "react";
import {
    Container,
    Typography,
    Box,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Stack,
    Pagination,
    CircularProgress
} from "@mui/material";
import InternshipCard from "../components/InternshipCard";
import {getInternshipsPaged, type Internship, type PageDto} from "../api/internshipsApi.ts";
import {useDebouncedValue} from "../hooks/useDebouncedValue.ts";

const PAGE_SIZE = 12;

export default function InternshipsPage() {
    const [pageData, setPageData] = useState<PageDto<Internship> | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const [q, setQ] = useState("");
    const debouncedQ = useDebouncedValue(q);
    const [tech, setTech] = useState<string>("ALL");
    const [pageUi, setPageUi] = useState(1); // 1-based for MUI Pagination

    const techOptions = useMemo(() => {
        const set = new Set<string>();
        for (const i of pageData?.items ?? []) for (const t of i.technologies ?? []) set.add(t);
        return Array.from(set).sort((a, b) => a.localeCompare(b));
    }, [pageData]);

    useEffect(() => {
        setPageUi(1);
    }, [debouncedQ, tech]);

    useEffect(() => {
        const controller = new AbortController();

        const load = async () => {
            try {
                setLoading(true);
                setError(null);

                const data = await getInternshipsPaged({
                        page: pageUi - 1, // backend is 0-based
                        size: PAGE_SIZE,
                        q: debouncedQ,
                        tech: tech,
                    },
                    controller.signal
                );

                setPageData(data);
            } catch (e) {
                if (e instanceof DOMException && e.name === "AbortError") return;
                if (e instanceof Error && e.name === "AbortError") return;
                setError(e instanceof Error ? e.message : String(e));
                setPageData(null);
            } finally {
                setLoading(false);
            }
        };
        load();
        return () => controller.abort();
    }, [pageUi, debouncedQ, tech]);

    if (error) return <p style={{color: "crimson"}}>{error}</p>;

    return (
        <Container maxWidth="lg" sx={{py: 3}}>
            <Typography variant="h4" sx={{mb: 2}}>
                Internships
            </Typography>

            <Stack
                direction={{xs: "column", sm: "row"}}
                spacing={2}
                sx={{mb: 2}}
            >
                <TextField
                    label="Search"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    fullWidth
                />
                <FormControl sx={{minWidth: 220}}>
                    <InputLabel id="tech-label">Technology</InputLabel>
                    <Select
                        labelId="tech-label"
                        value={tech}
                        label="Technology"
                        onChange={(e) => setTech(String(e.target.value))}
                    >
                        <MenuItem value="ALL">All</MenuItem>
                        {techOptions.map((t) => (
                            <MenuItem key={t} value={t}>
                                {t}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Stack>

            {loading && (
                <Box sx={{display: "flex", justifyContent: "center", py: 3}}>
                    <CircularProgress/>
                </Box>
            )}

            {!loading && pageData?.items.length === 0 && (
                <Box sx={{py: 6, textAlign: "center"}}>
                    <Typography variant="h6" sx={{mb: 1}}>
                        No internships found
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        There are currently no active internships matching your criteria.
                    </Typography>
                </Box>
            )}

            {!loading && pageData && pageData.items.length > 0 && (
                <>
                    <Typography variant="body2" color="text.secondary" sx={{mb: 2}}>
                        Showing {pageData.items.length} of {pageData.totalElements}
                    </Typography>

                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                            gap: 2,
                        }}
                    >
                        {pageData.items.map((internship) => (
                            <InternshipCard key={internship.id} internship={internship}/>
                        ))}
                    </Box>

                    {pageData.totalPages > 1 && (
                        <Box sx={{display: "flex", justifyContent: "center", mt: 3}}>
                            <Pagination
                                count={pageData.totalPages}
                                page={pageUi}
                                onChange={(_, value) => setPageUi(value)}
                                color="primary"
                            />
                        </Box>
                    )}
                </>
            )}
        </Container>
    );
}
