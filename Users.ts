import path from "node:path";
import userSecrets from "./user-secret.json";

// User Registry
export const USERS = {
    admin_user_1: "admin.user.1@gmail.com",
} as const; //  it's there to make the registry immutable. Without it, this would become a string

/*
    It restricts userKey being passed to only "admin_user_1" (or whatever keys you add to USERS), 
    so TypeScript flags a typo like getUser("admin_user_01") at compile time
*/
export type UserKey = keyof typeof USERS;

export function getUser(userKey: UserKey) {
    const email = USERS[userKey];
    return {
        userName: email,

        /*
            process.env.PASSWORD reads the PASSWORD value loaded into environment variables (from Secrets.env via dotenv.config() 
            in playwright.config.ts, or a real CI env var). Since environment variables are always string | undefined, ?? "" 
            is the nullish-coalescing operator: if process.env.PASSWORD is undefined (not set), 
            fall back to an empty string "" instead of returning undefined.
        */

        password: process.env.PASSWORD ?? "",
        mfaSecret: (userSecrets as Record<string, string>)[email],

        /* This just builds the path that will be used while session restore

           page.context().storageState({ path: getUser('admin_user_1').path }).

           __dirname is a Node.js variable available automatically in CommonJS modules that holds the absolute path of the folder 
           containing the current file — here, PlaywrightFrameworkDesign, since that's where Users.ts lives. 
           It's used instead of a relative path like ./.auth so the path resolves correctly regardless of what 
           directory you run the command from.

           c:\LEARNING_REPOS\PlaywrightFrameworkDesign\.auth\admin_user_1.json
        */
        path: path.join(__dirname, ".auth", `${userKey}.json`),
    };
}