import WebSocket from 'ws';
import { Led } from './led';
import { say } from './say';
import { handler } from './skills/skill-handler';
import { IntentEvent } from './skills/intent-event';

const led = new Led();
const intentWs = new WebSocket('ws://localhost:12101/api/events/intent');
const wakeWs = new WebSocket('ws://localhost:12101/api/events/wake');

console.log('** Start Sam **');

intentWs.on('open', () => console.log('\n**Connected**\n'));
intentWs.on('close', () => console.log('\n**Disconnected**\n'));
wakeWs.on('open', () => console.log('\n**Connected**\n'));
wakeWs.on('close', () => console.log('\n**Disconnected**\n'));

wakeWs.on('message', () => {
  // Start a blue pulse effect when wake word is detected
  led.pulse({ b: 10 });
});

// Intents are passed through here
intentWs.on('message', async data => {
  const intentEvent: IntentEvent = JSON.parse(data.toString());

  console.log('**Captured New Intent**');
  console.log(intentEvent);

  try {
    led.pulse({ r: 72, b: 103 });
    const results = await handler(intentEvent);
    if (results.length === 0) {
      led.pulse({ r: 10 });
      await say('Sorry, I did not understand');
    } else {
      for (const result of results) {
        if (!result.say) {
          continue;
        }
        await say(result.say);
      }
    }
  } catch (error) {
    led.pulse({ r: 10 });
    await say('Sorry, something went wrong. ' + error?.message);
  }

  led.stop();
  led.clear();
});
