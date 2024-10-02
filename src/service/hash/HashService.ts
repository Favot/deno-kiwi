export interface HashService {
  hashObject(object: string, algorithm: "SHA-256" | "SHA-1"): Promise<string>;
}
