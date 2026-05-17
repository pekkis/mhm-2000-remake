import type { EventEffect } from "@/game/event-effects";
import { resolvedEvent } from "@/game/events/registry";
import { teamById, teamsManager } from "@/machines/selectors";
import { attributeRoll } from "@/services/attribute-roll";
import { random } from "@/services/random";
import {
  getRandomAiTeam,
  teamHasActiveInjuryEffects
} from "@/services/random-events";
import type { DeclarativeEvent } from "@/types/event";

/*
CASE 7 TO 8
arpo 1
IF tarka(3) = 0 AND tarko(xx, 6, 20, 50) = 0 THEN
luz 3
teet 3, -10, INT(5 * RND) + 3
END IF
*/

const eventId = "ai_event_002";

type EventData = {
  teamId: number;
  duration: number;
};

export const event_002: DeclarativeEvent<EventData, {}> = {
  type: "team",

  register: () => {
    return {
      eventId,
      lotteryBalls: 2
    };
  },

  create: (context) => {
    const team = getRandomAiTeam(context);

    // tarka(3) = 0: no existing attack injury
    if (teamHasActiveInjuryEffects(team, "attack")) {
      return null;
    }

    // tarko(xx, 6, 20, 50) = 0: manager fails luck roll
    const manager = teamsManager(team.id)(context);
    if (attributeRoll(manager.attributes, "luck", 20, 50)) {
      return null;
    }

    const duration = random.integer(3, 7);

    return resolvedEvent({
      teamId: team.id,
      duration
    });
  },

  process: (data) => {
    const effects: EventEffect[] = [
      {
        type: "addTeamEffect",
        team: data.teamId,
        effect: {
          kind: "injury",
          position: "attack",
          amount: -10,
          duration: data.duration
        }
      }
    ];

    return effects;
  },

  render: (data, context) => {
    const team = teamById(data.teamId)(context);

    return [
      `**${team.name}** kärsii **työlupa-ongelmista** muutaman ulkomaalaisvahvistuksensa kohdalla! Miehet eivät pelaa, joten joukkue heikentyy hetkellisesti.`
    ];
  }
};
