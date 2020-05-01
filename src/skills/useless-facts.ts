import { Skill } from './skill';
import fetch from 'node-fetch';

export class UselessFacts implements Skill {
  intent = ['UselessFacts'];

  async execute() {
    const result = await fetch(
      'https://useless-facts.sameerkumar.website/api'
    ).then((r) => r.json());
    return {
      say: result.data,
    };
  }
}
