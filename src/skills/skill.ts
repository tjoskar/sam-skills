import { IntentEvent } from "./intent-event";

export abstract class Skill {
  abstract readonly intent: string[];
  abstract async execute(event: IntentEvent): Promise<{
    say?: string
  }>;
}