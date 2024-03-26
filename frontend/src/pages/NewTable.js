import { useMemo } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import React, { useEffect, useState } from "react"
import axios from 'axios';
import { Box, Button } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { mkConfig, generateCsv, download } from 'export-to-csv'; 

const csvConfig = mkConfig({
    fieldSeparator: ',',
    decimalSeparator: '.',
    useKeysAsHeaders: true,
});

const statusList = ["Announced", "Discontinued", "Launched"]

const NewTable = () => {
    // const [loading, setLoading] = useState(true);
    // const [error, setError] = useState(null);
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetch_table_data = async () => {
            try {
                const res = await axios.get('/table');
                setData(res.data);
                // setLoading(false);
                // setError(null);
                console.log(res.data);
                if (res.data.error) {
                    console.log(res.data.error);
                }
            } catch (error) {
                // setError(error);
                // setLoading(false);
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
            }
        };
        fetch_table_data();
    }, []);


    const columns = useMemo(
    () => [
        {
            accessorKey: 'processor_id',
            header: 'Processor ID',
            type: 'numeric',
            size: 40
        },
        {
            accessorKey: 'name',
            header: 'Processor Name',
            size: 200
        },
        {
            accessorKey: 'status',
            header: 'Status',
            size: 40,
            filterVariant: 'select',
            filterSelectOptions: statusList,
        },
        {
            accessorKey: 'num_cores',
            header: 'Number of Cores',
            type: 'numeric',
            size: 60,
            filterVariant: 'range',
            filterFn: 'between',
        },
        {
            accessorKey: 'cache',
            header: 'Cache',
            size: 40
        },
        {
            accessorKey: 'base_frequency',
            header: 'Base Frequency',
            size: 40
        },
        {
            accessorKey: 'lithography',
            header: 'Lithography',
            size: 40
        },
        {
            accessorKey: 'instruction_set',
            header: 'Instruction Set',
            size: 40
        },
        {
            accessorKey: 'tdp',
            header: 'TDP',
            size: 40
        },
        {
            accessorKey: 'product_collection',
            header: 'Product Collection'
        },
        {
            accessorKey: 'vertical_segment',
            header: 'Vertical Segment',
            size: 40
        },
        {
            accessorKey: 'launch_date',
            header: 'Launch Date',
            size: 40
        }
    ],
    [],
    );

    const handleExportRows = (rows) => {
        const rowData = rows.map((row) => row.original);
        const csv = generateCsv(csvConfig)(rowData);
        download(csvConfig)(csv);
    };

    const handleExportData = () => {
        const csv = generateCsv(csvConfig)(data);
        download(csvConfig)(csv);
    };

    const table = useMaterialReactTable({
        columns,
        data,
        enableRowSelection: true,
        columnFilterDisplayMode: 'popover',
        paginationDisplayMode: 'pages',
        positionToolbarAlertBanner: 'bottom',
        renderTopToolbarCustomActions: ({ table }) => (
        <Box
            sx={{
            display: 'flex',
            gap: '16px',
            padding: '8px',
            flexWrap: 'wrap',
            }}
        >
            <Button
            //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
            onClick={handleExportData}
            startIcon={<FileDownloadIcon />}
            >
            Export All Data
            </Button>
            <Button
            disabled={table.getPrePaginationRowModel().rows.length === 0}
            //export all rows, including from the next page, (still respects filtering and sorting)
            onClick={() =>
                handleExportRows(table.getPrePaginationRowModel().rows)
            }
            startIcon={<FileDownloadIcon />}
            >
            Export All Rows
            </Button>
            <Button
            disabled={table.getRowModel().rows.length === 0}
            //export all rows as seen on the screen (respects pagination, sorting, filtering, etc.)
            onClick={() => handleExportRows(table.getRowModel().rows)}
            startIcon={<FileDownloadIcon />}
            >
            Export Page Rows
            </Button>
            <Button
            disabled={
                !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
            }
            //only export selected rows
            onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
            startIcon={<FileDownloadIcon />}
            >
            Export Selected Rows
            </Button>
        </Box>
        ),
    });

    return <MaterialReactTable table={table} />;
};

export default NewTable;
