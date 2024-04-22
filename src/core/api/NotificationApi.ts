import { Notification } from 'electron';
import { INotificationApi } from './INotificationApi';

export class NotificationApi implements INotificationApi {
  notify({ title, body }) {
    new Notification({ title, body }).show();
  }
}
