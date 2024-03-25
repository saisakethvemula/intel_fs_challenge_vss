import React, { useEffect, useState, Suspense } from "react";
import CircularProgress from '@mui/material/CircularProgress';

const LazyDataTable = React.lazy(() => import("./DataTable"));


export default function LazyLoadedDataTable() {
    return (
        <Suspense fallback={<CircularProgress />}>
            <LazyDataTable />
        </Suspense>
    );
}
