import { useEffect, useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';
import { visuallyHidden } from '@mui/utils';
import { Fab, LinearProgress } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { delete_event, get_events } from '../services/EventService';

const dateOptions = {
  year: 'numeric',	
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
};

const events = [
  {
    event_name: "Team Meeting",
    date: "2025-01-20",
    time: "10:00 AM",
    location: "Conference Room A",
  },
  {
    event_name: "Project Presentation",
    date: "2025-01-21",
    time: "02:30 PM",
    location: "Auditorium",
  },
  {
    event_name: "Workshop: JavaScript Basics",
    date: "2025-01-22",
    time: "11:00 AM",
    location: "Lab 2",
  },
  {
    event_name: "Client Call",
    date: "2025-01-23",
    time: "04:00 PM",
    location: "Zoom",
  },
  {
    event_name: "Annual Company Dinner",
    date: "2025-01-25",
    time: "07:00 PM",
    location: "Grand Ballroom, Hotel XYZ",
  },
];


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

const headCells = [
	{ id: 'event_name', disablePadding: false, label: 'Event Name' },
	{ id: 'description', disablePadding: false, label: 'Description' },
	{ id: 'start', disablePadding: false, label: 'Start' },
	{ id: 'end', disablePadding: false, label: 'End' },
	{ id: 'location', disablePadding: false, label: 'Location' },
];

function EnhancedTableHead(props) {
	const {order, orderBy, onRequestSort } = props;
	const createSortHandler = (property) => (event) => {
		onRequestSort(event, property);
	};

	return (
		<TableHead>
			<TableRow>
				{headCells.map((headCell) => (
					<TableCell
						key={headCell.id}
						align={'left'}
						padding={headCell.disablePadding ? 'none' : 'normal'}
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
				<TableCell>Edit/Delete</TableCell>
			</TableRow>
		</TableHead>
	);
}

export default function ContactTable({onOpenModal, reload, setIsToastOpen, setToastMsg, filterDate}) {
	const [order, setOrder] = useState('asc');
	const [orderBy, setOrderBy] = useState('');
	const [selected, setSelected] = useState([]);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(5);
	const [eventsData, setEventsData] = useState([]);
	const [rows, setRows] = useState([])
	const [isLoading, setIsLoading] = useState(false)


	useEffect(() => {
		fetchEvents()
	}, [reload])

	useEffect(() => {
		const filterUtil = (date) => (new Date(date).toDateString());
		if(filterDate){
			const filteredData = rows.filter(r => (filterUtil(r.start.dateTime) === filterUtil(filterDate) || filterUtil(r.end.dateTime) === filterUtil(filterDate)));
			setRows([...filteredData]);
		}
		else{
			setRows([...eventsData]);
		}
	}, [filterDate])

	const fetchEvents = async () => {
		try{
			setIsLoading(true)
			const tokens = window.sessionStorage.getItem("tokens");
			const events = await get_events(tokens);
			setRows([...events]);
			setEventsData([...events]);
			setIsLoading(false);
		}
		catch(e){
			setIsLoading(false)
			setToastMsg('Failed to Fetch Contacts')
			setIsToastOpen(true)
		}
	}

	const visibleRows = useMemo(
		() =>
			[...rows]
				.sort(getComparator(order, orderBy))
				.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
		[rows, order, orderBy, page, rowsPerPage],
	);

	const handleRequestSort = (event, property) => {
		const isAsc = orderBy === property && order === 'asc';
		setOrder(isAsc ? 'desc' : 'asc');
		setOrderBy(property);
	};

	const handleClick = (event, first_name) => {
		const selectedIndex = selected.indexOf(first_name);
		let newSelected = [];

		if (selectedIndex === -1) {
			newSelected = newSelected.concat(selected, first_name);
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
		const selectedValue = parseInt(event.target.value, 10)
		setRowsPerPage(selectedValue);
		setPage(0);
	};

	const handleEditClick = (e, row) => {
		onOpenModal(row, 'edit')
	}

	const handleDeleteClick = async (e, row) => {
		setIsLoading(true)
		try{
			const tokens = window.sessionStorage.getItem('tokens');
			await delete_event(row.id, tokens)
			const newRows = rows.filter(r => r.id !== row.id);
			setRows([...newRows]);
			setToastMsg('Deleted Successfully')
			setIsToastOpen(true)
			setIsLoading(false);
		}
		catch(e){
			setIsLoading(false);
			console.error(e)
			setToastMsg('Failed to delete.')
			setIsToastOpen(true)
		}

	}

	const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

	return (
		<Box sx={{ width: '100%' }}>
			<Paper sx={{ width: '100%', mb: 2 }}>
				<TableContainer>
				<Box sx={{ width: '100%' }} display={isLoading ? 'block' : 'none'}><LinearProgress /></Box> 
					<Table
						sx={{ minWidth: 750 }}
						aria-labelledby="tableTitle"
					>
						<EnhancedTableHead
							numSelected={selected.length}
							order={order}
							orderBy={orderBy}
							onRequestSort={handleRequestSort}
							rowCount={rows.length}
						/>
						<TableBody>
							{visibleRows.map((row) => {
								return (
									<TableRow
										hover
										onClick={(event) => handleClick(event, row.event_name)}
										tabIndex={-1}
										key={row.id}
										sx={{ cursor: 'pointer' }}
									>
										<TableCell align="left">{row?.summary}</TableCell>
										<TableCell align="left">{row?.description}</TableCell>
										<TableCell align="left">{new Date(row?.start?.dateTime).toLocaleString('en-US', dateOptions)}</TableCell>
										<TableCell align="left">{new Date(row?.end?.dateTime).toLocaleString('en-US', dateOptions)}</TableCell>
										<TableCell align="left">{row?.location}</TableCell>
										<TableCell align="left">
											<Fab color="secondary" onClick={(e) => handleEditClick(e, row)} size='small' aria-label="edit" sx={{mb: 1, mr: 1}}><Edit /></Fab>
											<Fab color="error" onClick={(e) => handleDeleteClick(e, row)} size='small' aria-label="delete" sx={{mb: 1}}><Delete /></Fab>
										</TableCell>
									</TableRow>
								);
							})}
							{emptyRows > 0 && (
								<TableRow style={{ height: 53 * emptyRows }}>
									<TableCell colSpan={6} />
								</TableRow>
							)}
						</TableBody>
					</Table>
				</TableContainer>
				<TablePagination
					rowsPerPageOptions={[5, 10, 25, { value: rows.length, label: 'All' }]}
					component="div"
					count={rows.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onPageChange={handleChangePage}
					onRowsPerPageChange={handleChangeRowsPerPage}
				/>
			</Paper>
		</Box>
	);
}