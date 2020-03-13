import { Skill } from "./skill";
import { IntentEvent } from "./intent-event";

export class Timer implements Skill {
  intent = ['SetTimer', 'CheckTimer', 'CancelTimer'];
  #ongoingTimers: ITimer[] = [];
  #say: (msg: string) => Promise<void>;

  constructor(say: (msg: string) => Promise<void>) {
    this.#say = say;
  }

  private timerDone(timer: ITimer) {
    this.#say(`The wait is over. The timer for ${timer.name} is done`);
    this.#ongoingTimers = this.#ongoingTimers.filter(t => t.timeoutId !== timer.timeoutId);
  }

  private unixTimestap() {
    return (Date.now() / 1000) | 0;
  }

  private timeToString(hour: number, minute: number, second: number): string {
    let namePart: string[] = [];
    let name = '';
    if (hour === 1) {
      namePart.push('one hour')
    } else if (hour > 1) {
      namePart.push(`${hour} hours`)
    }
    if (minute === 1) {
      namePart.push('one minute')
    } else if (hour > 1) {
      namePart.push(`${minute} minutes`)
    }
    if (second === 1) {
      namePart.push('one second')
    } else if (hour > 1) {
      namePart.push(`${second} seconds`)
    }
    if (namePart.length === 3) {
      name = `${namePart[0]}, ${namePart[1]} and ${namePart[2]}`
    } else if (namePart.length === 2) {
      name = `${namePart[0]} and ${namePart[1]}`
    } else {
      name = namePart[0]
    }
    return name;
  }

  private startTimer(hour: number, minute: number, second: number): ITimer {
    const name = this.timeToString(hour, minute, second);
    const timeMs = (hour * 60 * 60 + minute * 60 + second) * 1000;
    const timer: ITimer = { name, started: this.unixTimestap() };
    timer.timeoutId = setTimeout(() => this.timerDone(timer), timeMs);
    this.#ongoingTimers.push(timer);
    return timer;
  }

  private getTimeLeft(timer: ITimer) {
    const { started } = timer;
    const now = this.unixTimestap();
    const diff = now - started;
    const hour = (diff / 60 / 60) | 0;
    const minute = (diff - hour * 60 * 60) / 60 | 0;
    const second = (diff - hour * 60 * 60 - minute * 60);
    return this.timeToString(hour, minute, second);
  }
  
  async execute(event: IntentEvent<number>) {
    switch (event.intent.name) {
      case 'SetTimer':
        const timer = this.startTimer(
          event.entities.find(e => e.entity === 'hours')?.value || 0,
          event.entities.find(e => e.entity === 'minutes')?.value || 0,
          event.entities.find(e => e.entity === 'seconds')?.value || 0,
        );
        return {
          say: `A timer has been started for ${timer.name}`
        }
      case 'CheckTimer':
        const timersName = this.#ongoingTimers.map(t => this.getTimeLeft(t));
        if (timersName.length === 0) {
          return {
            say: `You don't have any ongoing timers`
          }
        } else if (timersName.length === 1) {
          return {
            say: `There is ${timersName[0]} left on you timer`
          }
        } else {
          return {
            say: `You have ${timersName.length} ongoing timers. ${timersName.map((t, i) => `There is ${t} left on your ${i + 1} timer`).join(' and ')}`
          }
        }
      case 'CancelTimer':
        if (this.#ongoingTimers.length === 0) {
          return {
            say: `You don't have any ongoing timers`
          }
        }
        this.#ongoingTimers.forEach(t => clearTimeout(t.timeoutId!));
        this.#ongoingTimers = [];
        return {
          say: `I will no longer remind you`
        }
      default:
        break;
    }
    const now = new Date();
    const hours = now.getHours() + 1;
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return {
      say: `The time is ${hours}, ${minutes}`
    }
  }
}

interface ITimer {
  name: string;
  started: number; // Unix time for when the timer was started
  timeoutId?: NodeJS.Timeout
}