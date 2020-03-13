import { humidity } from '@matrix-io/matrix-lite';
import { Skill } from './skill';

export class Status implements Skill {
  intent = ['Status'];

  async execute() {
    const { temperature } = humidity.read();
    return {
      say: `I'm ${temperature} degrees warm`
    };
  }
}
