import Map "mo:core/Map";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";



import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";


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

  type UserProfile = {
    email : Text;
    timeZone : Text;
    topics : [Text];
    isPro : Bool;
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

  type MarketPulseUpdate = {
    id : Nat;
    timestamp : Int;
    updateText : Text;
  };

  type UserData = {
    nextId : Nat;
    dailyBriefs : Map.Map<Nat, DailyBrief>;
    researchItems : Map.Map<Nat, ResearchItem>;
    portfolioSnapshots : Map.Map<Nat, PortfolioSnapshot>;
    alertRules : Map.Map<Nat, AlertRule>;
    assets : List.List<Asset>;
    marketPulseUpdates : Map.Map<Nat, MarketPulseUpdate>;
  };

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  var userData = Map.empty<Principal, UserData>();
  var userProfiles = Map.empty<Principal, UserProfile>();

  func getUserData(user : Principal) : UserData {
    switch (userData.get(user)) {
      case (null) {
        let newData : UserData = {
          nextId = 1;
          dailyBriefs = Map.empty<Nat, DailyBrief>();
          researchItems = Map.empty<Nat, ResearchItem>();
          portfolioSnapshots = Map.empty<Nat, PortfolioSnapshot>();
          alertRules = Map.empty<Nat, AlertRule>();
          assets = List.empty<Asset>();
          marketPulseUpdates = Map.empty<Nat, MarketPulseUpdate>();
        };
        userData.add(user, newData);
        newData;
      };
      case (?data) { data };
    };
  };

  func updateUserData(user : Principal, data : UserData) {
    userData.add(user, data);
  };

  // Pro User Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func isProUser() : async Bool {
    switch (userProfiles.get(caller)) {
      case (null) { false };
      case (?profile) { profile.isPro };
    };
  };

  public shared ({ caller }) func setProStatus(isPro : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update Pro status");
    };

    switch (userProfiles.get(caller)) {
      case (null) {
        let newProfile : UserProfile = {
          email = "";
          timeZone = "";
          topics = [];
          isPro;
        };
        userProfiles.add(caller, newProfile);
      };
      case (?profile) {
        let updatedProfile = { profile with isPro };
        userProfiles.add(caller, updatedProfile);
      };
    };
  };

  // Market Pulse Updates
  public shared ({ caller }) func createMarketPulseUpdate(
    updateText : Text,
    previousUpdateText : Text,
  ) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create market pulse updates");
    };

    let data = getUserData(caller);
    let id = data.nextId;

    if (updateText == previousUpdateText) {
      Runtime.trap("Market pulse update must be new information");
    };

    let update : MarketPulseUpdate = {
      id;
      timestamp = Time.now();
      updateText = updateText;
    };

    data.marketPulseUpdates.add(id, update);
    let updatedData = {
      data with
      nextId = data.nextId + 1;
    };
    updateUserData(caller, updatedData);
    id;
  };

  public query ({ caller }) func getMarketPulseUpdate(id : Nat) : async ?MarketPulseUpdate {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access market pulse updates");
    };
    let data = getUserData(caller);
    data.marketPulseUpdates.get(id);
  };

  public query ({ caller }) func listMarketPulseUpdates() : async [(Nat, MarketPulseUpdate)] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can list market pulse updates");
    };
    let data = getUserData(caller);
    data.marketPulseUpdates.toArray();
  };

  public query ({ caller }) func getTodaysMarketPulseUpdate() : async ?MarketPulseUpdate {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access market pulse updates");
    };
    let data = getUserData(caller);
    let now = Time.now();
    let today = now / (24 * 60 * 60 * 1_000_000_000);
    let todaysUpdate = data.marketPulseUpdates.entries().find(
      func((_, update)) {
        update.timestamp / (24 * 60 * 60 * 1_000_000_000) == today;
      }
    );
    switch (todaysUpdate) {
      case (null) { null };
      case (?(id, _)) { data.marketPulseUpdates.get(id) };
    };
  };

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
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create daily briefs");
    };

    let data = getUserData(caller);
    let id = data.nextId;

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

    data.dailyBriefs.add(id, brief);
    let updatedData = {
      data with
      nextId = data.nextId + 1;
    };
    updateUserData(caller, updatedData);
    id;
  };

  public query ({ caller }) func getDailyBrief(id : Nat) : async ?DailyBrief {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access daily briefs");
    };
    let data = getUserData(caller);
    data.dailyBriefs.get(id);
  };

  public query ({ caller }) func listDailyBriefs() : async [(Nat, DailyBrief)] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can list daily briefs");
    };
    let data = getUserData(caller);
    data.dailyBriefs.toArray();
  };

  public query ({ caller }) func getTodaysBrief() : async ?DailyBrief {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access daily briefs");
    };
    let data = getUserData(caller);
    let now = Time.now();
    let today = now / (24 * 60 * 60 * 1_000_000_000);
    let todaysBrief = data.dailyBriefs.entries().find(
      func((_, brief)) {
        brief.date / (24 * 60 * 60 * 1_000_000_000) == today;
      }
    );
    switch (todaysBrief) {
      case (null) { null };
      case (?(id, _)) { data.dailyBriefs.get(id) };
    };
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
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create research items");
    };

    let data = getUserData(caller);
    let id = data.nextId;

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

    data.researchItems.add(id, item);
    let updatedData = {
      data with
      nextId = data.nextId + 1;
    };
    updateUserData(caller, updatedData);
    id;
  };

  public shared ({ caller }) func saveResearchItem(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save research items");
    };

    let data = getUserData(caller);
    switch (data.researchItems.get(id)) {
      case (null) { Runtime.trap("Research item not found") };
      case (?item) {
        let updatedItem = { item with saved = true };
        data.researchItems.add(id, updatedItem);
        updateUserData(caller, data);
      };
    };
  };

  public query ({ caller }) func getResearchItem(id : Nat) : async ResearchItem {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access research items");
    };

    let data = getUserData(caller);
    switch (data.researchItems.get(id)) {
      case (null) { Runtime.trap("Research item not found") };
      case (?item) { item };
    };
  };

  public query ({ caller }) func listResearchItems() : async [(Nat, ResearchItem)] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can list research items");
    };

    let data = getUserData(caller);
    data.researchItems.toArray();
  };

  // Portfolio Snapshots - Pro Only
  public shared ({ caller }) func addAsset(
    name : Text,
    ticker : Text,
    allocation : Nat,
    timeHorizon : Text,
    averageEntryPrice : ?Nat,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add assets");
    };

    // Pro-only check for portfolio persistence
    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User profile not found") };
      case (?profile) {
        if (not profile.isPro) {
          Runtime.trap("Pro upgrade required");
        };
      };
    };

    let data = getUserData(caller);
    let id = data.nextId;

    let newAsset : Asset = {
      id;
      name;
      ticker;
      allocation;
      timeHorizon;
      averageEntryPrice;
    };

    data.assets.add(newAsset);
    let updatedData = {
      data with
      nextId = data.nextId + 1;
    };
    updateUserData(caller, updatedData);
  };

  func calculateTotalAllocation(assets : List.List<Asset>) : Nat {
    var total = 0;
    for (asset in assets.values()) {
      total += asset.allocation;
    };
    total;
  };

  func assetsToArray(assets : List.List<Asset>) : [Asset] {
    assets.toArray();
  };

  public shared ({ caller }) func createPortfolioSnapshot(
    healthScore : Nat,
    risks : [Text],
    opportunities : [Text],
  ) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create portfolio snapshots");
    };

    // Pro-only check for portfolio snapshots
    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User profile not found") };
      case (?profile) {
        if (not profile.isPro) {
          Runtime.trap("Pro upgrade required");
        };
      };
    };

    let data = getUserData(caller);
    let id = data.nextId;

    let snapshot : PortfolioSnapshot = {
      date = Time.now();
      assets = assetsToArray(data.assets);
      allocation = calculateTotalAllocation(data.assets);
      healthScore;
      risks;
      opportunities;
    };

    data.portfolioSnapshots.add(id, snapshot);
    let updatedData = {
      data with
      nextId = data.nextId + 1;
    };
    updateUserData(caller, updatedData);
    id;
  };

  public query ({ caller }) func getPortfolioSnapshot(id : Nat) : async ?PortfolioSnapshot {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view portfolio snapshots");
    };

    let data = getUserData(caller);
    data.portfolioSnapshots.get(id);
  };

  public query ({ caller }) func listPortfolioSnapshots() : async [PortfolioSnapshot] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can list portfolio snapshots");
    };

    let data = getUserData(caller);
    data.portfolioSnapshots.values().toArray();
  };

  // Alert Rules
  public shared ({ caller }) func createAlertRule(condition : Text, frequency : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create alert rules");
    };

    let data = getUserData(caller);
    let id = data.nextId;

    let rule : AlertRule = {
      id;
      condition;
      frequency;
      active = true;
    };

    data.alertRules.add(id, rule);
    let updatedData = {
      data with
      nextId = data.nextId + 1;
    };
    updateUserData(caller, updatedData);
    id;
  };

  public shared ({ caller }) func toggleAlertRule(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can toggle alert rules");
    };

    let data = getUserData(caller);
    switch (data.alertRules.get(id)) {
      case (null) { Runtime.trap("Alert rule not found") };
      case (?rule) {
        let updatedRule = { rule with active = not rule.active };
        data.alertRules.add(id, updatedRule);
        updateUserData(caller, data);
      };
    };
  };

  public query ({ caller }) func getAlertRule(id : Nat) : async AlertRule {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access alert rules");
    };

    let data = getUserData(caller);
    switch (data.alertRules.get(id)) {
      case (null) { Runtime.trap("Alert rule not found") };
      case (?rule) { rule };
    };
  };

  public query ({ caller }) func listAlertRules() : async [(Nat, AlertRule)] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can list alert rules");
    };

    let data = getUserData(caller);
    data.alertRules.toArray();
  };

  // Legacy Profile Settings (deprecated in favor of saveCallerUserProfile)
  public shared ({ caller }) func updateProfile(email : Text, timeZone : Text, topics : [Text]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update profiles");
    };

    let newProfile : UserProfile = {
      email;
      timeZone;
      topics;
      isPro = false;
    };
    userProfiles.add(caller, newProfile);
  };

  public query ({ caller }) func getProfile(email : Text) : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };

    // Find user by email - this is a privacy concern, only allow self-lookup
    let userEntry = userProfiles.entries().find(
      func((principal, profile)) {
        profile.email == email;
      }
    );

    switch (userEntry) {
      case (null) { null };
      case (?(principal, profile)) {
        if (caller != principal and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own profile");
        };
        ?profile;
      };
    };
  };
};

