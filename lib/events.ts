import { EVENTS } from './site';
const today = () => new Date(new Date().toLocaleString('en-US', { timeZone: 'Africa/Gaborone' })).toISOString().slice(0, 10);
export const upcoming = () => EVENTS.filter(e => e.date >= today()).sort((a, b) => a.date.localeCompare(b.date));
export const past = () => EVENTS.filter(e => e.date < today()).sort((a, b) => b.date.localeCompare(a.date));
export const fmtEventDate = (d: string) => new Date(d + 'T12:00:00Z').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
