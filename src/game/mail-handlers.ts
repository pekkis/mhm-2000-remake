import { nhlChallengeMailHandler } from "@/data/mail/nhl-challenge";
import type { GameContext } from "@/state";
import type { Mail } from "@/state/mail";
import type { Draft } from "immer";
import { values } from "remeda";

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

export const expireMails = (ctx: Draft<GameContext>) => {
  const { season, round } = ctx.turn;

  const keep = (m: Mail) => !isExpired(m, season, round);

  ctx.mail.mailbox = ctx.mail.mailbox.filter(keep);

  for (const manager of values(ctx.managers)) {
    manager.mailbox = manager.mailbox.filter(keep);
  }

  for (const team of ctx.teams) {
    team.mailbox = team.mailbox.filter(keep);
  }
};
