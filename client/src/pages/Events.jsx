import { Box, Button, Container, Snackbar } from '@mui/material'
import React, { useEffect, useState } from 'react'
import EventTable from '../components/Table'
import { Add, BorderColor } from '@mui/icons-material'
import { Typography } from '@mui/material'
import FormModal from '../components/Modal'
import { useNavigate } from 'react-router-dom'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'

const Contact = () => {
	const [open, setOpen] = useState(false);
	const [mode, setMode] = useState('')
	const [modalData, setModalData] = useState(null)
	const [reload, setReload] = useState(false)
	const [isToastOpen, setIsToastOpen] = useState(false)
	const [toastMsg, setToastMsg] = useState('false')
	const [filterDate, setFilterDate] = useState(null);

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

  return (
    <Container maxWidth='xl'>

			<Snackbar open={isToastOpen} autoHideDuration={5000} onClose={handleToastClose} message={toastMsg} />

			<Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 2 }}>
				<Button variant="contained" color='secondary' onClick={() => handleModalOpen("", "add")} startIcon={<Add />} sx={{widht: 'auto'}}>
					<Typography fontSize={'small'} fontWeight={600} fontFamily={'Poppins'}>Add New</Typography>
				</Button>
				<LocalizationProvider dateAdapter={AdapterDayjs}>
					<DatePicker label="Filter by date" value={filterDate ? dayjs(filterDate) : null} onChange={(newValue) => {setFilterDate(newValue ? newValue.toISOString() : null)}} slotProps={{ field: { clearable: true } }}/>
				</LocalizationProvider>
			</Box>

			<EventTable setToastMsg={setToastMsg} setIsToastOpen={setIsToastOpen} reload={reload} onOpenModal={handleModalOpen} filterDate={filterDate} />
      <FormModal isOpen={open} setIsOpen={setOpen} data={modalData} mode={mode} onReload={handleReload} setToastMsg={setToastMsg} setIsToastOpen={setIsToastOpen} />

    </Container>
  )
}

export default Contact