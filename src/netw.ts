
// TODO: docs
export async function fetchText (input: RequestInfo, init?: RequestInit): Promise<string> {
  const result = await fetch(input, init);
  if(!result.ok) {
    throw new Error(`Failed Request with status: ${result.status} ${result.statusText}`);
  }
  return await result.text();
}

// TODO: docs
export async function fetchJSON (input: RequestInfo, init?: RequestInit): Promise<any> {
  const result = await fetch(input, init);
  if(!result.ok) {
    throw new Error(`Failed Request with status: ${result.status} ${result.statusText}`);
  }
  return await result.json();
}

// TODO: docs
export async function fetchBlob (input: RequestInfo, init?: RequestInit): Promise<any> {
  const result = await fetch(input, init);
  if(!result.ok) {
    throw new Error(`Failed Request with status: ${result.status} ${result.statusText}`);
  }
  return await result.blob();
}
