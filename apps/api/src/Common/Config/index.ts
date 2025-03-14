export interface Confguration {
    clerkPublishableKey: string;
    clerkSecretKey: string;
}

let config: Confguration | null = null;

const getConfig = () => {
    return {
        clerkPublishableKey: process.env.CLERK_PUBLISHABLE_KEY,
        clerkSecretKey: process.env.CLERK_SECRET_KEY,
    }
}

export const load = () => {
    if (config === null) {
        config = getConfig();
    }
    return config;
}