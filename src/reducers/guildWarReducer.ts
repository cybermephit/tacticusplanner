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
          type: 'UpdateBfLevel';
          battlefieldLevel: number;
      }
    | {
          type: 'UpdateBfSection';
          sectionId: string;
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
        case 'UpdateBfLevel': {
            const { battlefieldLevel } = action;

            return {
                ...state,
                battlefieldLevel,
            };
        }
        case 'UpdateBfSection': {
            const { sectionId } = action;

            return {
                ...state,
                sectionId,
            };
        }
        default: {
            throw new Error();
        }
    }
};
