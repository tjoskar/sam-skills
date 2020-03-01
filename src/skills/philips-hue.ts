import fetch from 'node-fetch';
import { Skill } from './skill';
import { IntentEvent } from './intent-event';

export class PhilipsHue implements Skill {
  intent = ['ChangeLightState'];
  #username = process.env.PHILIPS_HUE_USERID;

  private async getBridgeIp() {
    console.log('getBridgeIp');
    const result = await fetch('https://discovery.meethue.com/').then(r => r.json());
    return result[0].internalipaddress;
  }

  private async getLights(ip: string): Promise<Lamps> {
    console.log('getLights');
    return fetch(`http://${ip}/api/${this.#username}/lights`).then(r => r.json());
  }

  private async changeState(ip: string, id: string, on: boolean) {
    console.log('changeState', id, on);
    const state = on ? { on, bri: 144, ct: 443 } : { on: false };
    return fetch(`http://${ip}/api/${this.#username}/lights/${id}/state`, { method: 'PUT', body: JSON.stringify(state) }).then(r => r.json());
  }

  private getContext(event: IntentEvent) {
    const context = {
      name: '',
      state: true
    }
    for (const { entity, value } of event.entities) {
      if (entity === 'name') {
        context.name = value;
      } else if (entity === 'state') {
        context.state = (value === 'off' ? false : true);
      }
    }
    return context;
  }

  private findLampIds(name: string, lamps: Lamps): string[] {
    if (name === 'all') {
      return Object.keys(lamps);
    }
    return Object.entries(lamps).filter(([id, lamp]) => lamp.name.toLowerCase() === name.toLowerCase()).map(([id]) => id)
  }

  async execute(event: IntentEvent) {
    if (!this.#username) {
      return {
        say: 'You need to create a user id before you can continue'
      }
    }
    const ip = await this.getBridgeIp();
    const lights = await this.getLights(ip);
    const { name, state } = this.getContext(event);

    const ids = this.findLampIds(name, lights);

    await Promise.all(ids.map(id => this.changeState(ip, id, state)))

    return {
      say: `Done`
    }
  }
}

interface Lamp {
  state: {
    on: boolean,
    bri: number,
    ct: number,
    alert: 'none',
    colormode: 'ct',
    mode: 'homeautomation',
    reachable: boolean
  },
  swupdate: { state: 'noupdates', lastinstall: string },
  type: 'Color temperature light',
  name: string,
  modelid: string,
  manufacturername: string,
  productname: string,
  capabilities: { certified: boolean, control: unknown, streaming: unknown },
  config: {
    archetype: 'spotbulb',
    function: 'functional',
    direction: 'downwards',
    startup: unknown
  },
  uniqueid: string,
  swversion: string,
  swconfigid: string,
  productid: string
}

type Lamps = Record<string, Lamp>
