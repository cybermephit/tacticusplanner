﻿import { IGuildWar, SetStateAction } from '../models/interfaces';
import { defaultData } from '../models/constants';
import { Rarity } from 'src/models/enums';
import { GuildWarTeamType } from 'src/v2/features/guild-war/guild-war.models';

export type GuildWarAction =
    | {
          type: 'UpdateTeam';
          teamId: string;
          lineup: string[];
          rarityCap: Rarity;
          teamName?: string;
      }
    | {
          type: 'UpdateDefenseRarityCaps';
          rarityCaps: Rarity[];
      }
    | {
          type: 'ClearTeamLineup';
          teamId: string;
      }
    | {
          type: 'UpdateZoneDifficulty';
          zoneDifficulty: number;
      }
    | {
          type: 'DeployCharacter';
          character: string;
      }
    | {
          type: 'WithdrawCharacter';
          character: string;
      }
    | {
          type: 'ClearDeployedCharacters';
      }
    | {
          type: 'UpdateLayoutBfLevel';
          layoutId: string;
          bfLevel: number;
      }
    | {
          type: 'SwapLayoutZones';
          layoutId: string;
          zone1Index: number;
          zone2Index: number;
      }
    | SetStateAction<IGuildWar>;

export const guildWarReducer = (state: IGuildWar, action: GuildWarAction): IGuildWar => {
    switch (action.type) {
        case 'Set': {
            return action.value ?? defaultData.guildWar;
        }
        case 'UpdateTeam': {
            const { teamId, lineup, rarityCap, teamName } = action;
            const existingTeamIndex = state.teams.findIndex(x => x.id === teamId);

            if (existingTeamIndex >= 0) {
                state.teams[existingTeamIndex].lineup = lineup;
                state.teams[existingTeamIndex].rarityCap = rarityCap;
                if (teamName) {
                    state.teams[existingTeamIndex].name = teamName.slice(0, 25);
                }
                const sameCharacterTeams = state.teams.filter(
                    x =>
                        x.id !== teamId &&
                        x.type === state.teams[existingTeamIndex].type &&
                        x.lineup.some(character => lineup.includes(character))
                );
                if (sameCharacterTeams.length) {
                    for (const team of sameCharacterTeams) {
                        team.lineup = team.lineup.filter(character => !lineup.includes(character));
                    }
                }
                return {
                    ...state,
                    teams: [...state.teams],
                };
            }

            return state;
        }
        case 'UpdateDefenseRarityCaps': {
            const { rarityCaps } = action;
            const defenseTeams = state.teams.filter(x => x.type === GuildWarTeamType.Defense);

            defenseTeams.forEach((team, index) => {
                team.rarityCap = rarityCaps[index] ?? Rarity.Legendary;
            });

            return { ...state, teams: [...state.teams] };
        }
        case 'ClearTeamLineup': {
            const { teamId } = action;
            const existingTeamIndex = state.teams.findIndex(x => x.id === teamId);

            if (existingTeamIndex >= 0) {
                state.teams[existingTeamIndex].lineup = [];
                return {
                    ...state,
                    teams: [...state.teams],
                };
            }

            return state;
        }
        case 'UpdateZoneDifficulty': {
            const { zoneDifficulty } = action;

            return {
                ...state,
                zoneDifficulty,
            };
        }
        case 'UpdateLayoutBfLevel': {
            const { layoutId, bfLevel } = action;
            const existingLayoutIndex = state.layouts.findIndex(x => x.id === layoutId);

            if (existingLayoutIndex >= 0) {
                state.layouts[existingLayoutIndex].bfLevel = bfLevel;
                return {
                    ...state,
                    layouts: [...state.layouts],
                };
            }

            return state;
        }
        case 'SwapLayoutZones': {
            const { layoutId, zone1Index, zone2Index } = action;
            const existingLayoutIndex = state.layouts.findIndex(x => x.id === layoutId);

            if (existingLayoutIndex >= 0) {
                const layout = state.layouts[existingLayoutIndex];
                const zone1 = layout.zones[zone1Index];
                const zone2 = layout.zones[zone2Index];

                layout.zones[zone1Index] = zone2;
                layout.zones[zone2Index] = zone1;

                return {
                    ...state,
                    layouts: [...state.layouts],
                };
            }

            return state;
        }
        case 'DeployCharacter': {
            const { character } = action;

            if (state.deployedCharacters.includes(character)) {
                return state;
            }

            return {
                ...state,
                deployedCharacters: [...state.deployedCharacters, character],
            };
        }
        case 'WithdrawCharacter': {
            const { character } = action;

            if (!state.deployedCharacters.includes(character)) {
                return state;
            }

            return {
                ...state,
                deployedCharacters: state.deployedCharacters.filter(x => x !== character),
            };
        }
        case 'ClearDeployedCharacters': {
            return {
                ...state,
                deployedCharacters: [],
            };
        }

        default: {
            throw new Error();
        }
    }
};
