import type { EventEffect } from "@/game/event-effects";
import { getManagerFiredBlurb } from "@/game/events/helpers/manager-fired";
import { resolvedEvent } from "@/game/events/registry";
import { managerById, teamById, teamsManager } from "@/machines/selectors";
import { attributeRoll } from "@/services/attribute-roll";
import { random } from "@/services/random";
import { getRandomAITeamWithNoEffects } from "@/services/random-events";
import type { DeclarativeEvent } from "@/types/event";

/*
CASE 1 TO 6
arpo 2
IF tarko(xx, 1, 20, 50) = 1 THEN
luz 1
taut 1.1, INT(6 * RND) + 6
ELSE
luz 2
taut .9, INT(6 * RND) + 6
IF tarko(xx, 5, 20, 50) = 0 THEN potk xx
END IF
*/

/*
arpo and arpol: src/services/random-events.ts
tarko: src/services/attribute-roll.ts
taut and teet: src/state/game.ts, TeamGlobalEffect and TeamInjuryEffect
luz: src/mhm2000-qb/_NOTES/DATA-FILES.md, extract to render()
*/

const eventId = "ai_event_001";

type EventData =
  | {
      teamId: number;
      managerId: string;
      success: true;
      duration: number;
    }
  | {
      teamId: number;
      managerId: string;
      success: false;
      isFired: boolean;
      duration: number;
    };

export const event_001: DeclarativeEvent<EventData, {}> = {
  type: "team",

  register: () => {
    return {
      eventId,
      lotteryBalls: 6
    };
  },

  create: (context) => {
    const team = getRandomAITeamWithNoEffects(context);
    const manager = teamsManager(team.id)(context);

    const duration = random.integer(6, 11);
    const success = attributeRoll(manager.attributes, "strategy", 20, 50);

    if (success) {
      return resolvedEvent({
        success: true,
        managerId: manager.id,
        teamId: team.id,
        duration
      });
    }

    const isFired = !attributeRoll(manager.attributes, "charisma", 20, 50);

    return resolvedEvent({
      success: false,
      duration,
      managerId: manager.id,
      teamId: team.id,
      isFired
    });
  },

  process: (data) => {
    if (data.success) {
      return [
        {
          type: "addTeamEffect",
          team: data.teamId,
          effect: {
            kind: "global",
            multiplier: 1.1,
            duration: data.duration
          }
        }
      ];
    }

    const effects: EventEffect[] = [
      {
        type: "addTeamEffect",
        team: data.teamId,
        effect: {
          kind: "global",
          multiplier: 0.9,
          duration: data.duration
        }
      }
    ];

    if (data.isFired) {
      effects.push({
        type: "fireManager",
        team: data.teamId
      });
    }

    return effects;
  },

  render: (data, context) => {
    const manager = managerById(data.managerId)(context);
    const team = teamById(data.teamId)(context);

    if (data.success) {
      return [
        `**${manager.name} (${team.name})** on lanseerannut onnistuneesti uudenlaisen valmennusstrategian, niinsanotun **ABCD-ohjelman**. Pelaajien omaksuttua tämän tiukan, mutta palkitsevan menetelmän, alkavat tuloksetkin viimein näkyä. Manageri hymyilee muikeasti kertoessaan menestyksestään Urheiluruutun haastattelussa.`
      ];
    }

    const currentManager = teamsManager(data.teamId)(context);

    const lines = [
      `**${manager.name} (${team.name})** on epäonnistunut uuden valmennusmenetelmänsä, niinkutsutun **ABCD-Ohjelman** kanssa totaalisesti! Fläppitauluja on kulunut, mutta koukerot eivät ole painuneet pelaajien mieliin. Yhteispeli on lamaantunut totaalisesti.`
    ];

    if (data.isFired) {
      lines.push(
        getManagerFiredBlurb({
          current: currentManager,
          team,
          fired: manager
        })
      );
    }

    return lines;
  }
};
