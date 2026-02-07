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
export interface Profile {
    email: string;
    topics: Array<string>;
    timeZone: string;
}
export interface AlertRule {
    id: bigint;
    active: boolean;
    frequency: string;
    condition: string;
}
export interface backendInterface {
    addAsset(name: string, ticker: string, allocation: bigint, timeHorizon: string, averageEntryPrice: bigint | null): Promise<void>;
    createAlertRule(condition: string, frequency: string): Promise<bigint>;
    createDailyBrief(summary: string, riskCatalysts: Array<[bigint, string, string]>, bullishScore: bigint, volatilityScore: bigint, liquidityScore: bigint, signalNoiseScore: bigint, keyDrivers: Array<string>, watchNext: Array<string>): Promise<bigint>;
    createPortfolioSnapshot(healthScore: bigint, risks: Array<string>, opportunities: Array<string>): Promise<bigint>;
    createResearchItem(topic: string, summary: string, keyPoints: Array<string>, risks: Array<string>, catalysts: Array<string>, score: bigint, justification: string): Promise<bigint>;
    getAlertRule(id: bigint): Promise<AlertRule>;
    getDailyBrief(id: bigint): Promise<DailyBrief>;
    getPortfolioSnapshot(id: bigint): Promise<PortfolioSnapshot>;
    getProfile(email: string): Promise<Profile | null>;
    getResearchItem(id: bigint): Promise<ResearchItem>;
    listAlertRules(): Promise<Array<[bigint, AlertRule]>>;
    listDailyBriefs(): Promise<Array<[bigint, DailyBrief]>>;
    listPortfolioSnapshots(): Promise<Array<[bigint, PortfolioSnapshot]>>;
    listResearchItems(): Promise<Array<[bigint, ResearchItem]>>;
    saveResearchItem(id: bigint): Promise<void>;
    toggleAlertRule(id: bigint): Promise<void>;
    updateProfile(email: string, timeZone: string, topics: Array<string>): Promise<void>;
}
