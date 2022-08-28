/**
 * Adds an 's' on the end of something if count is not 1.
 */
export default function pluralize(noun: string, count: number) {
    return `${noun}${count !== 1 ? 's' : ''}`
}