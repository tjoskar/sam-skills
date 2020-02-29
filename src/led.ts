import { led as matrixLed } from '@matrix-io/matrix-lite';

export class Led {
  #intervalId: NodeJS.Timeout | undefined;

  pulse({r, g, b}: { r?: number, g?: number, b?: number }) {
    const color: { [k: string]: number | undefined } = {
      r, g, b
    };
    let direction = 1;
    let loopCount = 1;
    this.run(() => {
      if (loopCount >= 10) {
        loopCount = 0;
        direction = direction * -1;
      }
      Object.entries(color).forEach(([k, value]) => {
        if (typeof value !== 'number') {
          return;
        }
        color[k] = Math.min(255, Math.max(0, value + direction * 10));
      });
      matrixLed.set(color);
      loopCount++;
    }, 100);
  }

  circle() {
    let gPos = 0;
    let bPos = (matrixLed.length/3) | 0;
    let rPos = (matrixLed.length/3)*2 | 0;
    this.run(() => {
      const everloop = new Array(matrixLed.length).fill({});
      rPos++;
      gPos++;
      bPos++;
      if (gPos >= matrixLed.length - 1) {
        gPos = 0;
      }
      if (bPos >= matrixLed.length - 1) {
        bPos = 0;
      }
      if (rPos >= matrixLed.length - 1) {
        rPos = 0;
      }
      everloop[rPos] = {r:100}
      everloop[gPos] = {g:100}
      everloop[bPos] = {b:100}
      matrixLed.set(everloop);
    });
  }

  stop() {
    if (this.#intervalId) {
      clearInterval(this.#intervalId);
    }
  }

  clear() {
    matrixLed.set({});
  }

  run(cb: () => void, intervalTime = 50) {
    this.stop();
    this.#intervalId = setInterval(cb, intervalTime);
  }
}
