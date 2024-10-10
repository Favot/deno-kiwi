export interface HashService {
  generateHash(object: string, algorithm: "SHA-256" | "SHA-1"): Promise<string>;
}
