/**
 * TripNest Backend API Reference
 * â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
 * This file documents every API endpoint consumed by the frontend.
 * Drop this into your backend project (Express, FastAPI, Django, etc.)
 * and implement each handler against your database.
 *
 * Base URL: process.env.REACT_APP_API_URL  (e.g. http://localhost:8000)
 * Auth:     Bearer JWT in Authorization header
 * Format:   JSON request/response bodies
 * â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
 */

// â”€â”€â”€ AUTH â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

/**
 * POST /api/auth/register
 * Body:    { name, email, password }
 * Returns: { data: { user: User, token: string } }
 */

/**
 * POST /api/auth/login
 * Body:    { email, password }
 * Returns: { data: { user: User, token: string } }
 */

/**
 * POST /api/auth/logout
 * Auth:    Required
 * Returns: { success: true }
 */

/**
 * POST /api/auth/refresh
 * Body:    { refreshToken }
 * Returns: { data: { accessToken, refreshToken, expiresAt } }
 */

/**
 * POST /api/auth/forgot-password
 * Body:    { email }
 * Returns: { success: true }
 */

/**
 * POST /api/auth/reset-password
 * Body:    { token, password }
 * Returns: { success: true }
 */

// â”€â”€â”€ USER â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

/**
 * GET /api/user/profile
 * Auth:    Required
 * Returns: { data: User }
 */

/**
 * PUT /api/user/profile
 * Auth:    Required
 * Body:    Partial<User>
 * Returns: { data: User }
 */

/**
 * PUT /api/user/password
 * Auth:    Required
 * Body:    { currentPassword, newPassword }
 * Returns: { success: true }
 */

// â”€â”€â”€ TRIPS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

/**
 * GET /api/trips
 * Auth:    Required
 * Query:   ?status=planning&page=1&limit=20
 * Returns: { data: Trip[], total, page, limit, hasMore }
 */

/**
 * POST /api/trips
 * Auth:    Required
 * Body:    Partial<Trip>
 * Returns: { data: Trip }
 */

/**
 * GET /api/trips/:id
 * Auth:    Required (or share token in header)
 * Returns: { data: Trip }
 */

/**
 * PUT /api/trips/:id
 * Auth:    Required, must be owner or editor
 * Body:    Partial<Trip>
 * Returns: { data: Trip }
 */

/**
 * DELETE /api/trips/:id
 * Auth:    Required, must be owner
 * Returns: { success: true }
 */

/**
 * POST /api/trips/:id/generate-plan
 * Auth:    Required
 * Body:    TripWizardData  (destination, dates, travelers, budget, styles, etc.)
 * Returns: { data: Trip }  (with populated itinerary)
 * Note:    This is the AI endpoint. Connect to OpenAI / Claude API here.
 */

/**
 * POST /api/trips/:id/share
 * Auth:    Required, must be owner or admin
 * Body:    { email: string, permission: 'view' | 'edit' }
 * Returns: { data: SharedAccess }
 */

/**
 * DELETE /api/trips/:id/share/:accessId
 * Auth:    Required, must be owner
 * Returns: { success: true }
 */

/**
 * GET /api/trips/:id/budget
 * Auth:    Required
 * Returns: { data: Budget }
 */

/**
 * POST /api/trips/:id/budget/items
 * Auth:    Required
 * Body:    BudgetItem
 * Returns: { data: BudgetItem }
 */

/**
 * GET /api/trips/:id/comments
 * Auth:    Required
 * Returns: { data: Comment[] }
 */

/**
 * POST /api/trips/:id/comments
 * Auth:    Required
 * Body:    { content: string, parentId?: string }
 * Returns: { data: Comment }
 */

/**
 * GET /api/trips/:id/activity
 * Auth:    Required
 * Returns: { data: ActivityLog[] }
 */

// â”€â”€â”€ PLACES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

/**
 * GET /api/places/search
 * Auth:    Required
 * Query:   ?query=eiffel+tower&category=attraction&lat=48.8&lng=2.3&radius=5000
 * Returns: { data: Place[] }
 * Note:    Proxy to Google Places API or your own places DB
 */

/**
 * GET /api/places/:id
 * Auth:    Required
 * Returns: { data: Place }
 */

// â”€â”€â”€ PUBLIC â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

/**
 * GET /api/public/trips/:shareToken
 * Auth:    None
 * Returns: { data: Trip }   (only public fields)
 */

// â”€â”€â”€ Response Envelope â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// All endpoints return:
// {
//   success: boolean,
//   data: T,
//   message?: string,     // on success
//   errors?: string[],    // on failure
// }
//
// HTTP Status Codes:
//   200 OK            â€“ success
//   201 Created       â€“ resource created
//   400 Bad Request   â€“ validation error
//   401 Unauthorized  â€“ missing / invalid JWT
//   403 Forbidden     â€“ lacks permission
//   404 Not Found     â€“ resource not found
//   422 Unprocessable â€“ business logic error
//   500 Server Error  â€“ unexpected failure
export {};
