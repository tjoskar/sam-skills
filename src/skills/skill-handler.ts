import { CurrentTime } from './current-time';
import { Spotify } from './spotify';
import { Skill } from './skill';
import { IntentEvent } from './intent-event';
import { PhilipsHue } from './philips-hue';

const skills: Skill[] = [new CurrentTime(), new Spotify(), new PhilipsHue()];

export const handler = async (intentEvent: IntentEvent) => {
  return Promise.all(skills.filter(skill => skill.intent.includes(intentEvent.intent.name)).map(skill => skill.execute(intentEvent)));
};
