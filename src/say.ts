import { request } from 'http';

// Text to speech
export function say(text: string): Promise<void> {
  return new Promise(resolve => {
    const options = {
      hostname: "localhost",
      port: 12101,
      path: "/api/text-to-speech",
      method: "POST"
    };
  
    const req = request(options, () => resolve());
  
    req.on("error", error => {
      console.error(error);
    });
  
    req.write(text);
    req.end();
  })
}
