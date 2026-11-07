// server.ts
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

// src/campusData.ts
var PRESET_USERS = [
  {
    id: "user-stu-01",
    registration_number: "12314567",
    full_name: "Tarun Pathak",
    phone_number: "+91 98765 43210",
    email: "tarun.12314567@lpu.in",
    role: "student",
    department: "School of Computer Science & Engineering (Block 34)",
    password: "Tarun@123",
    created_at: "2026-09-12T09:00:00.000Z"
  },
  {
    id: "user-stu-02",
    registration_number: "12317890",
    full_name: "Ananya Sharma",
    phone_number: "+91 98123 45678",
    email: "ananya.12317890@lpu.in",
    role: "student",
    department: "Mittal School of Business (Block 32)",
    password: "Ananya@123",
    created_at: "2026-09-15T11:30:00.000Z"
  },
  {
    id: "user-adm-01",
    registration_number: "ADM-SEC-091",
    full_name: "Officer Vikram Rathore",
    phone_number: "+91 94440 12345",
    email: "security.lead@lpu.co.in",
    role: "admin",
    department: "Central Security & Vigilance (Main Gate 1)",
    password: "Admin@Gate1",
    created_at: "2026-01-10T08:00:00.000Z"
  },
  {
    id: "user-adm-02",
    registration_number: "ADM-SEC-104",
    full_name: "Dr. S. K. Mukherjee",
    phone_number: "+91 94440 67890",
    email: "warden.bh@lpu.co.in",
    role: "admin",
    department: "Chief Warden Office (BH-3 Quad)",
    password: "Warden@BH3",
    created_at: "2026-02-14T10:15:00.000Z"
  }
];
var INITIAL_FOUND_ITEMS = [
  {
    id: "item-001",
    tracking_code: "CR-2026-8492",
    title: "TI-Nspire CX II CAS Scientific Graphing Calculator",
    category: "Electronics & Gadgets",
    image_url: "/src/assets/images/item_found_calculator_1794051824195.jpg",
    found_location_block: "Central Library (Blocks 13 & 14 Reading Commons)",
    found_location_details: "2nd Floor Quiet Study Commons, Desk #14 near the west bay window, left beside math reference notebook.",
    custody_desk_location: "Central Library Reception (Block 13/14)",
    finder_user_id: "user-stu-02",
    finder_name: "Ananya Sharma",
    finder_reg_no: "12317890",
    finder_phone: "+91 98123 45678",
    additional_notes: "Black casing with slide-on protective hard cover. Screen turns on and battery is at 64%.",
    secret_distinguishing_marks: 'Has a small holographic NASA sticker on the underside battery latch and the name etched inside the cover begins with "K.V."',
    status: "unclaimed",
    created_at: "2026-11-06T14:20:00.000Z"
  },
  {
    id: "item-002",
    tracking_code: "CR-2026-8493",
    title: "Brown Distressed Leather Bi-Fold Wallet",
    category: "Wallet/Purse",
    image_url: "/src/assets/images/item_found_leather_wallet_1794051824462.jpg",
    found_location_block: "Uni-Mall & Multiplex Food Court",
    found_location_details: "Found under booth table 4 opposite the Subway outlet during lunchtime rush.",
    custody_desk_location: "Uni-Mall Security Control Desk",
    finder_user_id: "user-adm-01",
    finder_name: "Officer Vikram Rathore",
    finder_reg_no: "ADM-SEC-091",
    finder_phone: "+91 94440 12345",
    additional_notes: "Contains metro card and several folded papers. All cash and bank cards secured in locked security safe.",
    secret_distinguishing_marks: "Contains exactly two \u20B9500 notes, one \u20B9100 note, an LPU gym subscription receipt, and a passport-sized photograph of a golden retriever.",
    status: "claim_pending",
    active_claim_id: "claim-001",
    created_at: "2026-11-06T16:45:00.000Z"
  },
  {
    id: "item-003",
    tracking_code: "CR-2026-8494",
    title: "Apple AirPods Pro 2 White Case with Single Bud",
    category: "Electronics & Gadgets",
    image_url: "/src/assets/images/item_found_wireless_earbuds_1794051826035.jpg",
    found_location_block: "Block 34 (School of Computer Science & IT)",
    found_location_details: "3rd Floor Software Lab 304, on the high desk keyboard tray near server workstation 12.",
    custody_desk_location: "Block 34 Helpdesk (CSE/IT)",
    finder_user_id: "user-stu-01",
    finder_name: "Tarun Pathak",
    finder_reg_no: "12314567",
    finder_phone: "+91 98765 43210",
    additional_notes: "Case is charging via USB-C. Right earbud present inside; left earbud was found on desk.",
    secret_distinguishing_marks: 'Engraved with tiny custom text "LPU-CSE-26" on the hinge metal plate, and has a faint scratch on bottom corner.',
    status: "unclaimed",
    created_at: "2026-11-07T08:15:00.000Z"
  },
  {
    id: "item-004",
    tracking_code: "CR-2026-8495",
    title: "LPU RFID Student Smart Card & Yellow University Lanyard",
    category: "Student ID Card",
    image_url: "",
    found_location_block: "Main Gate 1 (GT Road Turnstiles & Security)",
    found_location_details: "Fell near Gate 1 biometric pedestrian turnstile lane 3 during 8:50 AM morning entry.",
    custody_desk_location: "Central Security Office (Main Gate 1)",
    finder_user_id: "user-adm-01",
    finder_name: "Officer Vikram Rathore",
    finder_reg_no: "ADM-SEC-091",
    finder_phone: "+91 94440 12345",
    additional_notes: "Official Lovely Professional University Smart Identity Card with bus pass hologram attached.",
    secret_distinguishing_marks: "Student registration barcode ends in ...9412, photo has navy blue blazer, valid batch 2023-2027.",
    status: "unclaimed",
    created_at: "2026-11-07T09:10:00.000Z"
  },
  {
    id: "item-005",
    tracking_code: "CR-2026-8496",
    title: "Royal Enfield Bike Keys with BH-3 Tag & Red Carabiner",
    category: "Keys",
    image_url: "",
    found_location_block: "Shanti Devi Mittal Indoor Sports Complex",
    found_location_details: "Found on the top wooden bleacher row near Badminton Court 3 scoreboard.",
    custody_desk_location: "Shanti Devi Mittal Sports Complex Desk",
    finder_user_id: "user-stu-02",
    finder_name: "Ananya Sharma",
    finder_reg_no: "12317890",
    finder_phone: "+91 98123 45678",
    additional_notes: "Two keys attached: one bike ignition key and one cylindrical dorm padlock key.",
    secret_distinguishing_marks: "Has a small braided red parachute-cord tag with metal badge stamped with room 314-B.",
    status: "returned",
    returned_at: "2026-11-06T18:30:00.000Z",
    returned_to_claimant: "Rohan Mehra (12310112)",
    handover_officer: "Officer Vikram Rathore (ADM-SEC-091)",
    created_at: "2026-11-05T17:00:00.000Z"
  },
  {
    id: "item-006",
    tracking_code: "CR-2026-8497",
    title: "Spiral Bound Robotics & Embedded Systems Lab Manual",
    category: "Documents/Notebooks",
    image_url: "",
    found_location_block: "Block 38 (Computer Applications & Robotics)",
    found_location_details: "Ground floor robotics hall 101, podium table near projector controls.",
    custody_desk_location: "Block 34 Helpdesk (CSE/IT)",
    finder_user_id: "user-stu-01",
    finder_name: "Tarun Pathak",
    finder_reg_no: "12314567",
    finder_phone: "+91 98765 43210",
    additional_notes: "Handwritten code observations for Experiments 1 through 8 with faculty signatures.",
    secret_distinguishing_marks: "Index page has approval stamp from Dr. Harpreet Singh with date 28 Oct 2026 and blue ink stain on margin.",
    status: "unclaimed",
    created_at: "2026-11-07T10:05:00.000Z"
  }
];
var INITIAL_CLAIMS = [
  {
    id: "claim-001",
    item_id: "item-002",
    item_tracking_code: "CR-2026-8493",
    item_title: "Brown Distressed Leather Bi-Fold Wallet",
    item_category: "Wallet/Purse",
    claimant_user_id: "user-stu-01",
    claimant_name: "Tarun Pathak",
    claimant_reg_no: "12314567",
    claimant_phone: "+91 98765 43210",
    claimant_email: "tarun.12314567@lpu.in",
    ownership_proof_description: "The wallet is a Timberland vintage brown leather. Inside the cash pocket is \u20B91,100 (two 500 bills, one 100 bill). In the card pocket is my LPU gym subscription receipt and a photo of my dog Rocky.",
    pickup_scheduled_date: "2026-11-08",
    pickup_scheduled_time: "14:30",
    pickup_desk: "Uni-Mall Security Control Desk",
    verification_status: "pending",
    admin_notes: "Claimant description matches physical wallet contents exactly. Waiting for in-person physical ID verification at Uni-Mall security counter.",
    created_at: "2026-11-06T19:30:00.000Z"
  }
];

// server.ts
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var app = express();
var PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3e3;
var isProduction = process.env.NODE_ENV === "production";
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));
var users = [...PRESET_USERS];
var foundItems = JSON.parse(JSON.stringify(INITIAL_FOUND_ITEMS));
var claims = JSON.parse(JSON.stringify(INITIAL_CLAIMS));
var authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return next();
  }
  const token = authHeader.replace(/^Bearer\s+/i, "");
  const foundUser = users.find((u) => u.id === token || u.registration_number === token);
  if (foundUser) {
    req.user = foundUser;
  }
  next();
};
app.use(authMiddleware);
function sanitizeUser(user) {
  const { password, ...safeUser } = user;
  return safeUser;
}
app.post("/api/auth/login", (req, res) => {
  const { registration_number, password, role } = req.body;
  if (!registration_number || !password) {
    return res.status(400).json({ error: "Registration number and password are required." });
  }
  const cleanReg = String(registration_number).trim().toUpperCase();
  const user = users.find((u) => u.registration_number.toUpperCase() === cleanReg);
  if (!user) {
    return res.status(404).json({
      error: `No account found with registration ID "${cleanReg}". Please create a student account.`
    });
  }
  if (user.password && user.password !== String(password).trim()) {
    return res.status(401).json({
      error: `Incorrect password for registration ID "${cleanReg}". Please check your password and try again.`
    });
  }
  if (role && user.role !== role) {
    return res.status(403).json({
      error: `This ID belongs to a ${user.role.toUpperCase()} account. Please switch to the ${user.role === "admin" ? "Security / Admin" : "Student"} portal.`
    });
  }
  return res.json({
    token: user.id,
    user: sanitizeUser(user),
    message: `Logged in as ${user.full_name} (${user.role.toUpperCase()})`
  });
});
app.post("/api/auth/register", (req, res) => {
  const { full_name, registration_number, email, phone_number, department, password } = req.body;
  if (!full_name || !registration_number || !email || !phone_number || !password) {
    return res.status(400).json({ error: "All fields (Name, Registration No, Email, Phone, and Password) are required." });
  }
  const cleanReg = String(registration_number).trim().toUpperCase();
  const cleanPass = String(password).trim();
  if (cleanPass.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters long." });
  }
  const existingUser = users.find((u) => u.registration_number.toUpperCase() === cleanReg);
  if (existingUser) {
    return res.status(409).json({
      error: `Registration number "${cleanReg}" is already registered. Please sign in with your password.`
    });
  }
  const existingEmail = users.find((u) => u.email.toLowerCase() === String(email).trim().toLowerCase());
  if (existingEmail) {
    return res.status(409).json({
      error: `Email address "${email}" is already associated with an account.`
    });
  }
  const newUser = {
    id: `user-stu-${Date.now()}`,
    registration_number: cleanReg,
    full_name: String(full_name).trim(),
    email: String(email).trim().toLowerCase(),
    phone_number: String(phone_number).trim(),
    role: "student",
    department: department ? String(department).trim() : "School of Computer Science & Engineering (Block 34)",
    password: cleanPass,
    created_at: (/* @__PURE__ */ new Date()).toISOString()
  };
  users.push(newUser);
  return res.status(201).json({
    token: newUser.id,
    user: sanitizeUser(newUser),
    message: `Account created successfully for ${newUser.full_name}!`
  });
});
app.get("/api/auth/me", (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  return res.json({ user: sanitizeUser(req.user) });
});
app.get("/api/items", (req, res) => {
  const { search, block, category, status } = req.query;
  let results = [...foundItems];
  if (search && typeof search === "string") {
    const q = search.toLowerCase();
    results = results.filter(
      (item) => item.title.toLowerCase().includes(q) || item.tracking_code.toLowerCase().includes(q) || item.found_location_details.toLowerCase().includes(q) || item.additional_notes.toLowerCase().includes(q)
    );
  }
  if (block && typeof block === "string" && block !== "all") {
    results = results.filter((item) => item.found_location_block === block);
  }
  if (category && typeof category === "string" && category !== "all") {
    results = results.filter((item) => item.category === category);
  }
  if (status && typeof status === "string" && status !== "all") {
    results = results.filter((item) => item.status === status);
  }
  const requester = req.user;
  const sanitized = results.map((item) => {
    const isAdmin = requester?.role === "admin";
    const isFinder = requester?.id === item.finder_user_id;
    if (!isAdmin && !isFinder) {
      const { secret_distinguishing_marks, ...rest } = item;
      return {
        ...rest,
        has_secret_challenge: Boolean(secret_distinguishing_marks)
      };
    }
    return item;
  });
  return res.json({ items: sanitized, total: sanitized.length });
});
app.get("/api/items/:id", (req, res) => {
  const item = foundItems.find((i) => i.id === req.params.id || i.tracking_code === req.params.id);
  if (!item) {
    return res.status(404).json({ error: "Found item not located." });
  }
  const requester = req.user;
  const isAdmin = requester?.role === "admin";
  const isFinder = requester?.id === item.finder_user_id;
  if (!isAdmin && !isFinder) {
    const { secret_distinguishing_marks, ...rest } = item;
    return res.json({ item: { ...rest, has_secret_challenge: true } });
  }
  return res.json({ item });
});
app.post("/api/items", (req, res) => {
  const {
    title,
    category,
    image_url,
    found_location_block,
    found_location_details,
    custody_desk_location,
    additional_notes,
    secret_distinguishing_marks,
    finder_name,
    finder_reg_no,
    finder_phone
  } = req.body;
  if (!title || !category || !found_location_block || !custody_desk_location) {
    return res.status(400).json({ error: "Missing required item information fields." });
  }
  const random4 = Math.floor(1e3 + Math.random() * 9e3);
  const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
  const tracking_code = `CR-${currentYear}-${random4}`;
  const newItem = {
    id: `item-${Date.now()}`,
    tracking_code,
    title: String(title).trim(),
    category,
    image_url: image_url || "",
    found_location_block,
    found_location_details: String(found_location_details || "").trim(),
    custody_desk_location,
    finder_user_id: req.user?.id || `anon-${Date.now()}`,
    finder_name: finder_name || req.user?.full_name || "Anonymous Good Samaritan",
    finder_reg_no: finder_reg_no || req.user?.registration_number || "N/A",
    finder_phone: finder_phone || req.user?.phone_number || "N/A",
    additional_notes: String(additional_notes || "").trim(),
    secret_distinguishing_marks: String(secret_distinguishing_marks || "").trim(),
    status: "unclaimed",
    created_at: (/* @__PURE__ */ new Date()).toISOString()
  };
  foundItems.unshift(newItem);
  return res.status(201).json({
    item: newItem,
    message: `Item registered under Tracking ID ${newItem.tracking_code}`
  });
});
app.get("/api/claims", (req, res) => {
  const { myClaimsOnly } = req.query;
  const requester = req.user;
  let results = [...claims];
  if (myClaimsOnly === "true" || requester?.role !== "admin") {
    if (!requester) {
      return res.status(401).json({ error: "Authentication required to view claims." });
    }
    results = results.filter((c) => c.claimant_user_id === requester.id || c.claimant_reg_no === requester.registration_number);
  }
  const claimsWithItem = results.map((claim) => {
    const item = foundItems.find((i) => i.id === claim.item_id);
    return {
      ...claim,
      item: item || null
    };
  });
  return res.json({ claims: claimsWithItem, count: claimsWithItem.length });
});
app.post("/api/items/:id/claim", (req, res) => {
  const item = foundItems.find((i) => i.id === req.params.id);
  if (!item) {
    return res.status(404).json({ error: "Item not found." });
  }
  if (item.status === "returned") {
    return res.status(400).json({ error: "This item has already been claimed and returned." });
  }
  const {
    ownership_proof_description,
    proof_document_url,
    proof_document_name,
    pickup_scheduled_date,
    pickup_scheduled_time,
    claimant_name,
    claimant_reg_no,
    claimant_phone,
    claimant_email
  } = req.body;
  if (!ownership_proof_description || ownership_proof_description.trim().length < 5) {
    return res.status(400).json({ error: "Please provide detailed proof of ownership describing distinguishing marks." });
  }
  const newClaim = {
    id: `claim-${Date.now()}`,
    item_id: item.id,
    item_tracking_code: item.tracking_code,
    item_title: item.title,
    item_category: item.category,
    claimant_user_id: req.user?.id || `claimant-${Date.now()}`,
    claimant_name: claimant_name || req.user?.full_name || "Claimant",
    claimant_reg_no: claimant_reg_no || req.user?.registration_number || "REG-PENDING",
    claimant_phone: claimant_phone || req.user?.phone_number || "N/A",
    claimant_email: claimant_email || req.user?.email || "N/A",
    ownership_proof_description: String(ownership_proof_description).trim(),
    proof_document_url: proof_document_url || "",
    proof_document_name: proof_document_name || "",
    pickup_scheduled_date: pickup_scheduled_date || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    pickup_scheduled_time: pickup_scheduled_time || "14:00",
    pickup_desk: item.custody_desk_location,
    verification_status: "pending",
    created_at: (/* @__PURE__ */ new Date()).toISOString()
  };
  claims.unshift(newClaim);
  item.status = "claim_pending";
  item.active_claim_id = newClaim.id;
  return res.status(201).json({
    claim: newClaim,
    item,
    message: "Ownership claim submitted successfully. Status updated to Claim Under Review."
  });
});
app.patch("/api/admin/claims/:claimId", (req, res) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ error: "Elevated administrator permissions required." });
  }
  const claim = claims.find((c) => c.id === req.params.claimId);
  if (!claim) {
    return res.status(404).json({ error: "Claim record not found." });
  }
  const { verification_status, admin_notes } = req.body;
  if (!["approved", "rejected", "pending"].includes(verification_status)) {
    return res.status(400).json({ error: "Invalid verification status." });
  }
  claim.verification_status = verification_status;
  claim.admin_notes = admin_notes || claim.admin_notes;
  claim.resolved_at = (/* @__PURE__ */ new Date()).toISOString();
  claim.verified_by_admin = `${req.user.full_name} (${req.user.registration_number})`;
  const item = foundItems.find((i) => i.id === claim.item_id);
  if (item) {
    if (verification_status === "rejected") {
      item.status = "unclaimed";
      item.active_claim_id = void 0;
    } else if (verification_status === "approved") {
      item.status = "claim_pending";
    }
  }
  return res.json({ claim, item, message: `Claim updated to ${verification_status.toUpperCase()}.` });
});
app.patch("/api/admin/items/:itemId/return", (req, res) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ error: "Elevated administrator permissions required." });
  }
  const item = foundItems.find((i) => i.id === req.params.itemId);
  if (!item) {
    return res.status(404).json({ error: "Item not found." });
  }
  const { returned_to_claimant, handover_officer_name, claim_id } = req.body;
  item.status = "returned";
  item.returned_at = (/* @__PURE__ */ new Date()).toISOString();
  item.returned_to_claimant = returned_to_claimant || "Claimant verified";
  item.handover_officer = handover_officer_name || `${req.user.full_name} (${req.user.registration_number})`;
  if (claim_id) {
    const claim = claims.find((c) => c.id === claim_id);
    if (claim) {
      claim.verification_status = "approved";
      claim.resolved_at = (/* @__PURE__ */ new Date()).toISOString();
    }
  }
  return res.json({ item, message: `Item marked as Claimed & Returned.` });
});
app.get("/api/analytics", (_req, res) => {
  const total = foundItems.length;
  const unclaimed = foundItems.filter((i) => i.status === "unclaimed").length;
  const pending = foundItems.filter((i) => i.status === "claim_pending").length;
  const returned = foundItems.filter((i) => i.status === "returned").length;
  const recoveryRate = total > 0 ? Math.round(returned / total * 100) : 0;
  const byBlock = {};
  const byCategory = {};
  foundItems.forEach((i) => {
    byBlock[i.found_location_block] = (byBlock[i.found_location_block] || 0) + 1;
    byCategory[i.category] = (byCategory[i.category] || 0) + 1;
  });
  const stats = {
    total_reported: total,
    unclaimed_count: unclaimed,
    claims_pending: pending,
    returned_count: returned,
    recovery_rate_percent: recoveryRate,
    avg_resolution_hours: 14.8,
    by_block: byBlock,
    by_category: byCategory
  };
  return res.json(stats);
});
app.post("/api/seed/reset", (_req, res) => {
  users = [...PRESET_USERS];
  foundItems = JSON.parse(JSON.stringify(INITIAL_FOUND_ITEMS));
  claims = JSON.parse(JSON.stringify(INITIAL_CLAIMS));
  return res.json({ message: "Campus database reset to initial state with 600-acre realistic items." });
});
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, "dist")));
    app.get("*", (_req, res) => {
      res.sendFile(path.resolve(__dirname, "dist", "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CampusRetriever server running on http://0.0.0.0:${PORT}`);
  });
}
startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
