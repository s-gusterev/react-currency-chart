import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';

interface CustomSelectProps {
  value: string;
  selectValues: string[];
  onChange: (event: SelectChangeEvent) => void;
  onOpen: () => void;
  onClose: () => void;
}

const CustomSelect = ({
  value,
  selectValues,
  onChange,
  onOpen,
  onClose,
}: CustomSelectProps) => {
  return (
    <Select
      value={value}
      onChange={onChange}
      onOpen={onOpen}
      onClose={onClose}
      sx={{
        color: 'white',
        fontFamily: 'ui-sans-serif, system-ui, sans-serif',
        fontWeight: 'bold',
        bgcolor: '#8b5cf6',
        border: '0',

        ':hover': {
          bgcolor: '#db2777',
          border: '0',
        },

        '.MuiOutlinedInput-notchedOutline': {
          border: '0',
        },
      }}
    >
      {selectValues.map((item: string) => (
        <MenuItem
          key={item}
          value={item}
          selected={false}
          sx={{
            bgcolor: '#393D52',
            color: 'white',
            fontWeight: 'bold',
            ':hover': {
              bgcolor: '#db2777',
            },
            ':focus': {
              bgcolor: '#db2777',
            },
          }}
        >
          {item}
        </MenuItem>
      ))}
    </Select>
  );
};

export default CustomSelect;
