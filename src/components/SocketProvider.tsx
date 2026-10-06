/**
 * Opens the user's Socket.IO connection to the platform chat system once the
 * token has been validated, and keeps it for the lifetime of the app shell.
 *
 * Matches the v1 server contract (`receiver-chatsystem`):
 *  - socket.io v2 / Engine.IO 3, websocket transport only (the server sets
 *    `io.set("transports", ["websocket"])` and disables upgrades)
 *  - the handshake `token` query param is a *gate*: `socketio-jwt` verifies it
 *    against the server's single shared secret. It is not the user's identity,
 *    and a tenant-signed user JWT fails it with "invalid signature".
 *  - on connect the client declares who it is with `vizru_user`, which joins
 *    the `{id}user` room (and `{tid}general` when a tenant id is configured).
 *    Its `auth_token` is the user's real JWT — the chat server uses it as the
 *    bearer credential when triggering workflows on this user's behalf.
 */
import io from "socket.io-client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { getSocketCredentials } from "../api/socket";

type SocketContextValue = {
  connected: boolean;
  emit: (event: string, payload?: unknown) => void;
  on: (event: string, handler: (data: unknown) => void) => () => void;
};

const SocketContext = createContext<SocketContextValue | null>(null);

export function useSocket(): SocketContextValue {
  const context = useContext(SocketContext);
  if (context === null) {
    throw new Error("useSocket must be used inside <SocketProvider>");
  }
  return context;
}

export function SocketProvider({ children }: { children: ReactNode }) {
  const socketRef = useRef<SocketIOClient.Socket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      let credentials;
      try {
        credentials = await getSocketCredentials();
      } catch (error) {
        console.error("[socket] could not get credentials", error);
        return;
      }

      // The effect may have been torn down while the RPC was in flight.
      if (cancelled) return;

      const socket = io(credentials.url, {
        query: {
          token: credentials.handshakeToken,
          EIO: "3",
          transport: "websocket",
        },
        transports: ["websocket"],
        secure: true,
        reconnection: true,
        reconnectionAttempts: 20,
        reconnectionDelay: 2000,
        timeout: 300000,
      });

      socketRef.current = socket;

      socket.on("connect", () => {
        setConnected(true);

        // Identifies the user and joins their rooms. `tid` is only included
        // when configured — without it the user still receives everything
        // addressed to them via the `{id}user` room.
        socket.emit("vizru_user", {
          username: credentials.user.username,
          email: credentials.user.email,
          id: credentials.user.id,
          auth_token: credentials.authToken,
          ...(credentials.tenantId !== undefined ? { tid: credentials.tenantId } : {}),
        });
      });

      socket.on("disconnect", (reason: string) => {
        setConnected(false);
        console.warn("[socket] disconnected:", reason);
      });

      socket.on("connect_error", (error: unknown) => {
        setConnected(false);
        console.error("[socket] connection error", error);
      });

      socket.on("error", (error: unknown) => {
        console.error("[socket] server error", error);
      });
    })();

    return () => {
      cancelled = true;
      socketRef.current?.disconnect();
      socketRef.current = null;
      setConnected(false);
    };
  }, []);

  const emit = useCallback((event: string, payload?: unknown) => {
    const socket = socketRef.current;
    if (socket?.connected !== true) {
      console.warn(`[socket] not connected; "${event}" was not emitted`);
      return;
    }
    socket.emit(event, payload);
  }, []);

  /** Subscribes to an event and returns an unsubscribe function. */
  const on = useCallback((event: string, handler: (data: unknown) => void) => {
    socketRef.current?.on(event, handler);
    return () => {
      socketRef.current?.off(event, handler);
    };
  }, []);

  return (
    <SocketContext.Provider value={{ connected, emit, on }}>{children}</SocketContext.Provider>
  );
}
