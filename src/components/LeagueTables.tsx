import { useState } from "react";
import { values } from "remeda";
import StickyMenu from "./StickyMenu";
import AdvancedHeaderedPage from "@/components/page/AdvancedHeaderedPage";
import Heading from "@/components/ui/Heading";
import Stack from "@/components/ui/Stack";
import Tabs, { type TabItem } from "@/components/ui/Tabs";
import LeagueTable from "@/components/league-table/LeagueTable";
import { useGameContext } from "@/context/game-machine-context";
import ManagerInfo from "@/components/ManagerInfo";
import { humanManagers } from "@/machines/selectors";

const LeagueTables = () => {
  const managers = useGameContext(humanManagers);
  const teams = useGameContext((ctx) => ctx.teams);
  const competitions = useGameContext((ctx) => ctx.competitions);

  const [tab, setTab] = useState(0);

  const items: TabItem[] = values(competitions)
    .filter((c) => c.phase >= 0)
    .map((c) => {
      const groups = c.phases[0].groups;
      return {
        title: c.name,
        content: () => (
          <Stack gap="md">
            {groups.map((group, i) => (
              <Stack key={i} gap="sm">
                {<Heading level={3}>{group.name}</Heading>}
                <LeagueTable
                  division={group}
                  managers={managers}
                  teams={teams}
                />
              </Stack>
            ))}
          </Stack>
        )
      };
    });

  return (
    <AdvancedHeaderedPage
      escTo="/"
      stickyMenu={<StickyMenu back />}
      managerInfo={<ManagerInfo details />}
    >
      <Stack gap="lg">
        <Heading level={2}>Sarjataulukot</Heading>
        <Tabs items={items} selected={tab} onSelect={setTab} />
      </Stack>
    </AdvancedHeaderedPage>
  );
};

export default LeagueTables;
