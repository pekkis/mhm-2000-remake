import { useSelector } from "@xstate/react";
import type { AnyActorRef } from "xstate";
import type { SponsorNegotiationContext } from "@/machines/sponsorNegotiation";
import type { CandidateState } from "@/machines/sponsorNegotiation";
import { GameMachineContext } from "@/context/game-machine-context";
import PageLayout from "@/components/page/PageLayout";
import ManagerInfo from "@/components/ManagerInfo";
import Heading from "@/components/ui/Heading";
import Button from "@/components/ui/Button";
import Stack from "@/components/ui/Stack";
import Cluster from "@/components/ui/Cluster";
import {
  sponsorPayoutSlots,
  sponsorSlotLabel,
  goalCategoryLabel,
  goalLevelLabels,
  negotiationActionLabels
} from "@/data/mhm2000/sponsors";
import type { GoalCategoryId, GoalLevel } from "@/data/mhm2000/sponsors";
import { payoutPulse, haggleShake } from "./SponsorNegotiationView.css";

const CandidateTab: React.FC<{
  candidate: CandidateState;
  index: number;
  isActive: boolean;
  onSelect: () => void;
}> = ({ candidate, index, isActive, onSelect }) => (
  <Button
    onClick={onSelect}
    secondary={!isActive}
    disabled={candidate.walked}
    className={
      candidate.lastHaggleResult === "failure" ? haggleShake : undefined
    }
  >
    {index + 1}. {candidate.name}
    {candidate.walked && " (POISTUNUT)"}
  </Button>
);

const SponsorNegotiationView = () => {
  const gameActor = GameMachineContext.useActorRef();
  const negotiationActor = gameActor.system.get(
    "sponsorNegotiation"
  ) as AnyActorRef;

  const snap = useSelector(
    negotiationActor,
    (s: { value: unknown; context: SponsorNegotiationContext }) => s
  );

  const { candidates, activeCandidateIndex, categories } = snap.context;
  const active = candidates[activeCandidateIndex];
  const walkedCount = candidates.filter((c) => c.walked).length;
  const canHaggle = !active.walked && walkedCount < 2;
  const canAccept = !active.walked;
  const canSetGoals = active.haggleCount === 0 && !active.walked;

  const send = (event: Parameters<typeof negotiationActor.send>[0]) =>
    negotiationActor.send(event);

  return (
    <PageLayout managerInfo={<ManagerInfo details />}>
      <Stack gap="lg">
        <Heading level={2}>Sponsorineuvottelut</Heading>

        <Cluster>
          {candidates.map((c, i) => (
            <CandidateTab
              key={i}
              candidate={c}
              index={i}
              isActive={i === activeCandidateIndex}
              onSelect={() =>
                send({ type: "SELECT_CANDIDATE", index: i as 0 | 1 | 2 })
              }
            />
          ))}
        </Cluster>

        <Stack gap="sm">
          <Heading level={3}>Tavoitteet</Heading>
          {categories
            .filter((cat) => cat.maxLevel > 0)
            .map((cat) => (
              <Cluster key={cat.id}>
                <strong>{goalCategoryLabel[cat.id]}:</strong>
                {goalLevelLabels[cat.id].map((label, idx) => {
                  const level = (idx + 1) as GoalLevel;
                  if (level > cat.maxLevel) {
                    return null;
                  }
                  const isSelected = active.goals[cat.id] === level;
                  return (
                    <Button
                      key={level}
                      disabled={!canSetGoals && !isSelected}
                      secondary={!isSelected}
                      onClick={() =>
                        send({
                          type: "SET_GOAL",
                          category: cat.id as GoalCategoryId,
                          level
                        })
                      }
                    >
                      {label}
                    </Button>
                  );
                })}
              </Cluster>
            ))}
        </Stack>

        <Stack
          gap="sm"
          key={`${activeCandidateIndex}-${active.haggleCount}-${active.walked}`}
        >
          <Heading
            level={3}
            className={
              active.lastHaggleResult === "failure" ? haggleShake : undefined
            }
          >
            Tarjous: {active.name}
            {active.walked && " — neuvottelu päättyi"}
          </Heading>
          {sponsorPayoutSlots
            .filter((s) => active.payouts[s] !== 0)
            .map((slot) => (
              <div
                key={slot}
                className={
                  active.lastHaggleResult === "success"
                    ? payoutPulse
                    : undefined
                }
              >
                {sponsorSlotLabel[slot]}:{" "}
                {active.payouts[slot].toLocaleString("fi-FI")} mk
              </div>
            ))}
        </Stack>

        <Cluster>
          <Button
            disabled={!canHaggle}
            onClick={() => send({ type: "HAGGLE" })}
          >
            {negotiationActionLabels.haggle}
          </Button>
          <Button
            disabled={!canAccept}
            onClick={() => send({ type: "ACCEPT" })}
          >
            {negotiationActionLabels.accept}
          </Button>
        </Cluster>

        {walkedCount === 2 && (
          <Heading level={4}>
            Kaksi sponsoria on poistunut. Sinun on hyväksyttävä jäljellä oleva.
          </Heading>
        )}
      </Stack>
    </PageLayout>
  );
};

export default SponsorNegotiationView;
