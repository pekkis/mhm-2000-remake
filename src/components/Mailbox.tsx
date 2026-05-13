import { useState, useMemo, type FC } from "react";
import { useGameContext } from "@/context/game-machine-context";
import { activeManager } from "@/machines/selectors";
import { createReceiveMail } from "@/services/mail";
import { Table, Th, Td } from "@/components/ui/Table";
import Stack from "@/components/ui/Stack";
import Heading from "@/components/ui/Heading";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Markdown from "@/components/Markdown";
import type { Mail } from "@/state/mail";
import clsx from "clsx";
import * as styles from "./Mailbox.css";

const formatDate = (mail: Mail): string =>
  `Kausi ${mail.meta.created.season}, kierros ${mail.meta.created.round}`;

const Mailbox: FC = () => {
  const manager = useGameContext(activeManager);
  const ctx = useGameContext((c) => c);
  const mails = manager.mailbox;

  const { renderSubject, renderBody, renderSender } = useMemo(
    () => createReceiveMail(ctx),
    [ctx]
  );

  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
  const selectedMail = mails.find((m) => m.id === selectedId);

  return (
    <Stack gap="md">
      <Heading level={3}>Postilaatikko</Heading>

      {mails.length === 0 ? (
        <p>Ei postia.</p>
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>Lähettäjä</Th>
              <Th>Aihe</Th>
              <Th>Pvm</Th>
              <Th align="center">Tyyppi</Th>
            </tr>
          </thead>
          <tbody>
            {mails.map((mail) => (
              <tr
                key={mail.id}
                className={clsx(
                  styles.mailRow,
                  selectedId === mail.id && styles.selectedRow
                )}
                onClick={() =>
                  setSelectedId(selectedId === mail.id ? undefined : mail.id)
                }
              >
                <Td>{renderSender(mail)}</Td>
                <Td>{renderSubject(mail)}</Td>
                <Td>{formatDate(mail)}</Td>
                <Td align="center">
                  {mail.kind === "rsvp" ? (
                    <Badge level="warning">RSVP</Badge>
                  ) : (
                    <Badge>Viesti</Badge>
                  )}
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {selectedMail && (
        <div className={styles.messagePane}>
          <Stack gap="sm">
            <div className={styles.fromLine}>
              Lähettäjä: {renderSender(selectedMail)}
            </div>
            <Heading level={4}>{renderSubject(selectedMail)}</Heading>

            {renderBody(selectedMail).map((line, i) => (
              <Markdown key={i}>{line}</Markdown>
            ))}

            {selectedMail.kind === "rsvp" && (
              <div className={styles.answerBar}>
                {selectedMail.answerOptions.map((opt) => (
                  <Button key={opt.key}>{opt.label}</Button>
                ))}
              </div>
            )}
          </Stack>
        </div>
      )}
    </Stack>
  );
};

export default Mailbox;
