import fetch from "node-fetch";
import { Skill } from "./skill";

export class Joke implements Skill {
  intent = ['Joke'];

  async execute() {
    const result = await fetch('https://icanhazdadjoke.com/', { headers: { 'Accept': 'text/plain' } }).then(r => r.text());
    return {
      say: result
    }
  }
}
