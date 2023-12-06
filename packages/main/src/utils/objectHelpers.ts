export function getValueAtPath(obj: any, path: (string | number)[]) {
  let current = obj;

  for (const key of path) {
    current = current[key];
  }

  return current;
}

export function setValueAtPath(obj: any, path: (string | number)[], value: any) {
  let current = obj;

  for (const key of path.slice(0, path.length - 1)) {
    current = current[key];
  }

  current[path[path.length - 1]] = value;
}
