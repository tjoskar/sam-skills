import { Skill } from "./skill";
import { IntentEvent } from "./intent-event";
import fetch from "node-fetch";

export class Wolfram implements Skill {
  intent = ['Temperature'];
  #appId = process.env.WOLFRAM_APPID;

  private request(query: string): Promise<string> {
    const s = encodeURIComponent(query);
    console.log(`https://api.wolframalpha.com/v1/spoken?i=${s}&appid=${this.#appId}`)
    return fetch(`https://api.wolframalpha.com/v1/spoken?i=${s}&appid=${this.#appId}`).then(r => r.text());
  }
  
  async execute(event: IntentEvent) {
    let result = 'I do not know';
    switch (event.intent.name) {
      case 'Temperature':
        result = await this.request('Whats the temperature in Stockholm');
        console.log(result);
        break;
      default:
        break;
    }
    return {
      say: result
    }
  }
}