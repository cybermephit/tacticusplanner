﻿import { Rarity } from 'src/models/enums';
import { ICharacter2 } from 'src/models/interfaces';

export type ZoneId =
    | 'armoury'
    | 'troopGarrison'
    | 'frontline'
    | 'supplyDepot'
    | 'artilleryPosition'
    | 'antiAirBattery'
    | 'fortifiedPosition'
    | 'voxStation'
    | 'medicaeStation'
    | 'headQuarters';

export interface IGWData {
    bfLevels: number[];
    difficulties: string[];
    rarityCaps: Record<string, string[]>;
    zones: IGWZone[];
}

export interface IGWDataRaw {
    sectionDifficulty: string[];
    rarityCaps: Record<string, string[]>;
    bfLevels: number[];
    sections: IGWSectionRaw[];
}

export interface IGWZone {
    id: string;
    name: string;
    warScore: number;
    count: number;
    rarityCaps: Record<
        number,
        {
            difficulty: string;
            caps: Rarity[];
        }
    >; // battlefield level to rarityCaps array
}

export interface IGWSectionRaw {
    id: string;
    name: string;
    warScore: number;
    count: number;
    difficulty: Record<number, string>; // battlefield level to rarityCaps array
}

export interface IGWTeam {
    id: string;
    name: string;
    type: GuildWarTeamType;
    rarityCap: Rarity;
    lineup: string[];
}

export interface IGWLayout {
    bfLevel: number;
    id: string;
    name: string;
    zones: IGWLayoutZone[];
}

export interface IGWLayoutZone {
    id: ZoneId;
    players: string[];
}

export interface IGWTeamWithCharacters extends Omit<IGWTeam, 'lineup'> {
    lineup: ICharacter2[];
}

export enum GuildWarTeamType {
    Defense = 0,
    Offense = 1,
}
