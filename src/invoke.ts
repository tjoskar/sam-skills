import { handler } from './skills/skill-handler';
import { IntentEvent } from './skills/intent-event';

const intent: IntentEvent = {
  intent: {
    name: 'PlayP3',
    confidence: 1,
  },
  entities: [],
  text: '',
  raw_text: '',
  recognize_seconds: 0,
  tokens: [],
  raw_tokens: [],
  wav_seconds: 0,
  transcribe_seconds: 0,
  speech_confidence: 0,
  wakeId: '',
  siteId: '',
  slots: {},
};

handler(intent).then(console.log).catch(console.error);
