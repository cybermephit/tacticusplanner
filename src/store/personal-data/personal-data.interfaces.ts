﻿export interface IPersonalData {
    viewPreferences: IViewPreferences;
    characters: IPersonalCharacterData[];
}

export interface IViewPreferences {
    onlyUnlocked: boolean;
    fitToScreen: boolean;
    usedInCampaigns: boolean;
}

export interface IPersonalCharacterData {
    name: string;
    unlocked?: boolean;
    rank: Rank;
    lePoints?: number;
}

export enum Rank {
    Undefined,
    Stone1,
    Stone2,
    Stone3,
    Iron1,
    Iron2,
    Iron3,
    Bronze1,
    Bronze2,
    Bronze3,
    Silver1,
    Silver2,
    Silver3,
    Gold1,
    Gold2,
    Gold3,
    Diamond1,
    Diamond2,
    Diamond3,
}