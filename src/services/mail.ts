import { createUniqueId } from "@/services/id";
import type { GameContext } from "@/state";
import type { Mail, MailDate, MailRecipient, MailTemplate } from "@/state/mail";
import type { Draft } from "immer";

type MailOptions = {
  expires?: MailDate;
};

const resolveRecipientName = (
  ctx: GameContext,
  recipient: MailRecipient
): string => {
  switch (recipient.kind) {
    case "manager":
      return ctx.managers[recipient.recipient].name;
    case "team":
      return ctx.teams[recipient.recipient].name;
    case "external":
      return recipient.recipientName;
  }
};

const resolveMailVars = (
  ctx: GameContext,
  mail: Mail
): Record<string, string> => ({
  recipient: resolveRecipientName(ctx, mail.to),
  sender: resolveRecipientName(ctx, mail.from)
});

const interpolate = (template: string, vars: Record<string, string>): string =>
  template.replace(/\{(\w+)\}/g, (_, key) => vars[key] ?? `{${key}}`);

export const createReceiveMail = (ctx: GameContext) => {
  const renderBody = (mail: Mail): string[] => {
    const vars = resolveMailVars(ctx, mail);
    return mail.body.map((line) => interpolate(line, vars));
  };

  const renderSubject = (mail: Mail): string => {
    const vars = resolveMailVars(ctx, mail);
    return interpolate(mail.subject, vars);
  };

  const renderSender = (mail: Mail): string =>
    resolveRecipientName(ctx, mail.from);

  return { renderBody, renderSubject, renderSender };
};

export const createSendMail = (ctx: Draft<GameContext>) => {
  const sendMail = (
    mailTpl: MailTemplate,
    to: MailRecipient,
    options?: MailOptions
  ) => {
    const id = createUniqueId();

    const created: MailDate = {
      season: ctx.turn.season,
      round: ctx.turn.round
    };

    const mail = {
      ...mailTpl,
      meta: {
        created,
        expires: options?.expires
      },
      id,
      to,
      read: false,
      replied: false
    } as Mail;

    if (to.kind === "external") {
      ctx.mail.mailbox.push(mail);
    }

    if (to.kind === "manager") {
      ctx.managers[to.recipient].mailbox.push(mail);
    }

    if (to.kind === "team") {
      ctx.teams[to.recipient].mailbox.push(mail);
    }
  };

  const expiresInRounds = (rounds: number) => {
    // TODO: survive the season roll properly.

    const expireTurn: MailDate = {
      season: ctx.turn.season,
      round: ctx.turn.round + rounds
    };

    return expireTurn;
  };

  return {
    sendMail,
    expiresInRounds
  };
};
