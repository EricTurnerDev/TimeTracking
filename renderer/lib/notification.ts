/**
 * Sends the user a desktop notification.
 */
export function notify(title, body) {
    new Notification(title, {
        body,
    }).onclick = () => console.log("Notification Clicked");
}
