import React from "react";
import Markdown from "react-markdown";
// import eventList from "../../data/events";

const Events = props => {
  const { events, manager, resolveEvent } = props;

  const managersEvents = events.filter(
    e => e.get("manager") === manager.get("id")
  );

  return (
    <div>
      <p>{managersEvents.count()} tapahtumaa...</p>

      {managersEvents
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
                    .options(e)
                    .map((option, key) => {
                      return (
                        <li key={key}>
                          <a
                            href="#"
                            onClick={evt => {
                              evt.preventDefault();
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
