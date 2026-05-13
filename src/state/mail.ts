export type MailDate = {
  season: number;
  round: number;
};

export type MailMeta = {
  created: MailDate;
  expires?: MailDate;
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
  recipientId: string;
  recipientName: string;
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
  read: boolean;
  replied: boolean;
  data?: unknown;
};

export type RegularMail = BaseMail & {
  kind: "regular";
};

export type RsvpMail = BaseMail & {
  kind: "rsvp";
  answerOptions: MailAnswerOption[];
};

export type Mail = RegularMail | RsvpMail;

type RsvpMailTemplate = Omit<RsvpMail, "to" | "id" | "meta" | "read" | "replied">;
type RegularMailTemplate = Omit<RegularMail, "to" | "id" | "meta" | "read" | "replied">;

export type MailTemplate = RsvpMailTemplate | RegularMailTemplate;
