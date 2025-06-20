import * as signalR from "@microsoft/signalr";

export class SignalRConnection {
  private static instance: SignalRConnection;
  private connection: signalR.HubConnection;

  constructor() {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(`${process.env.NEXT_PUBLIC_PUBLIC_SOCKET}`, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();
  }

  public static getInstance(): SignalRConnection {
    if (!SignalRConnection.instance) {
      SignalRConnection.instance = new SignalRConnection();
    }
    return SignalRConnection.instance;
  }

  public getConnection(): signalR.HubConnection {
    return this.connection;
  }

  public async startConnection(): Promise<void> {
    if (this.connection.state !== signalR.HubConnectionState.Disconnected) {
      console.warn("SignalR connection is not in a 'Disconnected' state.");
      return;
    }

    try {
      await this.connection.start();
      if (process.env.NODE_ENV !== "production") {
        console.log("SignalR Connected");
      }
    } catch (err) {
      console.error("SignalR Connection Error: ", err);
      setTimeout(() => this.startConnection(), 5000);
    }
  }
}
