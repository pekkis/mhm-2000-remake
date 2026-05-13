export type MailMeta = {
  created: {
    season: number;
    turn: number;
    phase: string;
  };
  expires?: {
    season: number;
    turn: number;
    phase: string;
  };
};

export type ManagerMailRecipient = {
  kind: "manager";
  recipient: string;
};

export type TeamMailRecipient = {
  kind: "team";
  recipient: number;
};

export type ExternalRecipient = {
  kind: "external";
  recipient: string;
};

export type MailAnswerOption = {
  key: string;
  label: string;
};

export type MailRecipient =
  | ManagerMailRecipient
  | TeamMailRecipient
  | ExternalRecipient;

type BaseMail = {
  id: string;
  meta: MailMeta;
  from: MailRecipient;
  to: MailRecipient;
  subject: string;
  body: string[];
  data: unknown;
};

export type RegularMail = BaseMail & {
  kind: "regular";
};

export type RsvpMail = BaseMail & {
  kind: "rsvp";
  answerOptions: MailAnswerOption[];
};

export type Mail = RegularMail | RsvpMail;
