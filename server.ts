import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import type { FoundItem, Claim, User, CampusStats } from './src/types.ts';
import { INITIAL_FOUND_ITEMS, INITIAL_CLAIMS, PRESET_USERS } from './src/campusData.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Support JSON payloads up to 25MB for image captures and proof receipts
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// In-Memory persistent data store (initialized from rich realistic campus seed data)
let users: User[] = [...PRESET_USERS];
let foundItems: FoundItem[] = JSON.parse(JSON.stringify(INITIAL_FOUND_ITEMS));
let claims: Claim[] = JSON.parse(JSON.stringify(INITIAL_CLAIMS));

// Helper: Token decoding / Mock Auth session
interface AuthenticatedRequest extends Request {
  user?: User;
}

const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return next();
  }
  const token = authHeader.replace(/^Bearer\s+/i, '');
  const foundUser = users.find((u) => u.id === token || u.registration_number === token);
  if (foundUser) {
    req.user = foundUser;
  }
  next();
};

app.use(authMiddleware);

// --- Auth Endpoints ---

function sanitizeUser(user: User): Omit<User, 'password'> {
  const { password, ...safeUser } = user;
  return safeUser;
}

app.post('/api/auth/login', (req: Request, res: Response) => {
  const { registration_number, password, role } = req.body;

  if (!registration_number || !password) {
    return res.status(400).json({ error: 'Registration number and password are required.' });
  }

  const cleanReg = String(registration_number).trim().toUpperCase();

  // Find existing user by registration number
  const user = users.find((u) => u.registration_number.toUpperCase() === cleanReg);

  if (!user) {
    return res.status(404).json({
      error: `No account found with registration ID "${cleanReg}". Please create a student account.`,
    });
  }

  // Strict password verification against the user's specific individual password
  if (user.password && user.password !== String(password).trim()) {
    return res.status(401).json({
      error: `Incorrect password for registration ID "${cleanReg}". Please check your password and try again.`,
    });
  }

  // Role validation if requested
  if (role && user.role !== role) {
    return res.status(403).json({
      error: `This ID belongs to a ${user.role.toUpperCase()} account. Please switch to the ${user.role === 'admin' ? 'Security / Admin' : 'Student'} portal.`,
    });
  }

  return res.json({
    token: user.id,
    user: sanitizeUser(user),
    message: `Logged in as ${user.full_name} (${user.role.toUpperCase()})`,
  });
});

app.post('/api/auth/register', (req: Request, res: Response) => {
  const { full_name, registration_number, email, phone_number, department, password } = req.body;

  if (!full_name || !registration_number || !email || !phone_number || !password) {
    return res.status(400).json({ error: 'All fields (Name, Registration No, Email, Phone, and Password) are required.' });
  }

  const cleanReg = String(registration_number).trim().toUpperCase();
  const cleanPass = String(password).trim();

  if (cleanPass.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
  }

  // Check if registration number already exists
  const existingUser = users.find((u) => u.registration_number.toUpperCase() === cleanReg);
  if (existingUser) {
    return res.status(409).json({
      error: `Registration number "${cleanReg}" is already registered. Please sign in with your password.`,
    });
  }

  // Check if email already exists
  const existingEmail = users.find((u) => u.email.toLowerCase() === String(email).trim().toLowerCase());
  if (existingEmail) {
    return res.status(409).json({
      error: `Email address "${email}" is already associated with an account.`,
    });
  }

  const newUser: User = {
    id: `user-stu-${Date.now()}`,
    registration_number: cleanReg,
    full_name: String(full_name).trim(),
    email: String(email).trim().toLowerCase(),
    phone_number: String(phone_number).trim(),
    role: 'student',
    department: department ? String(department).trim() : 'School of Computer Science & Engineering (Block 34)',
    password: cleanPass,
    created_at: new Date().toISOString(),
  };

  users.push(newUser);

  return res.status(201).json({
    token: newUser.id,
    user: sanitizeUser(newUser),
    message: `Account created successfully for ${newUser.full_name}!`,
  });
});

app.get('/api/auth/me', (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  return res.json({ user: sanitizeUser(req.user) });
});

// --- Found Items Endpoints ---

app.get('/api/items', (req: AuthenticatedRequest, res: Response) => {
  const { search, block, category, status } = req.query;

  let results = [...foundItems];

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    results = results.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.tracking_code.toLowerCase().includes(q) ||
        item.found_location_details.toLowerCase().includes(q) ||
        item.additional_notes.toLowerCase().includes(q)
    );
  }

  if (block && typeof block === 'string' && block !== 'all') {
    results = results.filter((item) => item.found_location_block === block);
  }

  if (category && typeof category === 'string' && category !== 'all') {
    results = results.filter((item) => item.category === category);
  }

  if (status && typeof status === 'string' && status !== 'all') {
    results = results.filter((item) => item.status === status);
  }

  // Privacy protection: omit secret distinguishing marks unless the requester is an admin or the finder
  const requester = req.user;
  const sanitized = results.map((item) => {
    const isAdmin = requester?.role === 'admin';
    const isFinder = requester?.id === item.finder_user_id;

    if (!isAdmin && !isFinder) {
      const { secret_distinguishing_marks, ...rest } = item;
      return {
        ...rest,
        has_secret_challenge: Boolean(secret_distinguishing_marks),
      };
    }
    return item;
  });

  return res.json({ items: sanitized, total: sanitized.length });
});

app.get('/api/items/:id', (req: AuthenticatedRequest, res: Response) => {
  const item = foundItems.find((i) => i.id === req.params.id || i.tracking_code === req.params.id);
  if (!item) {
    return res.status(404).json({ error: 'Found item not located.' });
  }

  const requester = req.user;
  const isAdmin = requester?.role === 'admin';
  const isFinder = requester?.id === item.finder_user_id;

  if (!isAdmin && !isFinder) {
    const { secret_distinguishing_marks, ...rest } = item;
    return res.json({ item: { ...rest, has_secret_challenge: true } });
  }

  return res.json({ item });
});

app.post('/api/items', (req: AuthenticatedRequest, res: Response) => {
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
    finder_phone,
  } = req.body;

  if (!title || !category || !found_location_block || !custody_desk_location) {
    return res.status(400).json({ error: 'Missing required item information fields.' });
  }

  const random4 = Math.floor(1000 + Math.random() * 9000);
  const currentYear = new Date().getFullYear();
  const tracking_code = `CR-${currentYear}-${random4}`;

  const newItem: FoundItem = {
    id: `item-${Date.now()}`,
    tracking_code,
    title: String(title).trim(),
    category,
    image_url: image_url || '',
    found_location_block,
    found_location_details: String(found_location_details || '').trim(),
    custody_desk_location,
    finder_user_id: req.user?.id || `anon-${Date.now()}`,
    finder_name: finder_name || req.user?.full_name || 'Anonymous Good Samaritan',
    finder_reg_no: finder_reg_no || req.user?.registration_number || 'N/A',
    finder_phone: finder_phone || req.user?.phone_number || 'N/A',
    additional_notes: String(additional_notes || '').trim(),
    secret_distinguishing_marks: String(secret_distinguishing_marks || '').trim(),
    status: 'unclaimed',
    created_at: new Date().toISOString(),
  };

  foundItems.unshift(newItem);

  return res.status(201).json({
    item: newItem,
    message: `Item registered under Tracking ID ${newItem.tracking_code}`,
  });
});

// --- Claims Verification Endpoints ---

app.get('/api/claims', (req: AuthenticatedRequest, res: Response) => {
  const { myClaimsOnly } = req.query;
  const requester = req.user;

  let results = [...claims];

  if (myClaimsOnly === 'true' || requester?.role !== 'admin') {
    if (!requester) {
      return res.status(401).json({ error: 'Authentication required to view claims.' });
    }
    results = results.filter((c) => c.claimant_user_id === requester.id || c.claimant_reg_no === requester.registration_number);
  }

  // Include corresponding item data
  const claimsWithItem = results.map((claim) => {
    const item = foundItems.find((i) => i.id === claim.item_id);
    return {
      ...claim,
      item: item || null,
    };
  });

  return res.json({ claims: claimsWithItem, count: claimsWithItem.length });
});

app.post('/api/items/:id/claim', (req: AuthenticatedRequest, res: Response) => {
  const item = foundItems.find((i) => i.id === req.params.id);
  if (!item) {
    return res.status(404).json({ error: 'Item not found.' });
  }

  if (item.status === 'returned') {
    return res.status(400).json({ error: 'This item has already been claimed and returned.' });
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
    claimant_email,
  } = req.body;

  if (!ownership_proof_description || ownership_proof_description.trim().length < 5) {
    return res.status(400).json({ error: 'Please provide detailed proof of ownership describing distinguishing marks.' });
  }

  const newClaim: Claim = {
    id: `claim-${Date.now()}`,
    item_id: item.id,
    item_tracking_code: item.tracking_code,
    item_title: item.title,
    item_category: item.category,
    claimant_user_id: req.user?.id || `claimant-${Date.now()}`,
    claimant_name: claimant_name || req.user?.full_name || 'Claimant',
    claimant_reg_no: claimant_reg_no || req.user?.registration_number || 'REG-PENDING',
    claimant_phone: claimant_phone || req.user?.phone_number || 'N/A',
    claimant_email: claimant_email || req.user?.email || 'N/A',
    ownership_proof_description: String(ownership_proof_description).trim(),
    proof_document_url: proof_document_url || '',
    proof_document_name: proof_document_name || '',
    pickup_scheduled_date: pickup_scheduled_date || new Date().toISOString().split('T')[0],
    pickup_scheduled_time: pickup_scheduled_time || '14:00',
    pickup_desk: item.custody_desk_location,
    verification_status: 'pending',
    created_at: new Date().toISOString(),
  };

  claims.unshift(newClaim);

  // Update item status
  item.status = 'claim_pending';
  item.active_claim_id = newClaim.id;

  return res.status(201).json({
    claim: newClaim,
    item,
    message: 'Ownership claim submitted successfully. Status updated to Claim Under Review.',
  });
});

app.patch('/api/admin/claims/:claimId', (req: AuthenticatedRequest, res: Response) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Elevated administrator permissions required.' });
  }

  const claim = claims.find((c) => c.id === req.params.claimId);
  if (!claim) {
    return res.status(404).json({ error: 'Claim record not found.' });
  }

  const { verification_status, admin_notes } = req.body;
  if (!['approved', 'rejected', 'pending'].includes(verification_status)) {
    return res.status(400).json({ error: 'Invalid verification status.' });
  }

  claim.verification_status = verification_status;
  claim.admin_notes = admin_notes || claim.admin_notes;
  claim.resolved_at = new Date().toISOString();
  claim.verified_by_admin = `${req.user.full_name} (${req.user.registration_number})`;

  const item = foundItems.find((i) => i.id === claim.item_id);
  if (item) {
    if (verification_status === 'rejected') {
      item.status = 'unclaimed';
      item.active_claim_id = undefined;
    } else if (verification_status === 'approved') {
      item.status = 'claim_pending';
    }
  }

  return res.json({ claim, item, message: `Claim updated to ${verification_status.toUpperCase()}.` });
});

app.patch('/api/admin/items/:itemId/return', (req: AuthenticatedRequest, res: Response) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Elevated administrator permissions required.' });
  }

  const item = foundItems.find((i) => i.id === req.params.itemId);
  if (!item) {
    return res.status(404).json({ error: 'Item not found.' });
  }

  const { returned_to_claimant, handover_officer_name, claim_id } = req.body;

  item.status = 'returned';
  item.returned_at = new Date().toISOString();
  item.returned_to_claimant = returned_to_claimant || 'Claimant verified';
  item.handover_officer = handover_officer_name || `${req.user.full_name} (${req.user.registration_number})`;

  if (claim_id) {
    const claim = claims.find((c) => c.id === claim_id);
    if (claim) {
      claim.verification_status = 'approved';
      claim.resolved_at = new Date().toISOString();
    }
  }

  return res.json({ item, message: `Item marked as Claimed & Returned.` });
});

app.get('/api/analytics', (_req: Request, res: Response) => {
  const total = foundItems.length;
  const unclaimed = foundItems.filter((i) => i.status === 'unclaimed').length;
  const pending = foundItems.filter((i) => i.status === 'claim_pending').length;
  const returned = foundItems.filter((i) => i.status === 'returned').length;
  const recoveryRate = total > 0 ? Math.round((returned / total) * 100) : 0;

  const byBlock: Record<string, number> = {};
  const byCategory: Record<string, number> = {};

  foundItems.forEach((i) => {
    byBlock[i.found_location_block] = (byBlock[i.found_location_block] || 0) + 1;
    byCategory[i.category] = (byCategory[i.category] || 0) + 1;
  });

  const stats: CampusStats = {
    total_reported: total,
    unclaimed_count: unclaimed,
    claims_pending: pending,
    returned_count: returned,
    recovery_rate_percent: recoveryRate,
    avg_resolution_hours: 14.8,
    by_block: byBlock,
    by_category: byCategory,
  };

  return res.json(stats);
});

app.post('/api/seed/reset', (_req: Request, res: Response) => {
  users = [...PRESET_USERS];
  foundItems = JSON.parse(JSON.stringify(INITIAL_FOUND_ITEMS));
  claims = JSON.parse(JSON.stringify(INITIAL_CLAIMS));
  return res.json({ message: 'Campus database reset to initial state with 600-acre realistic items.' });
});

// --- Server Lifecycle & Vite Middleware Mounting ---

async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CampusRetriever server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
