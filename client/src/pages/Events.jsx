import { Box, Button, Container, IconButton, Snackbar, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import EventTable from '../components/Table'
import { Add, Search } from '@mui/icons-material'
import { Typography } from '@mui/material'
import FormModal from '../components/Modal'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import { get_events, get_events_by_date, get_events_by_query } from '../services/EventService'

const Contact = () => {
	const [open, setOpen] = useState(false);
	const [mode, setMode] = useState('')
	const [modalData, setModalData] = useState(null)
	const [reload, setReload] = useState(false)
	const [isToastOpen, setIsToastOpen] = useState(false)
	const [toastMsg, setToastMsg] = useState('false')
	const [filterDate, setFilterDate] = useState(null);
	const [rows, setRows] = useState([]);
	const [isLoading, setIsLoading] = useState(false)
	const [searchQuery, setSearchQuery] = useState('');

	useEffect(() => {
		fetchEvents()
	}, [reload])

	const handleModalOpen = (data, mode) => {
		setOpen(true)
		setModalData(data)
		setMode(mode)
	}

	const handleReload = () => {
		setReload(prev => !prev)
	}

	const handleToastClose = () => {
		setIsToastOpen(false)
	}

	const handleFilterDateChange = async (newValue) => {
		setFilterDate(newValue ? newValue.toISOString() : null);
		if(newValue === null){
			fetchEvents();
			return;
		}
		try{
			setIsLoading(true)
			const tokens = window.sessionStorage.getItem("tokens");
			const filterDate = newValue.toISOString();
			console.log(filterDate);
			const events = await get_events_by_date({tokens, filterDate});
			if (!Array.isArray(events)) throw new Error(`${events}`);
			setRows([...events]);
		}
		catch(e){
			setToastMsg(e?.message || e?.data?.message || 'Failed to Fetch Events')
			setIsToastOpen(true)
		}
		finally{
			setIsLoading(false);
		}
	}

	const handleSearchQuery = async () => {
		try{
			setIsLoading(true)
			const tokens = window.sessionStorage.getItem("tokens");
			const filterQuery = searchQuery;
			const events = await get_events_by_query({tokens, filterQuery});
			if (!Array.isArray(events)) throw new Error(`${events}`);
			setRows([...events]);
		}
		catch(e){
			setToastMsg(e?.message || e?.data?.message || 'Failed to Fetch Events')
			setIsToastOpen(true)
		}
		finally{
			setIsLoading(false);
		}
	}

	const fetchEvents = async () => {
		try{
			setIsLoading(true)
			const tokens = window.sessionStorage.getItem("tokens");
			const events = await get_events(tokens);
			if (!Array.isArray(events)) throw new Error(`${events}`);
			setRows([...events]);
		}
		catch(e){
			setToastMsg(e?.message || e?.data?.message || 'Failed to Fetch Events')
			setIsToastOpen(true)
		}
		finally{
			setIsLoading(false);
		}
	}

  return (
    <Container maxWidth='xl'>

			<Snackbar open={isToastOpen} autoHideDuration={5000} onClose={handleToastClose} message={toastMsg} />

			<Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 2 }}>
				<Button variant="contained" color='secondary' onClick={() => handleModalOpen("", "add")} startIcon={<Add />} sx={{widht: 'auto'}}>
					<Typography fontSize={'small'} fontWeight={600} fontFamily={'Poppins'}>Add New</Typography>
				</Button>
				<Box>
					<TextField id="outlined-basic" label="Enter search query" variant="outlined" value={searchQuery} onChange={(e) => {!e.target.value && fetchEvents(); setSearchQuery(e.target.value)}} sx={{mr: 1}} 
					slotProps={{
						input: {
						endAdornment: (
							<IconButton onClick={handleSearchQuery} edge="end" >	
								<Search />
							</IconButton>
						),
					},
					}}/>
					<LocalizationProvider dateAdapter={AdapterDayjs}>
						<DatePicker label="Filter by date" value={filterDate ? dayjs(filterDate) : null} onChange={handleFilterDateChange} slotProps={{ field: { clearable: true } }}/>
					</LocalizationProvider>
				</Box>
			</Box>

			<EventTable setToastMsg={setToastMsg} setIsToastOpen={setIsToastOpen} rows={rows} onOpenModal={handleModalOpen} isLoading={isLoading} setIsLoading={setIsLoading} />
      <FormModal isOpen={open} setIsOpen={setOpen} data={modalData} mode={mode} onReload={handleReload} setToastMsg={setToastMsg} setIsToastOpen={setIsToastOpen} />

    </Container>
  )
}

export default Contact