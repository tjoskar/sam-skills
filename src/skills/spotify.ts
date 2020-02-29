import { Skill } from "./skill";

export class Spotify implements Skill {
  intent = ['GetTime'];
  
  async execute() {
    return {
      say: `Sorry, I do not know how to use Spotify yet`
    }
  }
}