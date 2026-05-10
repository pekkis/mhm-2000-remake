import { useState } from "react";
import { keys } from "remeda";

import {
  budgetCategoryMap,
  budgetCostPerRound,
  totalBudgetPerRound
} from "@/data/mhm2000/budget";
import type {
  BudgetCategoryId,
  BudgetCategoryName,
  BudgetLevel,
  TeamBudget
} from "@/data/mhm2000/budget";
import { difficultyLevelById } from "@/data/mhm2000/difficulty-levels";
import type { DifficultyLevelId } from "@/data/mhm2000/difficulty-levels";
import { activeManager, activeManagersTeam } from "@/machines/selectors";
import { GameMachineContext } from "@/context/game-machine-context";
import Button from "./ui/Button";
import Heading from "./ui/Heading";
import Markdown from "./Markdown";
import Stack from "./ui/Stack";
import AdvancedHeaderedPage from "@/components/page/AdvancedHeaderedPage";
import ManagerInfo from "@/components/ManagerInfo";

const levelLabels: readonly string[] = ["1", "2", "3", "4", "5"];

const ConfirmBudget = () => {
  const manager = GameMachineContext.useSelector((state) =>
    activeManager(state.context)
  );
  const team = GameMachineContext.useSelector((state) =>
    activeManagersTeam(state.context)
  );
  const actor = GameMachineContext.useActorRef();

  const initialBudget = team.budget ?? {
    coaching: 1 as BudgetLevel,
    goalieCoaching: 1 as BudgetLevel,
    juniors: 1 as BudgetLevel,
    health: 1 as BudgetLevel,
    benefits: 1 as BudgetLevel
  };

  const [budget, setBudget] = useState<TeamBudget>(initialBudget);

  const budgetTier = difficultyLevelById(
    manager.difficulty as DifficultyLevelId
  ).budgetTier;
  const rosterSize = team.kind === "human" ? keys(team.players).length : 25;

  const categoryOrder: readonly BudgetCategoryName[] = [
    "coaching",
    "goalieCoaching",
    "juniors",
    "health",
    "benefits"
  ];

  const levels: [
    BudgetLevel,
    BudgetLevel,
    BudgetLevel,
    BudgetLevel,
    BudgetLevel
  ] = categoryOrder.map((name) => budget[name]) as [
    BudgetLevel,
    BudgetLevel,
    BudgetLevel,
    BudgetLevel,
    BudgetLevel
  ];

  const total = totalBudgetPerRound(budgetTier, levels, rosterSize);

  return (
    <AdvancedHeaderedPage managerInfo={<ManagerInfo details />}>
      <Heading level={2}>Budjetointi</Heading>

      <Stack>
        {categoryOrder.map((name) => {
          const cat = budgetCategoryMap[name];
          const level = budget[name];
          const cost = budgetCostPerRound(
            budgetTier,
            cat.id as BudgetCategoryId,
            level,
            rosterSize
          );

          return (
            <Stack key={name} gap="sm">
              <Heading level={3}>{cat.name}</Heading>
              <Markdown>{cat.descriptions[level - 1]}</Markdown>

              <div
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                {levelLabels.map((label, idx) => {
                  const l = (idx + 1) as BudgetLevel;
                  return (
                    <Button
                      key={l}
                      terse
                      secondary={l !== level}
                      onClick={() =>
                        setBudget((prev) => ({ ...prev, [name]: l }))
                      }
                    >
                      {label}
                    </Button>
                  );
                })}
                <span style={{ marginInlineStart: "auto" }}>
                  {cost} {cat.perPlayer ? "/P/KR" : "/KR"}
                </span>
              </div>
            </Stack>
          );
        })}

        <Stack gap="sm">
          <Heading level={3}>
            Budjettikustannukset yhteensä: {total} /KR
          </Heading>

          <Button
            block
            onClick={() =>
              actor.send({
                type: "CONFIRM_BUDGET",
                payload: {
                  manager: manager.id,
                  budget
                }
              })
            }
          >
            Vahvista budjetti
          </Button>
        </Stack>
      </Stack>
    </AdvancedHeaderedPage>
  );
};

export default ConfirmBudget;
