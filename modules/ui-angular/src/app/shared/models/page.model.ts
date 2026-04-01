export class Page<T> {
  constructor(public content: T[],
              public size: number,
              public totalElements: number,
              public totalPages: number,
              public number: number) {
  }
}
