import { say } from '../say';
import { CurrentTime } from './current-time';
import { IntentEvent } from './intent-event';
import { Joke } from './joke';
import { PhilipsHue } from './philips-hue';
import { Skill } from './skill';
import { Sonos } from './sonos';
import { Status } from './status';
import { Timer } from './timer';
import { UselessFacts } from './useless-facts';
import { Wolfram } from './wolfram';

export const sonos = new Sonos();

const skills: Skill[] = [
  new CurrentTime(),
  new Joke(),
  new PhilipsHue(),
  sonos,
  new Status(),
  new Timer(say),
  new UselessFacts(),
  new Wolfram(),
];

export const handler = async (intentEvent: IntentEvent) => {
  return Promise.all(
    skills
      .filter((skill) => skill.intent.includes(intentEvent.intent.name))
      .map((skill) => skill.execute(intentEvent))
  );
};
