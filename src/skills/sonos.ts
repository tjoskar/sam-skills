import { SonosDevice, SonosDeviceDiscovery } from '@svrooij/sonos';
import { TransportState } from '@svrooij/sonos/lib/models';
import { IntentEvent } from './intent-event';
import { Skill } from './skill';

export class Sonos implements Skill {
  intent = ['PlaySpotify', 'WhatIsPlaying', 'PlayP3'];
  private device: SonosDevice | null = null;
  private volume: number = 0;

  private async getDevice(): Promise<SonosDevice> {
    if (!this.device) {
      const deviceDiscovery = new SonosDeviceDiscovery();
      const player = await deviceDiscovery.SearchOne(10);
      console.log(player.host, player.port);
      this.device = new SonosDevice(player.host, player.port);
    }
    return this.device;
  }

  private async playRadio(station: string) {
    const device = await this.getDevice();
    await device.SetAVTransportURI('radio:s25681');
    await device.Play();
  }

  private async playPlaylistOnSpotify(playlist: string) {
    const device = await this.getDevice();
    await device.AddUriToQueue('spotify:playlist:37i9dQZEVXbLoATJ81JYXz');
    await device.Play();
  }

  async isPlaying(): Promise<boolean> {
    const devive = await this.getDevice();
    const transport = await devive.AVTransportService.GetTransportInfo();
    return transport.CurrentTransportState === TransportState.Playing;
  }

  async getCurrentVolume() {
    const device = await this.getDevice();
    const volume = await device.RenderingControlService.GetVolume({
      InstanceID: 0,
      Channel: 'Master',
    });
    this.volume = volume.CurrentVolume;
    return volume.CurrentVolume;
  }

  async setVolume(volume: number) {
    const device = await this.getDevice();
    await device.RenderingControlService.SetVolume({
      InstanceID: 0,
      Channel: 'Master',
      DesiredVolume: volume,
    });
    this.volume = volume;
  }

  async quiet() {
    if (!(await this.isPlaying())) {
      return;
    }
    await this.getCurrentVolume();
    const device = await this.getDevice();
    await device.RenderingControlService.SetVolume({
      InstanceID: 0,
      Channel: 'Master',
      DesiredVolume: 1,
    });
  }

  async restoreVolume() {
    if (this.volume && (await this.isPlaying())) {
      await this.setVolume(this.volume);
    }
  }

  async execute(event: IntentEvent) {
    const top50Sweden = 'spotify:playlist:37i9dQZEVXbLoATJ81JYXz';
    switch (event.intent.name) {
      case 'PlaySpotify':
        await this.playPlaylistOnSpotify(top50Sweden);
        break;
      case 'PlayP3':
        await this.playRadio('radio:s25681');
        break;
    }
    return {};
  }
}
