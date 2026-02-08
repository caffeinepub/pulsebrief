import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface DailyBrief {
    keyDrivers: Array<string>;
    watchNext: Array<string>;
    date: bigint;
    volatilityScore: bigint;
    summary: string;
    liquidityScore: bigint;
    signalNoiseScore: bigint;
    riskScore: Array<RiskCatalyst>;
    bullishScore: bigint;
}
export interface RiskCatalyst {
    id: bigint;
    impact: string;
    description: string;
}
export interface PortfolioSnapshot {
    date: bigint;
    assets: Array<Asset>;
    opportunities: Array<string>;
    allocation: bigint;
    healthScore: bigint;
    risks: Array<string>;
}
export interface ResearchItem {
    id: bigint;
    justification: string;
    topic: string;
    catalysts: Array<string>;
    saved: boolean;
    score: bigint;
    summary: string;
    keyPoints: Array<string>;
    risks: Array<string>;
}
export interface Asset {
    id: bigint;
    ticker: string;
    averageEntryPrice?: bigint;
    name: string;
    timeHorizon: string;
    allocation: bigint;
}
export interface AlertRule {
    id: bigint;
    active: boolean;
    frequency: string;
    condition: string;
}
export interface UserProfile {
    email: string;
    topics: Array<string>;
    isPro: boolean;
    timeZone: string;
}
export interface MarketPulseUpdate {
    id: bigint;
    updateText: string;
    timestamp: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addAsset(name: string, ticker: string, allocation: bigint, timeHorizon: string, averageEntryPrice: bigint | null): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createAlertRule(condition: string, frequency: string): Promise<bigint>;
    createDailyBrief(summary: string, riskCatalysts: Array<[bigint, string, string]>, bullishScore: bigint, volatilityScore: bigint, liquidityScore: bigint, signalNoiseScore: bigint, keyDrivers: Array<string>, watchNext: Array<string>): Promise<bigint>;
    createMarketPulseUpdate(updateText: string, previousUpdateText: string): Promise<bigint>;
    createPortfolioSnapshot(healthScore: bigint, risks: Array<string>, opportunities: Array<string>): Promise<bigint>;
    createResearchItem(topic: string, summary: string, keyPoints: Array<string>, risks: Array<string>, catalysts: Array<string>, score: bigint, justification: string): Promise<bigint>;
    getAlertRule(id: bigint): Promise<AlertRule>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDailyBrief(id: bigint): Promise<DailyBrief | null>;
    getMarketPulseUpdate(id: bigint): Promise<MarketPulseUpdate | null>;
    getPortfolioSnapshot(id: bigint): Promise<PortfolioSnapshot | null>;
    getProfile(email: string): Promise<UserProfile | null>;
    getResearchItem(id: bigint): Promise<ResearchItem>;
    getTodaysBrief(): Promise<DailyBrief | null>;
    getTodaysMarketPulseUpdate(): Promise<MarketPulseUpdate | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    isProUser(): Promise<boolean>;
    listAlertRules(): Promise<Array<[bigint, AlertRule]>>;
    listDailyBriefs(): Promise<Array<[bigint, DailyBrief]>>;
    listMarketPulseUpdates(): Promise<Array<[bigint, MarketPulseUpdate]>>;
    listPortfolioSnapshots(): Promise<Array<PortfolioSnapshot>>;
    listResearchItems(): Promise<Array<[bigint, ResearchItem]>>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveResearchItem(id: bigint): Promise<void>;
    setProStatus(isPro: boolean): Promise<void>;
    toggleAlertRule(id: bigint): Promise<void>;
    updateProfile(email: string, timeZone: string, topics: Array<string>): Promise<void>;
}
