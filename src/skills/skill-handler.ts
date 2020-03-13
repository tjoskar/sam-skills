import { say } from '../say';
import { CurrentTime } from './current-time';
import { Spotify } from './spotify';
import { Skill } from './skill';
import { IntentEvent } from './intent-event';
import { PhilipsHue } from './philips-hue';
import { Wolfram } from './wolfram';
import { Joke } from './joke';
import { Timer } from './timer';
import { UselessFacts } from './useless-facts';

const skills: Skill[] = [new CurrentTime(), new Spotify(), new PhilipsHue(), new Wolfram(), new Joke(), new Timer(say), new UselessFacts()];

export const handler = async (intentEvent: IntentEvent) => {
  return Promise.all(skills.filter(skill => skill.intent.includes(intentEvent.intent.name)).map(skill => skill.execute(intentEvent)));
};
