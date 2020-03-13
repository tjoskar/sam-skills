import { Skill } from './skill';

export class CurrentTime implements Skill {
  intent = ['GetTime'];

  async execute() {
    const now = new Date();
    const hours = now.getHours() + 1;
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return {
      say: `The time is ${hours}, ${minutes}`
    };
  }
}
