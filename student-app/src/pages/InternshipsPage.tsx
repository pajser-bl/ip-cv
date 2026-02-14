import {useEffect, useMemo, useRef, useState} from "react";
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
    CircularProgress
} from "@mui/material";
import InternshipCard from "../components/InternshipCard";
import {getInternshipsPaged, type Internship, type PageDto} from "../api/internshipsApi";
import {useDebouncedValue} from "../hooks/useDebouncedValue";

const PAGE_SIZE = 12;

export default function InternshipsPage() {
    const [items, setItems] = useState<Internship[]>([]);
    const [pageData, setPageData] = useState<PageDto<Internship> | null>(null);

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const [q, setQ] = useState("");
    const debouncedQ = useDebouncedValue(q);
    const [tech, setTech] = useState<string>("ALL");
    const [page, setPage] = useState(0);

    const sentinelRef = useRef<HTMLDivElement>(null);
    const loadingRef = useRef(false);
    const hasMoreRef = useRef(true);

    const hasMore = pageData ? page < pageData?.totalPages - 1 : true;

    useEffect(() => {
        loadingRef.current = loading;
    }, [loading]);

    useEffect(() => {
        hasMoreRef.current = hasMore;
    }, [hasMore]);

    const techOptions = useMemo(() => {
        const set = new Set<string>();
        for (const i of pageData?.items ?? []) for (const t of i.technologies ?? []) set.add(t);
        return Array.from(set).sort((a, b) => a.localeCompare(b));
    }, [items]);

    useEffect(() => {
        setItems([]);
        setPageData(null);
        setPage(0);
        setError(null);
    }, [debouncedQ, tech]);

    useEffect(() => {
        const controller = new AbortController();

        const load = async () => {
            try {
                setLoading(true);
                setError(null);

                const data = await getInternshipsPaged({
                        page: page,
                        size: PAGE_SIZE,
                        q: debouncedQ,
                        tech: tech,
                    },
                    controller.signal
                );

                setPageData(data);

                setItems((prev) => {
                    if (page === 0) return data.items;
                    const seen = new Set(prev.map((x) => x.id));
                    const next = [...prev];
                    for (const item of data.items) {
                        if (!seen.has(item.id)) next.push(item);
                    }
                    return next;
                });

            } catch (e) {
                if (e instanceof DOMException && e.name === "AbortError") return;
                if (e instanceof Error && e.name === "AbortError") return;
                setError(e instanceof Error ? e.message : String(e));
                // setPageData(null);
            } finally {
                setLoading(false);
            }
        };
        load();
        return () => controller.abort();
    }, [page, debouncedQ, tech]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (!first?.isIntersecting) return;

        if (loadingRef.current) return;
        if (!hasMoreRef.current) return;

        setPage((p) => p + 1);
      },
      {
        root: null,
        rootMargin: "300px",
        threshold: 0,
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

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

            {error && (
                <Box sx={{mb: 2}}>
                    <Typography color="error">{error}</Typography>
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

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                    gap: 2,
                }}
            >
                {items.map((internship) => (
                    <InternshipCard key={internship.id} internship={internship}/>
                ))}
            </Box>

            <Box sx={{display: "flex", justifyContent: "center", py: 3}}>
                {loading && <CircularProgress/>}
            </Box>

            <div ref={sentinelRef} style={{height: 1}}/>

            {!loading && pageData && !hasMore && items.length > 0 && (
                <Box sx={{py: 3, textAlign: "center"}}>
                    <Typography variant="body2" color="text.secondary">
                        You’ve reached the end.
                    </Typography>
                </Box>
            )}
        </Container>
    );
}
