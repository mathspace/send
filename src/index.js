// @flow

import uuid from 'uuid-browser/v4';

// Only supports string value for now, but in the future we'd want to handle
// numbers and booleans too.
type EventProperties = { [string]: string };

type Event = {|
  // UUID v4 (useful for preventing the same event getting processed twice).
  id: string,
  // Client gets to nominate a timestamp… probably needs some kind of
  // restriction for how long in the past it's allowed to be.
  timestamp: string,
  // A unique identifier for the user.
  user_id: string,
  // Identifier for a set of events – all events in the stream should adhere
  // to using the same schema for the `properties` field.
  type: string,
  // Key/value pair of event properties.
  properties: EventProperties,
|};

type Payload = {|
  // The write key will be exposed to the public, but it can be easily revoked
  // if someone start abusing it.
  writeKey: string,
  // In the future, we can do some smart batching, but for now this will always
  // contain exactly 1 event.
  events: [Event],
|};

const sendData = (url: string, data: string) => {
  if (navigator.sendBeacon) {
    navigator.sendBeacon(url, data);
  } else {
    const client = new XMLHttpRequest();
    // Third parameter indicates sync xhr… yeah performance!
    client.open('POST', url, false);
    client.setRequestHeader('Content-Type', 'text/plain;charset=UTF-8');
    client.send(data);
  }
};

class Analytics {
  endpoint: string;
  writeKey: string;
  userId: string;

  constructor(endpoint: string, writeKey: string) {
    this.endpoint = endpoint;
    this.writeKey = writeKey;
    this.userId = uuid();
  }

  identify(userId: string): void {
    this.userId = userId;
  }

  send(type: string, properties: EventProperties): void {
    const payload: Payload = {
      writeKey: this.writeKey,
      events: [
        {
          id: uuid(),
          timestamp: new Date().toISOString(),
          user_id: this.userId,
          type,
          properties,
        },
      ],
    };

    sendData(this.endpoint, JSON.stringify(payload));
  }
}

export default Analytics;
