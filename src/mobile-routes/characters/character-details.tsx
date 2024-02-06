﻿import React, { useMemo, useState } from 'react';
import { ICharacter2, IMaterialRecipeIngredientFull } from '../../models/interfaces';
import { FormControl, FormGroup, Grid, Input, MenuItem, Select } from '@mui/material';
import { CharacterBias, Rank, Rarity, RarityStars } from '../../models/enums';
import InputLabel from '@mui/material/InputLabel';
import { getEnumValues, rankToString, rarityStarsToString } from '../../shared-logic/functions';
import { RankImage } from '../../shared-components/rank-image';
import { CharacterUpgrades } from '../../shared-components/character-upgrades';
import { RarityImage } from '../../shared-components/rarity-image';
import { StarsImage } from '../../shared-components/stars-image';
import { rarityToMaxRank, rarityToMaxStars } from '../../models/constants';

export const CharacterDetails = ({
    character,
    characterChanges,
}: {
    character: ICharacter2;
    characterChanges: (character: ICharacter2, updateInventory: IMaterialRecipeIngredientFull[]) => void;
}) => {
    const [formData, setFormData] = useState({
        rank: character.rank,
        rarity: character.rarity,
        stars: character.stars,
        bias: character.bias,
        level: character.level,
        shards: character.shards,
        xp: character.xp,
        activeAbilityLevel: character.activeAbilityLevel,
        passiveAbilityLevel: character.passiveAbilityLevel,
    });

    const handleInputChange = (name: keyof ICharacter2, value: boolean | number, saveValue?: boolean | number) => {
        setFormData({
            ...formData,
            [name]: value,
        });
        characterChanges({ ...character, [name]: saveValue ?? value }, []);
    };

    const maxRank = useMemo(() => {
        return rarityToMaxRank[formData.rarity];
    }, [formData.rarity]);

    const maxStars = useMemo(() => {
        return rarityToMaxStars[formData.rarity];
    }, [formData.rarity]);

    const rarityEntries: number[] = getEnumValues(Rarity);
    const rankEntries: number[] = getEnumValues(Rank).filter(x => x === formData.rank || x <= maxRank);
    const biasEntries: number[] = getEnumValues(CharacterBias);
    const starsEntries: number[] = getEnumValues(RarityStars).filter(x => x === formData.stars || x <= maxStars);

    const getNativeSelectControl = (
        value: number,
        label: string,
        name: keyof ICharacter2,
        entries: Array<number>,
        getName: (value: number) => string,
        icon?: (value: number) => React.JSX.Element
    ) => (
        <FormControl fullWidth>
            <InputLabel>{label}</InputLabel>
            <Select label={label} value={value} onChange={event => handleInputChange(name, +event.target.value)}>
                {entries.map(value => (
                    <MenuItem key={value} value={value}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <span>{getName(value)}</span>
                            {icon ? icon(value) : undefined}
                        </div>
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );

    return (
        <FormGroup style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '1rem' }}>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={6}>
                    {getNativeSelectControl(
                        formData.rarity,
                        'Rarity',
                        'rarity',
                        rarityEntries,
                        value => Rarity[value],
                        value => (
                            <RarityImage rarity={value} />
                        )
                    )}
                </Grid>
                <Grid item xs={6}>
                    {getNativeSelectControl(
                        formData.stars,
                        'Stars',
                        'stars',
                        starsEntries,
                        rarityStarsToString,
                        value => (
                            <StarsImage stars={value} />
                        )
                    )}
                </Grid>
            </Grid>

            <Grid container spacing={2} alignItems="center">
                <Grid item xs={6}>
                    {getNativeSelectControl(formData.rank, 'Rank', 'rank', rankEntries, rankToString, value => (
                        <RankImage rank={value} />
                    ))}
                </Grid>
                <Grid item xs={6}>
                    <FormControl variant={'outlined'} fullWidth>
                        <InputLabel>Shards</InputLabel>
                        <Input
                            disableUnderline={true}
                            value={formData.shards}
                            onChange={event =>
                                handleInputChange(
                                    'shards',
                                    event.target.value === '' ? '' : (Number(event.target.value) as any),
                                    Number(event.target.value)
                                )
                            }
                            inputProps={{
                                step: 1,
                                min: 0,
                                max: 10000,
                                type: 'number',
                                'aria-labelledby': 'input-slider',
                            }}
                        />
                    </FormControl>
                </Grid>
            </Grid>

            {getNativeSelectControl(formData.bias, 'LRE Bias', 'bias', biasEntries, value => CharacterBias[value])}

            {formData.rank > Rank.Locked ? (
                <React.Fragment>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <InputLabel>Character Level</InputLabel>
                                <Input
                                    value={formData.level}
                                    onChange={event =>
                                        handleInputChange(
                                            'level',
                                            event.target.value === '' ? '' : (Number(event.target.value) as any),
                                            Number(event.target.value)
                                        )
                                    }
                                    inputProps={{
                                        step: 1,
                                        min: 0,
                                        max: 50,
                                        type: 'number',
                                        'aria-labelledby': 'input-slider',
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <InputLabel>XP</InputLabel>
                                <Input
                                    value={formData.xp}
                                    onChange={event =>
                                        handleInputChange(
                                            'xp',
                                            event.target.value === '' ? '' : (Number(event.target.value) as any),
                                            Number(event.target.value)
                                        )
                                    }
                                    inputProps={{
                                        step: 100,
                                        min: 0,
                                        max: 283000,
                                        type: 'number',
                                        'aria-labelledby': 'input-slider',
                                    }}
                                />
                            </FormControl>
                        </Grid>
                    </Grid>

                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <InputLabel>Active Ability</InputLabel>
                                <Input
                                    value={formData.activeAbilityLevel}
                                    onChange={event =>
                                        handleInputChange(
                                            'activeAbilityLevel',
                                            event.target.value === '' ? '' : (Number(event.target.value) as any),
                                            Number(event.target.value)
                                        )
                                    }
                                    inputProps={{
                                        step: 1,
                                        min: 0,
                                        max: 50,
                                        type: 'number',
                                        'aria-labelledby': 'input-slider',
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <InputLabel>Passive Ability</InputLabel>
                                <Input
                                    value={formData.passiveAbilityLevel}
                                    onChange={event =>
                                        handleInputChange(
                                            'passiveAbilityLevel',
                                            event.target.value === '' ? '' : (Number(event.target.value) as any),
                                            Number(event.target.value)
                                        )
                                    }
                                    inputProps={{
                                        step: 1,
                                        min: 0,
                                        max: 50,
                                        type: 'number',
                                        'aria-labelledby': 'input-slider',
                                    }}
                                />
                            </FormControl>
                        </Grid>
                    </Grid>

                    <CharacterUpgrades
                        character={character}
                        upgradesChanges={(upgrades, updateInventory) => {
                            characterChanges({ ...character, upgrades: upgrades }, updateInventory);
                        }}
                    />
                </React.Fragment>
            ) : undefined}
        </FormGroup>
    );
};
