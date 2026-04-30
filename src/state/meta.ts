export type MetaManager = {
  name: string;
  arena: string;
  difficulty: string;
  team: number;
};

export type MetaState = {
  started: boolean;
  loading: boolean;
  saving: boolean;
  starting: boolean;
  manager: MetaManager;
};
