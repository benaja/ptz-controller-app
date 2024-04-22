export interface INotificationApi {
  notify(params: { title: string; body: string }): void;
}
