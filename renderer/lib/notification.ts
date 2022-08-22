/**
 * Sends the user a desktop notification.
 */
export function notify(title, body) {
    // TODO: Notification should.... ?
    new Notification(title, {
        body,
    }).onclick = () => console.log('Notification Clicked');
}
