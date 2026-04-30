export type Invitation = {
  id: string;
  manager: string;
  tournament: number;
  accepted: boolean;
};

export type InvitationState = {
  invitations: Invitation[];
};
