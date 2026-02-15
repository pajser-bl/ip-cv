import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {
    Container,
    Typography,
    Box,
    TextField,
    Stack,
    CircularProgress,
    ToggleButtonGroup,
    ToggleButton,
    Alert,
} from "@mui/material";
import {Link} from "react-router-dom";
import MyInternshipCard from "../components/MyInternshipCard";
import {getMyInternshipsPaged, type MyInternship, type PageDto} from "../api/internshipsApi";
import {useDebouncedValue} from "../hooks/useDebouncedValue";

const PAGE_SIZE = 24;

export default function MyInternshipsPage() {
    const [items, setItems] = useState<MyInternship[]>([]);
    const [pageData, setPageData] = useState<PageDto<MyInternship> | null>(null);

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const [q, setQ] = useState("");
    const debouncedQ = useDebouncedValue(q);

    const [statusFilter, setStatusFilter] = useState<"APPLIED" | "ACCEPTED" | "REJECTED" | null>(null);

    const pageRef = useRef(0);
    const inFlightRef = useRef(false);
    const hasMoreRef = useRef(true);
    const abortRef = useRef<AbortController | null>(null);
    const seqRef = useRef(0);

    const sentinelRef = useRef<HTMLDivElement | null>(null);

    // TODO: later replace with real CV endpoint
    const isCvIncomplete = true;

    const filtersKey = useMemo(
        () => `${debouncedQ.trim()}|${statusFilter ?? ""}`,
        [debouncedQ, statusFilter]
    );

    const reset = useCallback(() => {
        // Invalidate any in-flight response
        seqRef.current += 1;

        abortRef.current?.abort();
        abortRef.current = null;

        pageRef.current = 0;
        inFlightRef.current = false;
        hasMoreRef.current = true;

        setItems([]);
        setPageData(null);
        setError(null);
        setLoading(false);
    }, []);

    useEffect(() => {
        reset();
    }, [filtersKey, reset]);

    const loadMore = useCallback(async () => {
        if (inFlightRef.current) return;
        if (!hasMoreRef.current) return;

        inFlightRef.current = true;
        setLoading(true);
        setError(null);

        // Abort previous request (if any)
        abortRef.current?.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        const mySeq = seqRef.current;
        const page = pageRef.current;

        try {
            const data = await getMyInternshipsPaged(
                {
                    page,
                    size: PAGE_SIZE,
                    q: debouncedQ,
                    applicationStatus: statusFilter ?? undefined,
                },
                controller.signal
            );

            // Ignore stale responses after reset
            if (mySeq !== seqRef.current) return;

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

            pageRef.current = page + 1;
            hasMoreRef.current = data.page < data.totalPages - 1;
        } catch (e: any) {
            if (e?.name === "AbortError") return;
            if (mySeq !== seqRef.current) return;

            setError(e instanceof Error ? e.message : String(e));
        } finally {
            if (mySeq === seqRef.current) {
                setLoading(false);
                inFlightRef.current = false;
            }
        }
    }, [debouncedQ, statusFilter]);

    useEffect(() => {
        loadMore();
    }, [filtersKey, loadMore]);

    useEffect(() => {
        const el = sentinelRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const first = entries[0];
                if (!first?.isIntersecting) return;
                loadMore();
            },
            {
                root: null,
                rootMargin: "400px 0px 400px 0px",
                threshold: 0,
            }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [loadMore]);

    // Fix for: sentinel visible initially / stays visible after load
    const maybeFillViewport = useCallback(async () => {
        const el = sentinelRef.current;
        if (!el) return;

        // Hard cap prevents runaway loops if backend misbehaves
        for (let i = 0; i < 10; i++) {
            const rect = el.getBoundingClientRect();
            const sentinelVisible = rect.top < window.innerHeight;

            if (!sentinelVisible) return;
            if (inFlightRef.current) return;
            if (!hasMoreRef.current) return;

            await loadMore();
            await new Promise((r) => requestAnimationFrame(() => r(null)));
        }
    }, [loadMore]);

    useEffect(() => {
        maybeFillViewport();
    }, [items.length, filtersKey, maybeFillViewport]);

    const hasMore = hasMoreRef.current;

    return (
        <Container maxWidth="lg" sx={{py: 3}}>
            <Typography variant="h4" sx={{mb: 2}}>
                My Internships
            </Typography>

            {isCvIncomplete && (
                <Alert severity="warning" sx={{mb: 2}}>
                    <strong>Your CV is incomplete.</strong>{" "}
                    <Link to="/profile" style={{color: "inherit", textDecoration: "underline"}}>
                        Complete your CV
                    </Link>
                </Alert>
            )}

            <Stack spacing={2} sx={{mb: 2}}>
                <TextField
                    label="Search"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    fullWidth
                />

                <Box>
                    <Typography variant="body2" sx={{mb: 1}}>
                        Filter by status:
                    </Typography>
                    <ToggleButtonGroup
                        value={statusFilter}
                        exclusive
                        onChange={(_, newValue) => setStatusFilter(newValue)}
                        size="small"
                    >
                        <ToggleButton value={null}>All</ToggleButton>
                        <ToggleButton value="APPLIED">Applied</ToggleButton>
                        <ToggleButton value="ACCEPTED">Accepted</ToggleButton>
                        <ToggleButton value="REJECTED">Rejected</ToggleButton>
                    </ToggleButtonGroup>
                </Box>
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
                    <Typography variant="body2" color="text.secondary" sx={{mb: 2}}>
                        {statusFilter
                            ? `You don't have any ${statusFilter.toLowerCase()} internships matching your criteria.`
                            : "You haven't applied to any internships yet."}
                    </Typography>
                    <Link to="/internships">
                        <Typography variant="body2" color="primary">
                            Browse all internships
                        </Typography>
                    </Link>
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
                    <MyInternshipCard key={internship.id} internship={internship}/>
                ))}
            </Box>

            <Box sx={{display: "flex", justifyContent: "center", py: 3}}>
                {loading && <CircularProgress/>}
            </Box>

            <div ref={sentinelRef} style={{height: 1}}/>

            {!loading && pageData && !hasMore && items.length > 0 && (
                <Box sx={{py: 3, textAlign: "center"}}>
                    <Typography variant="body2" color="text.secondary">
                        You've reached the end.
                    </Typography>
                </Box>
            )}
        </Container>
    );
}

