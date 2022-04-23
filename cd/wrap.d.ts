import { Pariah } from "pariah";
export declare module Pylon {
    const Url: URL;
    interface User {
        id: string;
        lastSeenAt: string;
        avatar: string | null;
        displayName: string;
        hasAccess: boolean;
    }
    interface GuildStats {
        date: number;
        cpuMs: number;
        executionMs: number;
        hostFunctionCalls: number;
        discordCacheRequests: number;
        discordApiRequests: number;
        events: number;
        cpuMsAvg: number;
        executionMsAvg: number;
        kvOperations: number;
    }
    interface Deployment {
        app_id: string | null;
        id: string;
        bot_id: string;
        type: number;
        status: number;
        name: string;
        config: string;
        revision: number;
        workbench_url: string;
        script: {
            id: string;
            project: string;
        };
        guild: GuildPayload;
    }
    interface Guild extends GuildPayload {
        region: string;
        afk_channel_id: string | null;
        owner_id: string;
        joined_at: string;
        splash: string | null;
        discovery_splash: string | null;
        afk_timeout: number;
        member_count: number;
        verification_level: number;
        default_message_notifications: number;
        explicit_content_filter: number;
        features: Array<string>;
        mfa_level: number;
        widget_enabled: boolean;
        widget_channel_id: string | null;
        system_channel_id: string | null;
        vanity_url_code: string | null;
        description: string | null;
        banner: string | null;
        premium_tier: number;
        premium_subscription_count: number;
        unavailable: boolean;
        deployments: Array<Exclude<Deployment, "project">>;
    }
    interface GuildPayload {
        id: string;
        name: string;
        icon: string | null;
    }
    interface Project {
        contents: string;
        project: {
            files: Array<File>;
        };
    }
    interface File {
        path: string;
        content: string;
    }
    interface PublishedDeployment extends Deployment {
        errors: Array<string>;
    }
    class API extends Pariah {
        readonly token: string;
        constructor(token: string);
        user(): Promise<User>;
        guildStats(guildId: string): Promise<Array<GuildStats>>;
        guild(guildId: string): Promise<Guild>;
        deployment(deploymentId: string): Promise<Deployment>;
        guilds(): Promise<Array<GuildPayload>>;
        guildsAvailable(): Promise<Array<GuildPayload>>;
        publishDeployment(deploymentId: string, project: Project): Promise<PublishedDeployment>;
    }
}
