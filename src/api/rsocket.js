import {
  APPLICATION_JSON,
  BufferEncoders,
  IdentitySerializer,
  JsonSerializer,
  MESSAGE_RSOCKET_COMPOSITE_METADATA,
  RSocketClient
} from 'rsocket-core'
import RSocketWebSocketClient from 'rsocket-websocket-client'

const url = import.meta.env.VITE_RSOCKET_URL;
const socket = socketClient();

export function connect() {
  console.log("RSocket connecting");

  return new Promise((resolve, reject) => {
    socket.connect()
      .subscribe({
        onComplete(r) {
          resolve(r);
        },
        onError(e) {
          reject(e);
        }
      })
  });
}

export function socketClient() {
  return new RSocketClient({
    serializers: {
      data: {
        deserialize: JsonSerializer.deserialize,
        serialize: (x) => Buffer.from(JSON.stringify(x))
      },
      metadata: IdentitySerializer,
    },
    setup: {
      keepAlive: 60000,
      lifetime: 90000,
      dataMimeType: APPLICATION_JSON.string,
      metadataMimeType: MESSAGE_RSOCKET_COMPOSITE_METADATA.string,
    },
    transport: new RSocketWebSocketClient({url: url}, BufferEncoders),
  });
}

export function close() {
  socket.close();
  //socket.disconnect();
}
