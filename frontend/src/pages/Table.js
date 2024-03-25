import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';

function createData(data) {
    return {
        name: data.name,
        base_frequency: data.base_frequency,
        cache: data.cache,
        instruction_set: data.instruction_set,
        lithography: data.lithography,
        num_cores: data.num_cores,
        processor_id: data.processor_id,
        product_collection: data.product_collection,
        status: data.status,
        tdp: data.tdp,
        vertical_segment: data.vertical_segment,
        launch_date: data.launch_date
    };
}

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
}
  
function getComparator(order, orderBy) {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

const headCells = [
    {
        id: 'processor_id',
        numeric: true,
        disablePadding: true,
        label: 'Processor ID',
    },
    {
        id: 'name',
        numeric: false,
        disablePadding: true,
        label: 'Processor Name',
    },
    {
        id: 'status',
        numeric: false,
        disablePadding: true,
        label: 'Status',
    },
    {
        id: 'num_cores',
        numeric: true,
        disablePadding: true,
        label: 'Num of Cores',
    },
    {
        id: 'cache',
        numeric: false,
        disablePadding: true,
        label: 'Cache',
    },
    {
        id: 'base_frequency',
        numeric: false,
        disablePadding: true,
        label: 'Base Frequency',
    },
    {
        id: 'lithography',
        numeric: false,
        disablePadding: true,
        label: 'Lithography',
    },
    {
        id: 'instruction_set',
        numeric: false,
        disablePadding: true,
        label: 'Instruction Set',
    },
    {
        id: 'tdp',
        numeric: false,
        disablePadding: true,
        label: 'TDP',
    },
    {
        id: 'product_collection',
        numeric: false,
        disablePadding: true,
        label: 'Product Collection',
    },
    {
        id: 'vertical_segment',
        numeric: false,
        disablePadding: true,
        label: 'Vertical Segment',
    },
    {
        id: 'launch_date',
        numeric: false,
        disablePadding: true,
        label: 'Launch Date',
    }
];

function EnhancedTableHead(props) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
      props;
    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    };
  
    return (
        <TableHead>
            <TableRow>
            <TableCell padding="checkbox">
            </TableCell>
                {headCells.map((headCell) => (
                    <TableCell
                    key={headCell.id}
                    align={'center'}
                    // padding={headCell.disablePadding ? 'none' : 'normal'}
                    sortDirection={orderBy === headCell.id ? order : false}
                    >
                    <TableSortLabel
                        active={orderBy === headCell.id}
                        direction={orderBy === headCell.id ? order : 'asc'}
                        onClick={createSortHandler(headCell.id)}
                    >
                        {headCell.label}
                        {orderBy === headCell.id ? (
                        <Box component="span" sx={visuallyHidden}>
                            {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                        </Box>
                        ) : null}
                    </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}
  
EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};  

function EnhancedTableToolbar(props) {
    const { numSelected } = props;
  
    return (
        <Toolbar
            sx={{
            pl: { sm: 2 },
            pr: { xs: 1, sm: 1 },
            ...(numSelected > 0 && {
                bgcolor: (theme) =>
                alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
            }),
            }}
        >
            {numSelected > 0 ? (
            <Typography
                sx={{ flex: '1 1 100%' }}
                color="inherit"
                variant="subtitle1"
                component="div"
            >
                {numSelected} selected
            </Typography>
            ) : (
            <Typography
                sx={{ flex: '1 1 100%' }}
                variant="h6"
                id="tableTitle"
                component="div"
            >
                Intel Processors
            </Typography>
            )}
    
            {numSelected > 0 ? (
            <Tooltip title="Delete">
                <IconButton>
                <DeleteIcon />
                </IconButton>
            </Tooltip>
            ) : (
            <Tooltip title="Filter list">
                <IconButton>
                <FilterListIcon />
                </IconButton>
            </Tooltip>
            )}
        </Toolbar>
    );
}
  
EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
};  

export default function DataTable() {
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tabledata, setTabledata] = useState([]);
    const [rows, setRows] = useState([]);

    // fetching data from table api using useEffect
    useEffect(() => {
        const fetch_graph_data = async () => {
            try {
                const res = await axios.get('/table');
                setTabledata(res.data);
                setLoading(false);
                setError(null);
                setRows(res.data.map(createData));
                // console.log(res.data);
                if (res.data.error) {
                    console.log(res.data.error);
                }
            } catch (error) {
                setError(error);
                setLoading(false);
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
            }
        };
    
        fetch_graph_data();
    }, []);

    // useEffect(() => {
    //     const rows = tabledata.map(createData);
    //     setRows(rows);
    // }, [tabledata]);

    // console.log(tabledata);
    // const rows = tabledata.map(createData);
    // console.log(rows)

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
        const newSelected = rows.map((n) => n.id);
        setSelected(newSelected);
        return;
        }
        setSelected([]);
    };

    const handleClick = (event, id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
        newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
        newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(
            selected.slice(0, selectedIndex),
            selected.slice(selectedIndex + 1),
        );
        }
        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const isSelected = (id) => selected.indexOf(id) !== -1;

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    const visibleRows = React.useMemo(
        () =>
        stableSort(rows, getComparator(order, orderBy)).slice(
            page * rowsPerPage,
            page * rowsPerPage + rowsPerPage,
        ),
        [order, orderBy, page, rowsPerPage],
    );

    return (
        <>
        {loading ? (
                <Box display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh">
                    <CircularProgress />
                </Box>
            ) : error ? (
                <div>Error: {error.message}</div>
            ) : (
        <Box sx={{ width: '100%' }}>
        <Paper sx={{ width: '100%', mb: 2 }}>
            <EnhancedTableToolbar numSelected={selected.length} />
            <TableContainer>
            <Table
                sx={{ minWidth: 750 }}
                aria-labelledby="tableTitle"
                size={dense ? 'small' : 'medium'}
            >
                <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
                />
                <TableBody>
                {visibleRows.map((row, index) => {
                    const isItemSelected = isSelected(row.processor_id);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                    <TableRow
                        hover
                        onClick={(event) => handleClick(event, row.processor_id)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.processor_id}
                        selected={isItemSelected}
                        sx={{ cursor: 'pointer' }}
                    >
                        <TableCell padding="checkbox">
                        <Checkbox
                            color="primary"
                            checked={isItemSelected}
                            inputProps={{
                            'aria-labelledby': labelId,
                            }}
                        />
                        </TableCell>
                        <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                        align="center"
                        >
                        {row.processor_id}
                        </TableCell>
                        <TableCell align="center">{row.name}</TableCell>
                        <TableCell align="center">{row.status}</TableCell>
                        <TableCell align="center">{row.num_cores}</TableCell>
                        <TableCell align="center">{row.cache}</TableCell>
                        <TableCell align="center">{row.base_frequency}</TableCell>
                        <TableCell align="center">{row.lithography}</TableCell>
                        <TableCell align="center">{row.instruction_set}</TableCell>
                        <TableCell align="center">{row.tdp}</TableCell>
                        <TableCell align="center">{row.product_collection}</TableCell>
                        <TableCell align="center">{row.vertical_segment}</TableCell>
                        <TableCell align="center">{row.launch_date}</TableCell>
                    </TableRow>
                    );
                })}
                {emptyRows > 0 && (
                    <TableRow
                    style={{
                        height: (dense ? 33 : 53) * emptyRows,
                    }}
                    >
                    <TableCell colSpan={6} />
                    </TableRow>
                )}
                </TableBody>
            </Table>
            </TableContainer>
            <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
        </Box>
        )}
        </>
    );
}
