import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Typography from '@mui/material/Typography';
import parse from 'autosuggest-highlight/parse';
import { debounce } from '@mui/material/utils';
import { getUsername } from '../../api.mjs';

// Import your getAllUsers function
import { getAllUsers } from '../../api.mjs';

const autocompleteService = { current: null };



export default function FindUsers({onChange}) {
  const [value, setValue] = React.useState(null);
  const [inputValue, setInputValue] = React.useState('');
  const [options, setOptions] = React.useState([]);
  const loaded = React.useRef(false);

  if (typeof window !== 'undefined' && !loaded.current) {
    // No need to load Google Maps API
    loaded.current = true;
  }

  const fetch = React.useMemo(
    () =>
      debounce(async (inputValue, callback) => {
        try {
          // Call your getAllUsers function to get user data
          const users = await getAllUsers();

          // Filter user options based on the current input value
          const filteredOptions = users
            .filter((user) =>
              user.username.toLowerCase().startsWith(inputValue.toLowerCase())
            )
            .filter((user) => user.username !== getUsername())
            .map((user) => ({
              description: user.username,
            }));

          // Set the options with the filtered user data
          setOptions(filteredOptions);
          callback(filteredOptions);
        } catch (error) {
          console.error('Error fetching users:', error);
          callback([]);
        }
      }, 400),
    []
  );

  return (
    <Autocomplete
      id="user-search"
      sx={{ width: 300 }}
      getOptionLabel={(option) =>
        typeof option === 'string' ? option : option.description
      }
      filterOptions={(x) => x}
      options={options}
      isOptionEqualToValue={(option, value) => option.description === value.description}
      autoComplete
      includeInputInList
      filterSelectedOptions
      value={value}
      noOptionsText="No users found"
      onChange={(event, newValue) => {
        setValue(newValue);
      }}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
        onChange(newInputValue);
        fetch(newInputValue, (results) => {
          setOptions(results);
        });
      }}
      renderInput={(params) => (
        <TextField {...params} label="Search for a user" fullWidth />
      )}
      renderOption={(props, option) => (
        <li {...props}>
          <Typography>{option.description}</Typography>
        </li>
      )}
    />
  );
}

