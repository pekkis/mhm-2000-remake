import React from "react";
import Markdown from "react-markdown";
import eventList from "../../data/events";

const Events = props => {
  const { events, player, resolveEvent } = props;

  const playersEvents = events.filter(
    e => e.get("player") === player.get("id")
  );

  return (
    <div>
      <h2>Eventit</h2>

      <p>{playersEvents.count()} tapahtumaa...</p>

      {playersEvents
        .map(e => {
          const event = eventList.get(e.get("eventId"));

          return (
            <div key={e.get("id")}>
              <Markdown
                source={event
                  .render(e)
                  .filter(t => t)
                  .join("\n\n")}
              />
              {!e.get("resolved") && (
                <ul>
                  {event
                    .options()
                    .map((option, key) => {
                      return (
                        <li key={key}>
                          <a
                            href="#"
                            onClick={() => {
                              resolveEvent(e, key);
                            }}
                          >
                            {option}
                          </a>
                        </li>
                      );
                    })
                    .toList()}
                </ul>
              )}
            </div>
          );
        })
        .toList()}
    </div>
  );
};

export default Events;
