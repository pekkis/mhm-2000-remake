import { nhlChallengeMailHandler } from "@/data/mail/nhl-challenge";
import type { GameContext } from "@/state";
import type { Mail } from "@/state/mail";
import type { Draft } from "immer";
import { entries, values } from "remeda";

export type MailHandler = (ctx: Draft<GameContext>) => void;

export const mailHandlers: MailHandler[] = [nhlChallengeMailHandler];

const isExpired = (mail: Mail, season: number, round: number): boolean => {
  const exp = mail.meta.expires;
  if (!exp) {
    return false;
  }
  if (exp.season < season) {
    return true;
  }
  return exp.season === season && exp.round <= round;
};

const purgeExpired = (
  mailbox: Record<string, Mail>,
  season: number,
  round: number
) => {
  for (const [id, mail] of entries(mailbox)) {
    if (isExpired(mail, season, round)) {
      delete mailbox[id];
    }
  }
};

export const expireMails = (ctx: Draft<GameContext>) => {
  const { season, round } = ctx.turn;

  purgeExpired(ctx.mail.mailbox, season, round);

  for (const manager of values(ctx.managers)) {
    purgeExpired(manager.mailbox, season, round);
  }

  for (const team of ctx.teams) {
    purgeExpired(team.mailbox, season, round);
  }
};
