import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Paper,
    Checkbox,
    Button,
} from '@mui/material';
import { useEffect, useState } from 'react';

export default function DataTable({
    columns,
    data,
    page,
    rowsPerPage,
    totalCount,
    onPageChange,
    onRowsPerPageChange,
    selectable = false,
    selectedRows = [],
    onSelectRow,
    onSelectAll,
    getRowId = (row) => row.id,
    HandleDeleteAll,
    handleChange
}) {
    // const [showedData, setShowedData] = useState(data.slice(0, (page + 1) * rowsPerPage));
    const [showedData, setShowedData] = useState(data || []);
    useEffect(() => {
        // const start = page * rowsPerPage;
        // const end = start + rowsPerPage;
        setShowedData(data);
    }, [data,]);

    const handlePageChange = (event, newPage) => {
        onPageChange(newPage);
    };


    return (
        <Paper
            sx={{
                width: '100%',
                overflow: 'hidden',
                borderRadius: '12px',
                // Replaced var(--shadow-sm)
                boxShadow: '0 1px 2px 0 hsl(215 25% 15% / 0.05)',
                // Replaced var(--border)
                border: '1px solid hsl(215, 20%, 88%)',
            }}
        >
            <TableContainer sx={{ maxHeight: 600 }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            {selectable && (
                                <TableCell
                                    padding="checkbox"
                                    sx={{
                                        // Replaced var(--secondary)
                                        bgcolor: 'hsl(215, 20%, 94%)',
                                        // Replaced var(--border)
                                        borderBottom: '1px solid hsl(215, 20%, 88%)',
                                    }}
                                >
                                    <Checkbox
                                        indeterminate={selectedRows.length > 0 && selectedRows.length < data.length}
                                        checked={data.length > 0 && selectedRows.length === data.length}
                                        onChange={onSelectAll}
                                        sx={{
                                            color: 'hsl(215, 15%, 50%)',
                                            '&.Mui-checked': { color: 'hsl(174, 62%, 40%)' },
                                        }}
                                    />
                                </TableCell>
                            )}
                            {columns.map((column) => (
                                <TableCell
                                    key={String(column.id)}
                                    align={column.align || 'left'}
                                    sx={{
                                        minWidth: column.minWidth,
                                        // Replaced var(--secondary)
                                        bgcolor: 'hsl(215, 20%, 94%)',
                                        // Replaced var(--secondary-foreground)
                                        color: 'hsl(215, 25%, 25%)',
                                        fontWeight: 600,
                                        fontSize: '0.75rem',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em',
                                        // Replaced var(--border)
                                        borderBottom: '1px solid hsl(215, 20%, 88%)',
                                        fontFamily: 'Inter, sans-serif',
                                    }}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {showedData?.map((row) => {
                            const rowId = getRowId(row);
                            const isSelected = selectedRows.includes(rowId);
                            return (
                                <TableRow
                                    hover
                                    key={rowId}
                                    selected={isSelected}
                                    sx={{
                                        // Replaced var(--muted) with opacity
                                        '&:hover': { bgcolor: 'hsl(215, 15%, 92% / 0.5) !important' },
                                        // Replaced var(--primary-light)
                                        '&.Mui-selected': { bgcolor: 'hsl(174, 55%, 92%)' },
                                        '&.Mui-selected:hover': { bgcolor: 'hsl(174, 55%, 92%)' },
                                    }}
                                >
                                    {selectable && (
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                checked={isSelected}
                                                onChange={() => onSelectRow?.(rowId)}
                                                sx={{
                                                    color: 'hsl(215, 15%, 50%)',
                                                    '&.Mui-checked': { color: 'hsl(174, 62%, 40%)' },
                                                }}
                                            />
                                        </TableCell>
                                    )}
                                    {columns.map((column) => (
                                        <TableCell
                                            key={String(column.id)}
                                            align={column.align || 'left'}
                                            sx={{
                                                color: 'hsl(215, 25%, 15%)',
                                                borderBottom: '1px solid hsl(215, 20%, 88%)',
                                                fontFamily: 'Inter, sans-serif',
                                            }}
                                        >
                                            {column.render
                                                ? column.render(row)
                                                : row[column.id]}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50]}
                component="div"
                count={totalCount}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(_, newPage) => { HandlePageChange(newPage) }}
                // onRowsPerPageChange={(e) => onRowsPerPageChange(parseInt(e.target.value, 10))}
                sx={{
                    borderTop: '1px solid hsl(215, 20%, 88%)',
                    color: 'hsl(215, 25%, 15%)',
                    '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                        fontFamily: 'Inter, sans-serif',
                    },
                    width: "fit-content",
                    float: "right"
                }}
                onRowsPerPageChange={handleChange}
            />
            {selectedRows.length > 0 && <Button
                variant="contained"
                onClick={() => setDeleteDialogOpen(false)}
                sx={{
                    bgcolor: 'hsl(0, 72%, 51%)', // Destructive
                    borderRadius: '10px',
                    textTransform: 'none',
                    fontWeight: 600,
                    '&:hover': { bgcolor: 'hsl(0, 72%, 51%, 0.9)' },
                    marginY: 1,
                    marginLeft: 2
                }}
            >
                Delete All
            </Button>}
        </Paper>
    );
}