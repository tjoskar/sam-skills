import fetch from 'node-fetch';
import { Skill } from './skill';
import { IntentEvent } from './intent-event';

export class Joke implements Skill {
  intent = ['Joke', 'Oskar'];

  async execute(event: IntentEvent) {
    switch (event.intent.name) {
      case 'Joke':
        const result = await fetch('https://icanhazdadjoke.com/', {
          headers: { Accept: 'text/plain' },
        }).then((r) => r.text());
        return {
          say: result,
        };
      case 'Oskar':
        return {
          say: 'Oskar is my master, my creater, my everything',
        };
    }
    return {};
  }
}
