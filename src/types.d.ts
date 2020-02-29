declare module "@matrix-io/matrix-lite" {
  interface LedColor { r?: number, g?: number, b?: number, w?: number }
  interface Led {
    set(colors: LedColor | LedColor[]): void;
    length: number;
  }
  export const led: Led;
}
