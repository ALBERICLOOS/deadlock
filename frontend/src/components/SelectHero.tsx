import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Hero } from "../types/Types";
import { Dispatch, FormEventHandler } from "react";
import { Typography, IconButton } from "@mui/material";
import { FiSend } from "react-icons/fi";

export default function SelectHero(props: { heroes: Hero[], handleSubmit: FormEventHandler<HTMLFormElement>, setSelectedHero: Dispatch<React.SetStateAction<Hero | null>>, resetKey: string }) {

    const handleHeroChange = (event: React.SyntheticEvent, value: Hero | null) => {
        props.setSelectedHero(value);
    };

    const handleIconClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault(); // Prevent the default button behavior
        props.handleSubmit(event as any); // Call the submit handler
    };

    return (
        <Box component="form" onSubmit={props.handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Autocomplete
                key={props.resetKey}  // Change this key to reset the component
                sx={{ width: 'min(400px, 90vw)' }}
                options={props.heroes}
                autoHighlight
                getOptionLabel={(option) => option.name}
                onChange={handleHeroChange}  // Handle selection change
                renderOption={(props, option) => {
                    const { key, ...optionProps } = props;
                    return (
                        <Box
                            key={key}
                            component="li"
                            sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
                            {...optionProps}
                        >
                            <img
                                loading="lazy"
                                width="50"
                                src={option.image}
                                alt=""
                                style={{ borderRadius: "10px" }}
                            />
                            <Typography variant="h1" sx={{ fontFamily: '"Orbitron", sans-serif', color: "black", fontSize: '1rem', fontWeight: "bold"}}>
                                {option.name}
                            </Typography>
                        </Box>
                    );
                }}
                renderInput={(params) => (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <TextField
                            inputRef={input => input && input.focus()}  // Focus the input on render
                            {...params}
                            label="Choose a hero"
                            variant="outlined" // Keep outline style
                            sx={{
                                label: { color: 'white' }, // Label color to white
                                input: { color: 'white', fontFamily: '"Orbitron", sans-serif'}, // Input text color to white
                                '.MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: 'white', // Border color to white
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'white', // Keep white border on hover
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: 'white', // White border when focused
                                    },
                                },
                            }}
                            slotProps={{
                                htmlInput: {
                                    ...params.inputProps,
                                    autoComplete: 'new-password', // Disable autocomplete and autofill
                                },
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault(); // Prevent default Enter key behavior
                                    props.handleSubmit(e as any); // Call the submit handler
                                }
                            }}
                        />
                        <IconButton onClick={handleIconClick} sx={{ ml: 1 }}>
                            <FiSend color="white" />
                        </IconButton>
                    </Box>
                )}
            />
        </Box>
    );
}
