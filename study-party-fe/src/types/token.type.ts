export type TokenPair = {
    accessToken: string;
    refreshToken?: string;
    refreshTtlSeconds: number;
}

export type Tokens = { accessToken?: string };

