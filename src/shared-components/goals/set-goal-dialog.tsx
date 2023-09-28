﻿import React, { useMemo, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import {
    Autocomplete,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    MenuItem,
    Select,
    TextField
} from '@mui/material';
import Button from '@mui/material/Button';

import Box from '@mui/material/Box';
import { ICharacter, IPersonalGoal } from '../../models/interfaces';
import { v4 } from 'uuid';
import { PersonalGoalType, Rank, Rarity } from '../../models/enums';
import { useCharacters } from '../../services';
import InputLabel from '@mui/material/InputLabel';
import { CharacterTitle } from '../character-title';
import { getEnumValues, rankToString } from '../../shared-logic/functions';
import { RankImage } from '../rank-image';

export const SetGoalDialog = ({ isOpen, onClose }: { isOpen: boolean, onClose: (goal?: IPersonalGoal) => void }) => {
    const { characters } = useCharacters();
    const [open, setOpen] = React.useState(false);
    const [character, setCharacter] = React.useState<ICharacter | null>(null);
    const [form, setForm] = useState<IPersonalGoal>(() =>({
        id: v4(),
        character: '',
        type: PersonalGoalType.UpgradeRank,
        targetRarity: Rarity.Uncommon,
        targetRank: Rank.Stone1
    }));

    const rarityValues = useMemo(() => {
        const result = getEnumValues(Rarity).filter(x => x > 0 && (!character || x >= character.rarity));
        setForm(curr => ({ ...curr, targetRarity: character?.rarity ?? result[0] }));
        return result;
    }, [character]);
    
    const targetRaritySelector = (
        <FormControl style={{ marginTop: 20 }} fullWidth >
            <InputLabel id="target-rarity-label">Target Rarity</InputLabel>
            <Select<Rarity>
                id="target-rarity"
                labelId="target-rarity-label"
                label="Target Rarity"
                defaultValue={rarityValues[0]}
                value={form.targetRarity}
                onChange={event => setForm(curr => ({ ...curr, targetRarity: +event.target.value }))}
            >
                {rarityValues.map(rarity => (
                    <MenuItem key={rarity} value={rarity}>
                        {Rarity[rarity]}
                    </MenuItem>))}
            </Select>
        </FormControl>
    );

    const rankValues = useMemo(() => {
        const result = getEnumValues(Rank).filter(x => x > 0 && (!character || x >= character.rank));
        setForm(curr => ({ ...curr, targetRank: character?.rank ?? result[0] }));
        return result;
    }, [character]);
    
    const targetRankSelector = (
        <FormControl style={{ marginTop: 20 }} fullWidth >
            <InputLabel id="target-rank-label">Target Rank</InputLabel>
            <Select<Rank>
                id="target-rank"
                labelId="target-rank-label"
                label="Target Rank"
                defaultValue={rankValues[0]}
                value={form.targetRank}
                onChange={event => setForm(curr => ({ ...curr, targetRank: +event.target.value }))}
            >
                {rankValues.map(rank => (
                    <MenuItem key={rank} value={rank}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
                            <span>{rankToString(rank)}</span>  
                            <RankImage rank={rank}/>
                        </div>
                    </MenuItem>))}
            </Select>
        </FormControl>
    );
    
    const updateValue = (value: ICharacter | null): void =>{
        if(character?.name !== value?.name) {
            setCharacter(value);
            setForm(curr => ({ ...curr, character: value?.name ?? '' }));
            setOpen(false);
        }
    };
    
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
        const key = event.key;
        if(key === 'Enter') {
            const value = (event.target as HTMLInputElement).value ?? '';
            const char = characters.find(x => x.name.toLowerCase().includes(value.toLowerCase()));
            if(char) {
                updateValue(char);
            }
        }
    };
    
    const handleClose = (value?: IPersonalGoal) => {
        setCharacter(null);
        onClose(value);
    };
    
    return (
        <Dialog open={isOpen} onClose={() => handleClose()} fullWidth>
            <DialogTitle style={{ display: 'flex', alignItems: 'center', gap: 15 }}><span>Set Goal</span> { character ? <CharacterTitle character={character}/> : undefined}</DialogTitle>
            <DialogContent>
                <Box component="form" id="set-goal-form" style={{ padding: 20 }} onSubmit={event => event.preventDefault()}>
                    <Autocomplete
                        id="combo-box-demo"
                        options={characters}
                        value={character}
                        open={open}
                        onFocus={() => setOpen(true)}
                        onBlur={() => setOpen(false)}
                        getOptionLabel={option => option.name}
                        isOptionEqualToValue={(option, value) => option.name === value.name}
                        renderOption={(props, option) => (<CharacterTitle {...props} key={option.name} character={option} showLockedWithOpacity={true} onClick={() => updateValue(option)}/>)}
                        onChange={(_, value) => updateValue(value)}
                        renderInput={(params) => 
                            <TextField 
                                {...params} 
                                fullWidth
                                onChange={() => setOpen(true)} 
                                label="Character"
                                onKeyDown={handleKeyDown}
                            />}
                    />

                    <FormControl style={{ marginTop: 20 }} fullWidth >
                        <InputLabel id="goal-type-label">Goal Type</InputLabel>
                        <Select<PersonalGoalType>
                            id="goal-type"
                            labelId="goal-type-label"
                            label="Goal Type"
                            defaultValue={PersonalGoalType.UpgradeRank}
                            onChange={event => setForm(curr => ({ ...curr, type: +event.target.value }))}
                        >
                            <MenuItem value={PersonalGoalType.UpgradeRank}>Upgrade Rank</MenuItem>
                            <MenuItem value={PersonalGoalType.Ascend}>Ascend</MenuItem>
                        </Select>
                    </FormControl>
                    
                    { character && form.type === PersonalGoalType.UpgradeRank ? targetRankSelector : undefined }
                    { character && form.type === PersonalGoalType.Ascend ? targetRaritySelector : undefined }
                    
                    <TextField
                        style={{ marginTop: 20 }}
                        fullWidth
                        id="outlined-textarea"
                        label="Notes"
                        placeholder="Notes"
                        multiline
                        helperText="Optional. Max length 200 characters."
                        onChange={event => setForm(curr => ({ ...curr, notes: event.target.value.slice(0, 200) }))}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => handleClose()}>Cancel</Button>
                <Button disabled={!form.character} onClick={() => handleClose(form)}>Set</Button>
            </DialogActions>
        </Dialog>
    );
};