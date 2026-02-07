import Map "mo:core/Map";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Time "mo:core/Time";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";

actor {
  type RiskCatalyst = {
    id : Nat;
    description : Text;
    impact : Text;
  };

  type Asset = {
    id : Nat;
    name : Text;
    ticker : Text;
    allocation : Nat;
    timeHorizon : Text;
    averageEntryPrice : ?Nat;
  };

  type Profile = {
    email : Text;
    timeZone : Text;
    topics : [Text];
  };

  type DailyBrief = {
    date : Int;
    summary : Text;
    riskScore : [RiskCatalyst];
    bullishScore : Nat;
    volatilityScore : Nat;
    liquidityScore : Nat;
    signalNoiseScore : Nat;
    keyDrivers : [Text];
    watchNext : [Text];
  };

  type ResearchItem = {
    id : Nat;
    topic : Text;
    summary : Text;
    keyPoints : [Text];
    risks : [Text];
    catalysts : [Text];
    score : Nat;
    justification : Text;
    saved : Bool;
  };

  type PortfolioSnapshot = {
    date : Int;
    assets : [Asset];
    allocation : Nat;
    healthScore : Nat;
    risks : [Text];
    opportunities : [Text];
  };

  type AlertRule = {
    id : Nat;
    condition : Text;
    frequency : Text;
    active : Bool;
  };

  var nextId = 1;
  let dailyBriefs = Map.empty<Nat, DailyBrief>();
  let researchItems = Map.empty<Nat, ResearchItem>();
  let portfolioSnapshots = Map.empty<Nat, PortfolioSnapshot>();
  let alertRules = Map.empty<Nat, AlertRule>();
  let profiles = Map.empty<Text, Profile>();
  let assets = List.empty<Asset>();

  // Daily Briefs
  public shared ({ caller }) func createDailyBrief(
    summary : Text,
    riskCatalysts : [(Nat, Text, Text)],
    bullishScore : Nat,
    volatilityScore : Nat,
    liquidityScore : Nat,
    signalNoiseScore : Nat,
    keyDrivers : [Text],
    watchNext : [Text]
  ) : async Nat {
    let id = nextId;
    nextId += 1;

    let riskCatalystArray = Array.tabulate(
      riskCatalysts.size(),
      func(i) {
        let (id, description, impact) = riskCatalysts[i];
        {
          id;
          description;
          impact;
        };
      },
    );

    let brief : DailyBrief = {
      date = Time.now();
      summary;
      riskScore = riskCatalystArray;
      bullishScore;
      volatilityScore;
      liquidityScore;
      signalNoiseScore;
      keyDrivers;
      watchNext;
    };
    dailyBriefs.add(id, brief);
    id;
  };

  public query ({ caller }) func getDailyBrief(id : Nat) : async DailyBrief {
    switch (dailyBriefs.get(id)) {
      case (null) { Runtime.trap("Daily brief not found") };
      case (?brief) { brief };
    };
  };

  public query ({ caller }) func listDailyBriefs() : async [(Nat, DailyBrief)] {
    dailyBriefs.toArray();
  };

  // Research Items
  public shared ({ caller }) func createResearchItem(
    topic : Text,
    summary : Text,
    keyPoints : [Text],
    risks : [Text],
    catalysts : [Text],
    score : Nat,
    justification : Text,
  ) : async Nat {
    let id = nextId;
    nextId += 1;

    let item : ResearchItem = {
      id;
      topic;
      summary;
      keyPoints;
      risks;
      catalysts;
      score;
      justification;
      saved = false;
    };
    researchItems.add(id, item);
    id;
  };

  public shared ({ caller }) func saveResearchItem(id : Nat) : async () {
    switch (researchItems.get(id)) {
      case (null) { Runtime.trap("Research item not found") };
      case (?item) {
        let updatedItem = { item with saved = true };
        researchItems.add(id, updatedItem);
      };
    };
  };

  public query ({ caller }) func getResearchItem(id : Nat) : async ResearchItem {
    switch (researchItems.get(id)) {
      case (null) { Runtime.trap("Research item not found") };
      case (?item) { item };
    };
  };

  public query ({ caller }) func listResearchItems() : async [(Nat, ResearchItem)] {
    researchItems.toArray();
  };

  // Portfolio Snapshots
  public shared ({ caller }) func addAsset(
    name : Text,
    ticker : Text,
    allocation : Nat,
    timeHorizon : Text,
    averageEntryPrice : ?Nat,
  ) : async () {
    let id = nextId;
    nextId += 1;
    let newAsset : Asset = {
      id;
      name;
      ticker;
      allocation;
      timeHorizon;
      averageEntryPrice;
    };
    assets.add(newAsset);
  };

  func calculateTotalAllocation() : Nat {
    var total = 0;
    for (asset in assets.values()) {
      total += asset.allocation;
    };
    total;
  };

  func assetsToArray() : [Asset] {
    assets.toArray();
  };

  public shared ({ caller }) func createPortfolioSnapshot(
    healthScore : Nat,
    risks : [Text],
    opportunities : [Text],
  ) : async Nat {
    let id = nextId;
    nextId += 1;

    let snapshot : PortfolioSnapshot = {
      date = Time.now();
      assets = assetsToArray();
      allocation = calculateTotalAllocation();
      healthScore;
      risks;
      opportunities;
    };
    portfolioSnapshots.add(id, snapshot);
    id;
  };

  public query ({ caller }) func getPortfolioSnapshot(id : Nat) : async PortfolioSnapshot {
    switch (portfolioSnapshots.get(id)) {
      case (null) { Runtime.trap("Portfolio snapshot not found") };
      case (?snapshot) { snapshot };
    };
  };

  public query ({ caller }) func listPortfolioSnapshots() : async [(Nat, PortfolioSnapshot)] {
    portfolioSnapshots.toArray();
  };

  // Alert Rules
  public shared ({ caller }) func createAlertRule(condition : Text, frequency : Text) : async Nat {
    let id = nextId;
    nextId += 1;

    let rule : AlertRule = {
      id;
      condition;
      frequency;
      active = true;
    };
    alertRules.add(id, rule);
    id;
  };

  public shared ({ caller }) func toggleAlertRule(id : Nat) : async () {
    switch (alertRules.get(id)) {
      case (null) { Runtime.trap("Alert rule not found") };
      case (?rule) {
        let updatedRule = { rule with active = not rule.active };
        alertRules.add(id, updatedRule);
      };
    };
  };

  public query ({ caller }) func getAlertRule(id : Nat) : async AlertRule {
    switch (alertRules.get(id)) {
      case (null) { Runtime.trap("Alert rule not found") };
      case (?rule) { rule };
    };
  };

  public query ({ caller }) func listAlertRules() : async [(Nat, AlertRule)] {
    alertRules.toArray();
  };

  // Profile Settings
  public shared ({ caller }) func updateProfile(email : Text, timeZone : Text, topics : [Text]) : async () {
    let newProfile : Profile = {
      email;
      timeZone;
      topics;
    };
    profiles.add(email, newProfile);
  };

  public query ({ caller }) func getProfile(email : Text) : async ?Profile {
    profiles.get(email);
  };
};
