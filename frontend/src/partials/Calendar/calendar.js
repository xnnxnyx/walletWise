import * as React from 'react';
import dayjs from 'dayjs';
import Badge from '@mui/material/Badge';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { DayCalendarSkeleton } from '@mui/x-date-pickers/DayCalendarSkeleton';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import './calender.css';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { getUserType, getUserID, addPayment, getAllEvents } from '../../api.mjs';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('America/New_York');


function ServerDay(props) {
  const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;

  // Modify isSelected condition in ServerDay
    const isSelected = highlightedDays.some(({ start, end }) =>
    props.day.isBetween(start, end, 'day', '[]')
    );

  return (
    <Badge
      key={props.day.toString()}
      overlap="circular"
      badgeContent={isSelected ? '🌚' : undefined}
    >
      <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} />
    </Badge>
  );
}


const DateCalendarServerRequest = () => {
  const requestAbortController = React.useRef(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [highlightedDays, setHighlightedDays] = React.useState([1, 2, 15]);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState(dayjs()); // Set initial date to the current date
  const [endDate, setEndDate] = React.useState(null);
  const [frequency, setFrequency] = React.useState('daily');
  const [amount, setAmount] = React.useState();
  const [category, setCategory] = React.useState('');
  const userId = getUserID();
  const userType = getUserType();


  const fetchHighlightedDays = async () => {
    const controller = new AbortController();
  
    try {
      const data = await getAllEvents(userId);
      console.log('API Response:', data);
  
      if (data && Array.isArray(data)) {
        const daysToHighlight = data.reduce((acc, frequencyData) => {
          const frequency = Object.keys(frequencyData)[0];
          const events = frequencyData[frequency];
  
          const highlightedDays = events.map(([startDate, endDate]) => ({
            start: dayjs(startDate),
            end: dayjs(endDate),
          }));
  
          return acc.concat(highlightedDays);
        }, []);
  
        setHighlightedDays(daysToHighlight);
      } else {
        console.error('Invalid data format received from getAllEvents:', data);
      }
  
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching events:', error);
      if (error.name !== 'AbortError') {
        // Handle error appropriately
      }
    }
  
    requestAbortController.current = controller;
  };
  

  
  React.useEffect(() => {
    fetchHighlightedDays(selectedDate);
    return () => requestAbortController.current?.abort();
  }, [selectedDate]);

  const handleMonthChange = (date) => {
    if (requestAbortController.current) {
      requestAbortController.current.abort();
    }

    setIsLoading(true);
    setHighlightedDays([]);
    fetchHighlightedDays(date);
  };

  const handleDayClick = (selectedDate) => {
    console.log('Hello! Date clicked:', selectedDate);
    setSelectedDate(selectedDate);
    setIsFormOpen(true);
  };

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };

  const handleOpenForm = () => {
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  const handleSaveForm = () => {
    const savedEvent = {
      selectedDate: selectedDate.format('YYYY-MM-DD'),
      endDate: endDate ? endDate.format('YYYY-MM-DD') : null,
      frequency,
      amount,
      category,
    };

    console.log('Saved Event:', savedEvent);

    setHighlightedDays([...highlightedDays, savedEvent.selectedDate]);
  
    setIsFormOpen(false);
  
    addPayment(userId, userType, savedEvent.category, savedEvent.amount, savedEvent.endDate, savedEvent.frequency, (response) => {
      console.log('API Response:', response);
    });
  };
  

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateCalendar
  defaultValue={selectedDate || dayjs()}
  loading={isLoading}
  onMonthChange={handleMonthChange}
  renderLoading={() => <DayCalendarSkeleton />}
  slots={{
    day: (props) => (
      <ServerDay {...props} highlightedDays={highlightedDays} />
    ),
  }}
  onChange={(newDate) => {
    handleDateChange(newDate);
    handleOpenForm();
  }}
  onDayClick={handleDayClick}
/>

      <Dialog open={isFormOpen} onClose={handleCloseForm}>
        <DialogTitle>Event Details</DialogTitle>
        <DialogContent>
          <p className="da">Selected date: {selectedDate && selectedDate.tz('America/New_York').format('YYYY-MM-DD HH:mm:ss')}</p>
          <p className="da">End Date:</p>
          <TextField
            // label="End date"
            type="date"
            style={{ marginBottom: '16px' }}
            value={endDate ? endDate.format('YYYY-MM-DD') : ''}
            onChange={(e) => setEndDate(dayjs(e.target.value))}
            className="end-date"
          />
          <FormControl fullWidth>
            <InputLabel id="frequency-label" className="content">Frequency</InputLabel>
            <Select
              labelId="frequency-label"
              id="frequency"
              style={{ marginBottom: '16px' }}
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
            >
              <MenuItem value="daily">Daily</MenuItem>
              <MenuItem value="weekly">Weekly</MenuItem>
              <MenuItem value="monthly">Monthly</MenuItem>
            </Select>
          </FormControl>
          <br />
          <TextField
            label="Amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="amount-input"
            style={{ marginBottom: '16px' }}
          />
          <br />
          <TextField
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="category-input"
            style={{ marginBottom: '16px' }}
          />
          <br />
        </DialogContent>
        <DialogActions className="click">
          <Button onClick={handleSaveForm} className="next">Save</Button>
          <Button onClick={handleCloseForm} className="next">Close</Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default DateCalendarServerRequest;