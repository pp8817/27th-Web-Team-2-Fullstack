export type Participant = {
  id: string;
  name: string;
};

export type VoteDateStat = {
  date: string;
  can: Participant[];
  cannot: Participant[];
};

export type VoteResultsProps = {
  openRange: {
    start: string;
    end: string;
  };
  stats: VoteDateStat[];
};
