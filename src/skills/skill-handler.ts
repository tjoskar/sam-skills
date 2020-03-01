import { CurrentTime } from './current-time';
import { Spotify } from './spotify';
import { Skill } from './skill';
import { IntentEvent } from './intent-event';
import { PhilipsHue } from './philips-hue';
import { Wolfram } from './wolfram';

const skills: Skill[] = [new CurrentTime(), new Spotify(), new PhilipsHue(), new Wolfram()];

export const handler = async (intentEvent: IntentEvent) => {
  return Promise.all(skills.filter(skill => skill.intent.includes(intentEvent.intent.name)).map(skill => skill.execute(intentEvent)));
};
