﻿import React, { useMemo } from 'react';
import { ICharacter2 } from '../models/interfaces';
import { CharacterBias, Rank, Rarity } from '../models/enums';
import { pooEmoji, starEmoji } from '../models/constants';
import { RarityImage } from './rarity-image';
import { RankImage } from './rank-image';
import { CharacterImage } from './character-image';
import { Badge, Tooltip } from '@mui/material';
import { StarsImage } from './stars-image';
import './character-title.css';

export const CharacterTitle = ({
    character,
    showLockedWithOpacity,
    wyo,
    onClick,
    short,
    imageSize,
}: {
    character: ICharacter2;
    showLockedWithOpacity?: boolean;
    wyo?: boolean;
    onClick?: () => void;
    short?: boolean;
    imageSize?: number;
}) => {
    const isUnlocked = character.rank > Rank.Locked;
    const hasAbilities = (isUnlocked && character.activeAbilityLevel) || character.passiveAbilityLevel;
    const emoji =
        character.bias === CharacterBias.AlwaysRecommend
            ? starEmoji
            : character.bias === CharacterBias.NeverRecommend
            ? pooEmoji
            : '';
    const opacity = showLockedWithOpacity ? (isUnlocked ? 1 : 0.5) : 1;
    const cursor = onClick ? 'pointer' : undefined;

    const needToAscend = useMemo(() => {
        const maxCommon = character.rarity === Rarity.Common && character.rank === Rank.Iron1;
        const maxUncommon = character.rarity === Rarity.Uncommon && character.rank === Rank.Bronze1;
        const maxRare = character.rarity === Rarity.Rare && character.rank === Rank.Silver1;
        const maxEpic = character.rarity === Rarity.Epic && character.rank === Rank.Gold1;
        return maxCommon || maxUncommon || maxRare || maxEpic;
    }, []);

    const characterFull = (
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', opacity, cursor }} onClick={onClick}>
            <CharacterImage key={character.name} icon={character.icon} name={character.name} imageSize={imageSize} />
            <span>{character.name}</span>
            <RarityImage rarity={character.rarity} />
            {isUnlocked ? <RankImage key={character.rank} rank={character.rank} /> : undefined}
            <Tooltip
                placement="top"
                title={
                    character.bias === CharacterBias.AlwaysRecommend
                        ? 'Always recommend first'
                        : character.bias === CharacterBias.NeverRecommend
                        ? 'Always recommend last'
                        : ''
                }>
                <span>{emoji}</span>
            </Tooltip>
        </div>
    );

    const characterShort = (
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', opacity, cursor }} onClick={onClick}>
            <Tooltip title={character.name} leaveDelay={1000} placement="top">
                <span style={{ height: imageSize }}>
                    <CharacterImage
                        key={character.name}
                        icon={character.icon}
                        name={character.name}
                        imageSize={imageSize}
                    />
                </span>
            </Tooltip>
            <span>{character.name}</span>
        </div>
    );

    const characterWYO = (
        <div style={{ display: 'flex', gap: 5, alignItems: 'center', opacity, cursor }} onClick={onClick}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 75 }}>
                <StarsImage stars={character.stars} />
                <div>
                    <Badge
                        badgeContent={needToAscend ? '⇧' : character.upgrades.length}
                        color={needToAscend ? 'warning' : 'success'}>
                        <CharacterImage
                            key={character.name}
                            icon={character.icon}
                            name={character.name}
                            imageSize={imageSize}
                            portrait={true}
                        />
                    </Badge>

                    <div className="abilities" style={{ visibility: hasAbilities ? 'visible' : 'hidden' }}>
                        <div className="ability-level">{character.activeAbilityLevel}</div>
                        <div className="ability-level">{character.passiveAbilityLevel}</div>
                    </div>
                    <div
                        className="character-level"
                        style={{ visibility: isUnlocked && character.level > 0 ? 'visible' : 'hidden' }}>
                        {character.level}
                    </div>
                </div>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: isUnlocked ? 'space-between' : 'center',
                        marginTop: -15,
                    }}>
                    <RarityImage rarity={character.rarity} />
                    {isUnlocked ? <RankImage key={character.rank} rank={character.rank} /> : undefined}
                </div>
            </div>
        </div>
    );

    if (wyo) {
        return characterWYO;
    }

    return short ? characterShort : characterFull;
};
