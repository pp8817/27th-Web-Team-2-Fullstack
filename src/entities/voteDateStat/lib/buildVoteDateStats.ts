import { type Participant } from '@/entities/meeting/dto/meet.dto';
import { type VoteDateStat } from '@/entities/voteDateStat/dto/voteDateStat.dto';

export function buildVoteDateStats(
  candidateDates: string[],
  participants: Participant[],
): VoteDateStat[] {
  const votedParticipants = participants.filter((participant) => {
    return participant.hasVoted;
  });

  return candidateDates.map((date) => {
    const can = votedParticipants
      .filter((participant) => {
        return participant.voteDates.includes(date);
      })
      .map((participant) => {
        return { id: String(participant.id), name: participant.name };
      });

    const cannot = votedParticipants
      .filter((participant) => {
        return !participant.voteDates.includes(date);
      })
      .map((participant) => {
        return { id: String(participant.id), name: participant.name };
      });

    return {
      date,
      can,
      cannot,
    };
  });
}
