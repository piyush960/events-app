import { useEffect, useReducer, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { InputAdornment, TextField } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AccessTime, Description, Event, LocationOn } from '@mui/icons-material';
import dayjs from 'dayjs';
import { add_event, update_event } from '../services/EventService';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 2,
  p: 4,
};

const startDate = new Date();
const endDate = new Date(startDate.getTime() + 30 * 60 * 1000);  // Adding 30 minutes (in milliseconds)

const startDateISOString = startDate.toISOString();
const endDateISOString = endDate.toISOString();

const initialState = {
  id: '',
  event_name: '',
  description: '',
  start: startDateISOString,
  end: endDateISOString,
  location: '',
  error: '',
}

const reducer = (state, action) => {
  switch(action.type){
    case 'ID':
      return {...state, id: action.payload}
    case 'EVENTNAME':
      return {...state, event_name: action.payload}
    case 'DESCRIPTION':
      return {...state, description: action.payload}
    case 'START':
      return {...state, start: action.payload}
    case 'END':
      return {...state, end: action.payload}
    case 'LOCATION':
      return {...state, location: action.payload}
    case "ERROR":
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

export default function FormModal({isOpen, setIsOpen, data, mode, onReload, setIsToastOpen, setToastMsg}) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [isLoading, setIsLoading] = useState(false);
  const handleClose = () => setIsOpen(false);

  useEffect(() => {
    if(data){
      dispatch({type: 'ID', payload: data.id})
      dispatch({type: 'EVENTNAME', payload: data.summary})
      dispatch({type: 'DESCRIPTION', payload: data.description})
      dispatch({type: 'START', payload: data.start.dateTime})
      dispatch({type: 'END', payload: data.end.dateTime})
      dispatch({type: 'LOCATION', payload: data.location})
    }
    else{
      clearFields()
    }
  }, [data])

  const clearFields = () => {
    dispatch({type: 'ID', payload: ''})
    dispatch({type: 'EVENTNAME', payload: ''})
    dispatch({type: 'DESCRIPTION', payload: ''})
    dispatch({type: 'START', payload: startDateISOString})
    dispatch({type: 'END', payload: endDateISOString})
    dispatch({type: 'LOCATION', payload: ''})
    dispatch({type: 'ERROR', payload: ''})
  }

  const handleStartChange = (newValue) => {
    if (state.start && newValue.isAfter(state.end)) {
      dispatch({ type: "ERROR", payload: "Start time must be before the end time." });
    }
    else{
      dispatch({type: 'ERROR', payload: ''})
    }
    dispatch({ type: "START", payload: newValue.toISOString() });
  }

  const handleEndChange = (newValue) => {
    if (state.start && newValue.isBefore(state.start)) {
      dispatch({ type: "ERROR", payload: "End time must be after the start time." });
    }
    else{
      dispatch({type: 'ERROR', payload: ''})
    }
    dispatch({ type: "END", payload: newValue.toISOString() });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    if(state.error) return;
    const dataBody = {
      data: state,
      tokens: JSON.parse(window.sessionStorage.getItem('tokens')),
    }
    try{
      setIsLoading(true);
      if(mode === "add"){
        await add_event(dataBody);
      }
      else if(mode === "edit"){
        await update_event(dataBody);
      }
      setIsLoading(false);
      handleClose();
      onReload();
      setToastMsg("Operation Successful")
      setIsToastOpen(true);
    }
    catch(error){
      setToastMsg(`Failed to ${mode.toUpperCase()}`)
      setIsToastOpen(true);
      console.error(error)
    }
  }

  return (
    <div>
      <Modal
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} 
        bgcolor={'background.default'} color={'text.primary'}
        >
          <Typography align="center" fontFamily={'Poppins'} variant="h6" sx={{ mb: 2 }}>
            {mode === 'edit' ? `Edit` : `Add New`} Event
          </Typography>
          <Box
            component="form"
            onSubmit={(e) => handleFormSubmit(e)}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2
            }}
          >
            <TextField required id="outlined-basic" slotProps={{input: {startAdornment: (<InputAdornment position="start"><Event /></InputAdornment>),},}} label="Event Name" variant="outlined" value={state.event_name} onChange={(e) => dispatch({type: 'EVENTNAME', payload: e.target.value})}/>

            <TextField id="outlined-basic" slotProps={{input: {startAdornment: (<InputAdornment position="start"><Description /></InputAdornment>),},}} label="Description" variant="outlined" value={state.description} onChange={(e) => dispatch({type: 'DESCRIPTION', payload: e.target.value})}/>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label="Start"
                  value={dayjs(state.start)}
                  onChange={handleStartChange}
                  slots={{
                    openPickerIcon: AccessTime,
                  }}
                  slotProps={{
                    textField: {
                      required: true,
                      error: (state.error ? true : false)
                    },
                  }}
                  disablePast
                />
            </LocalizationProvider>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label="End"
                  value={dayjs(state.end)}
                  onChange={handleEndChange}
                  slots={{
                    openPickerIcon: AccessTime,
                  }}
                  slotProps={{
                    textField: {
                      required: true,
                      error: (state.error ? true : false),
                      helperText: state.error,
                    },
                  }}
                />
            </LocalizationProvider>

            <TextField id="outlined-basic" slotProps={{input: {startAdornment: (<InputAdornment position="start"><LocationOn /></InputAdornment>),},}} label="Location" variant="outlined" value={state.location} onChange={(e) => dispatch({type: 'LOCATION', payload: e.target.value})}/>

            <Button variant='contained' color='secondary' type='submit' disabled={isLoading}>{isLoading ? 'Please Wait...' : mode.toUpperCase()}</Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}

