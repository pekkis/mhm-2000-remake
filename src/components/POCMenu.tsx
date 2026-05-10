import Heading from "@/components/ui/Heading";
import Stack from "@/components/ui/Stack";
import { useGameContext } from "@/context/game-machine-context";
import { sponsorNegotiationMachine } from "@/machines/sponsorNegotiation";
import type { CandidateState } from "@/machines/sponsorNegotiation";
import { activeManager, managersTeam } from "@/machines/selectors";
import {
  sponsorPayoutSlots,
  sponsorSlotLabel,
  goalCategoryLabel,
  goalLevelLabels,
  negotiationActionLabels
} from "@/data/mhm2000/sponsors";
import type { GoalCategoryId, GoalLevel } from "@/data/mhm2000/sponsors";
import random from "@/services/random";
import { useMachine } from "@xstate/react";
import StickyMenu from "./StickyMenu";
import AdvancedHeaderedPage from "@/components/page/AdvancedHeaderedPage";
import Button from "@/components/ui/Button";
import Cluster from "@/components/ui/Cluster";
import type { HumanTeam } from "@/state/game";

const CandidateCard: React.FC<{
  candidate: CandidateState;
  index: number;
  isActive: boolean;
  onSelect: () => void;
}> = ({ candidate, index, isActive, onSelect }) => (
  <div
    onClick={onSelect}
    style={{
      border: isActive ? "2px solid yellow" : "1px solid #555",
      padding: "8px",
      opacity: candidate.walked ? 0.4 : 1,
      cursor: "pointer"
    }}
  >
    <strong>
      {index + 1}. {candidate.name}
    </strong>
    {candidate.walked && " (POISTUNUT)"}
    {!candidate.walked && candidate.haggleCount > 0 && (
      <span> — {candidate.haggleCount}× neuvoteltu</span>
    )}
  </div>
);

const POCMenu = () => {
  const manager = useGameContext(activeManager);
  const team = useGameContext(managersTeam(manager.id)) as HumanTeam;
  const competitions = useGameContext((ctx) => ctx.competitions);

  const [state, send] = useMachine(sponsorNegotiationMachine, {
    input: {
      manager,
      team,
      competitions,
      random
    }
  });

  const { candidates, activeCandidateIndex, categories } = state.context;
  const active = candidates[activeCandidateIndex];
  const walkedCount = candidates.filter((c) => c.walked).length;
  const canHaggle = !active.walked && walkedCount < 2;
  const canAccept = !active.walked;
  const canSetGoals = active.haggleCount === 0 && !active.walked;
  const isDone = state.matches("done");

  if (isDone) {
    const deal = state.output!.deal;
    return (
      <AdvancedHeaderedPage escTo="/" stickyMenu={<StickyMenu back />}>
        <Stack gap="lg">
          <Heading level={2}>Sponsorisopimus tehty</Heading>
          {deal.name ? (
            <Stack gap="sm">
              <Heading level={3}>{deal.name}</Heading>
              {sponsorPayoutSlots
                .filter((s) => deal.payouts[s] !== 0)
                .map((slot) => (
                  <div key={slot}>
                    {sponsorSlotLabel[slot]}:{" "}
                    {deal.payouts[slot].toLocaleString("fi-FI")} mk
                  </div>
                ))}
            </Stack>
          ) : (
            <div>Kaikki sponsorit poistuivat. Ei sopimusta.</div>
          )}
        </Stack>
      </AdvancedHeaderedPage>
    );
  }

  return (
    <AdvancedHeaderedPage escTo="/" stickyMenu={<StickyMenu back />}>
      <Stack gap="lg">
        <Heading level={2}>Sponsorineuvottelut</Heading>

        <Cluster>
          {candidates.map((c, i) => (
            <CandidateCard
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

        {canSetGoals && (
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
                        disabled={!canSetGoals}
                        onClick={() =>
                          send({
                            type: "SET_GOAL",
                            category: cat.id as GoalCategoryId,
                            level
                          })
                        }
                        style={{
                          fontWeight: isSelected ? "bold" : "normal",
                          opacity: isSelected ? 1 : 0.6
                        }}
                      >
                        {label}
                      </Button>
                    );
                  })}
                </Cluster>
              ))}
          </Stack>
        )}

        <Stack gap="sm">
          <Heading level={3}>Tarjous: {active.name}</Heading>
          {sponsorPayoutSlots
            .filter((s) => active.payouts[s] !== 0)
            .map((slot) => (
              <div
                key={slot}
                style={{ color: active.payouts[slot] < 0 ? "red" : "inherit" }}
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
          <div style={{ color: "yellow" }}>
            Kaksi sponsoria on poistunut. Sinun on hyväksyttävä jäljellä oleva.
          </div>
        )}
      </Stack>
    </AdvancedHeaderedPage>
  );
};

export default POCMenu;
