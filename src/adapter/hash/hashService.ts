export type HashObject = {
  object: string;
  algorithm: "SHA-256" | "SHA-1";
};

export type HashService = {
  hashObject({ object, algorithm }: HashObject): Promise<string>;
};
