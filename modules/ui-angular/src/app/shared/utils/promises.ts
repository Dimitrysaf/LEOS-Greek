export const createPromise = <T = unknown>() => {
  let resolve: (value: PromiseLike<T> | T) => void;
  let reject: (reason?: unknown) => void;

  const promise = new Promise<T>((res, rej) => {
    [resolve, reject] = [res, rej];
  });

  return { resolve, reject, promise };
};
