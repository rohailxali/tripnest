/**
 * Itinerary Generator Service
 * ─────────────────────────────────────────────────────────────────────────────
 * Generates a deterministic, rule-based day-by-day itinerary from trip form
 * inputs. No external AI or API calls are needed — all logic is local.
 *
 * Factors that influence output:
 *  - destination      → location-specific activity names
 *  - trip duration    → number of days generated
 *  - travel styles    → activity themes (adventure, cultural, foodie, etc.)
 *  - trip type        → group composition adjustments
 *  - budget range     → cost tier of suggested activities
 *  - preferences      → additional filtering / emphasis
 *  - special requests → appended to day notes
 */

import { ItineraryDay, Activity, ActivityType, TripWizardData, TravelStyle } from '../types';

// ─── Utility ──────────────────────────────────────────────────────────────────

/** Produce a stable pseudo-random number from a seed string + index. */
function seededIndex(seed: string, index: number, max: number): number {
  let hash = 0;
  const str = seed + index;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) & 0xffffffff;
  }
  return Math.abs(hash) % max;
}

function pick<T>(arr: T[], seed: string, index: number): T {
  return arr[seededIndex(seed, index, arr.length)];
}

/** Add days to a date string (YYYY-MM-DD) without timezone shifting. */
function addDays(dateStr: string, days: number): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(y, m - 1, d + days);
  return dt.toISOString().split('T')[0];
}

/** Determine trip duration in days (inclusive: day 1 = arrival, last day = departure) */
function tripDays(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const nights = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(1, nights + 1); // always at least 1 day
}

/** Extract the city/country from a destination string like "Paris, France" → "Paris" */
function cityName(destination: string): string {
  return destination.split(',')[0].trim();
}

// ─── Budget Tiers ─────────────────────────────────────────────────────────────

type BudgetTier = 'low' | 'mid' | 'high';

function getBudgetTier(budgetMax: number): BudgetTier {
  if (budgetMax <= 1000) return 'low';
  if (budgetMax <= 4000) return 'mid';
  return 'high';
}

/** Pick an activity cost appropriate to the budget tier. */
function activityCost(tier: BudgetTier, base: number): number {
  const multipliers: Record<BudgetTier, number> = { low: 0.4, mid: 1, high: 2.5 };
  return Math.round(base * multipliers[tier]);
}

// ─── Activity Templates ───────────────────────────────────────────────────────

/**
 * Each template contains tokens:
 *   {city}  → replaced with destination city name
 *
 * Templates are grouped by style / activity category so the generator can
 * pick appropriately based on the user's selected travel styles.
 */

interface ActivityTemplate {
  name: string;
  description: string;
  location: string;
  duration: string;
  baseCost: number;
  type: ActivityType;
}

const TEMPLATES: Record<string, ActivityTemplate[]> = {
  // ── Morning ──────────────────────────────────────────────────────────────
  morning_cultural: [
    { name: 'Visit the Historic Old Town', description: 'Explore the historic streets and architecture of {city}\'s old quarter, taking in centuries of culture and local life.', location: '{city} Old Town', duration: '2–3 hrs', baseCost: 0, type: 'attraction' },
    { name: 'National Museum Tour', description: 'Start the day at {city}\'s premier national museum, covering local history, art, and archaeology.', location: '{city} National Museum', duration: '2 hrs', baseCost: 15, type: 'attraction' },
    { name: 'Morning Heritage Walk', description: 'Guided walking tour through {city}\'s UNESCO-listed heritage sites and iconic landmarks.', location: '{city} Heritage District', duration: '2.5 hrs', baseCost: 20, type: 'activity' },
    { name: 'Art Gallery Opening Hours', description: 'Beat the crowds and visit {city}\'s top contemporary art gallery first thing in the morning.', location: '{city} Art Gallery', duration: '1.5 hrs', baseCost: 12, type: 'attraction' },
  ],
  morning_adventure: [
    { name: 'Sunrise Hike', description: 'Rise early and hike to a scenic viewpoint above {city} for breathtaking sunrise photos and fresh mountain air.', location: '{city} Highlands Trail', duration: '3 hrs', baseCost: 10, type: 'activity' },
    { name: 'Kayaking on the River', description: 'Morning kayaking session along the river that winds through {city}, with local guides pointing out wildlife.', location: '{city} River Launch Point', duration: '2.5 hrs', baseCost: 40, type: 'activity' },
    { name: 'Cycling Tour', description: 'Rent a bike and explore the outskirts of {city} on a guided cycling route, including off-road sections.', location: '{city} Cycling Hub', duration: '3 hrs', baseCost: 25, type: 'activity' },
    { name: 'Rock Climbing Session', description: 'Introductory rock climbing session at a natural crag near {city} — suitable for all fitness levels.', location: '{city} Climbing Area', duration: '3 hrs', baseCost: 50, type: 'activity' },
  ],
  morning_relaxation: [
    { name: 'Beachfront Yoga & Meditation', description: 'Start the day peacefully with a guided yoga session on the beach near {city}, followed by a short meditation.', location: '{city} Beach', duration: '1.5 hrs', baseCost: 15, type: 'activity' },
    { name: 'Leisurely Café Breakfast', description: 'Spend a relaxed morning at one of {city}\'s beloved neighbourhood cafés, savoring local pastries and coffee.', location: '{city} Café District', duration: '1.5 hrs', baseCost: 12, type: 'food' },
    { name: 'Botanical Garden Stroll', description: 'A peaceful morning walk through {city}\'s stunning botanical gardens — perfect for unwinding and connecting with nature.', location: '{city} Botanical Gardens', duration: '2 hrs', baseCost: 5, type: 'attraction' },
    { name: 'Morning Spa Treatment', description: 'Indulge in a morning wellness treatment at a local spa, starting the day with total relaxation.', location: '{city} Wellness Spa', duration: '2 hrs', baseCost: 60, type: 'activity' },
  ],
  morning_food: [
    { name: 'Local Market Breakfast Tour', description: 'Explore {city}\'s vibrant morning market, sampling street foods, fresh produce, and local specialties with a food guide.', location: '{city} Central Market', duration: '2 hrs', baseCost: 20, type: 'food' },
    { name: 'Artisan Bakery Visit', description: 'Visit a beloved local bakery famed across {city} for its traditional breads, pastries, and morning buns.', location: '{city} Artisan Bakery', duration: '1 hr', baseCost: 10, type: 'food' },
    { name: 'Cooking Class: Local Breakfast', description: 'Learn to cook a traditional {city} breakfast from a local chef in a hands-on morning cooking class.', location: '{city} Culinary Studio', duration: '3 hrs', baseCost: 65, type: 'activity' },
    { name: 'Coffee Roastery Tour', description: 'Discover the specialty coffee scene in {city} with a behind-the-scenes roastery tour and cupping session.', location: '{city} Coffee Roastery', duration: '1.5 hrs', baseCost: 18, type: 'food' },
  ],
  morning_nature: [
    { name: 'Birdwatching at Nature Reserve', description: 'Early morning guided birdwatching walk at the nature reserve on the edge of {city}, spotting rare local species.', location: '{city} Nature Reserve', duration: '2.5 hrs', baseCost: 15, type: 'activity' },
    { name: 'Waterfall Trek', description: 'Hike to a popular waterfall near {city} that is best visited in the morning before the crowds arrive.', location: '{city} Waterfall Trail', duration: '3 hrs', baseCost: 5, type: 'activity' },
    { name: 'Sunrise at the Viewpoint', description: 'Wake early to catch the sunrise from {city}\'s famous hilltop viewpoint — an unforgettable start to the day.', location: '{city} Viewpoint Hill', duration: '2 hrs', baseCost: 0, type: 'attraction' },
    { name: 'Riverside Picnic & Nature Walk', description: 'Pack a light breakfast and take a quiet nature walk along the river banks near {city}.', location: '{city} Riverside Park', duration: '2 hrs', baseCost: 0, type: 'activity' },
  ],

  // ── Afternoon ─────────────────────────────────────────────────────────────
  afternoon_cultural: [
    { name: 'Palace & Royal Grounds Visit', description: 'Tour the grand palace or royal estate near {city} — a window into the country\'s regal history.', location: '{city} Royal Palace', duration: '2.5 hrs', baseCost: 18, type: 'attraction' },
    { name: 'Local Handicraft Workshop', description: 'Participate in a hands-on workshop learning a traditional craft unique to {city} and its region.', location: '{city} Craft Centre', duration: '2 hrs', baseCost: 30, type: 'activity' },
    { name: 'Religious Site & Temple Tour', description: 'Visit the most revered religious sites in {city}, exploring their architecture, history, and spiritual significance.', location: '{city} Temple District', duration: '2 hrs', baseCost: 0, type: 'attraction' },
    { name: 'Historical Cemetery Walk', description: 'A surprisingly moving self-guided walk through {city}\'s historic cemetery, whose monuments tell the story of the city.', location: '{city} Old Cemetery', duration: '1.5 hrs', baseCost: 0, type: 'attraction' },
  ],
  afternoon_adventure: [
    { name: 'Zip-Lining Through the Canopy', description: 'Soar through lush treetops on a zip-line adventure outside {city}, with multiple lines and stunning views.', location: '{city} Adventure Park', duration: '3 hrs', baseCost: 75, type: 'activity' },
    { name: 'White-Water Rafting', description: 'Tackle the rapids of the river near {city} on an exhilarating guided white-water rafting trip.', location: '{city} River Rafting Base', duration: '4 hrs', baseCost: 80, type: 'activity' },
    { name: 'Paragliding Flight', description: 'Experience a tandem paragliding flight over {city} with a certified instructor — no experience needed.', location: '{city} Paragliding Launch', duration: '2 hrs', baseCost: 120, type: 'activity' },
    { name: 'Afternoon Surf Lesson', description: 'Take a beginner surf lesson at the nearest beach to {city} from a patient local instructor.', location: '{city} Surf School', duration: '2.5 hrs', baseCost: 55, type: 'activity' },
  ],
  afternoon_relaxation: [
    { name: 'Poolside Afternoon at Resort', description: 'Spend a relaxed afternoon at a beautiful resort pool near {city}, sipping drinks and doing absolutely nothing.', location: '{city} Resort Pool', duration: '3 hrs', baseCost: 25, type: 'activity' },
    { name: 'Traditional Massage', description: 'Restore your body with a traditional 90-minute massage at a highly-rated wellness centre in {city}.', location: '{city} Wellness Centre', duration: '1.5 hrs', baseCost: 45, type: 'activity' },
    { name: 'Scenic Lakeside Walk', description: 'A gentle, unhurried walk along the lake near {city}, enjoying the scenery and fresh air.', location: '{city} Lakeside Promenade', duration: '2 hrs', baseCost: 0, type: 'activity' },
    { name: 'Afternoon Hammam Visit', description: 'Rejuvenate at a traditional hammam (bathhouse) in {city}, an authentic and deeply relaxing ritual.', location: '{city} Traditional Hammam', duration: '2 hrs', baseCost: 35, type: 'activity' },
  ],
  afternoon_food: [
    { name: 'Street Food Safari', description: 'Wander through the best street food stalls in {city} with a local foodie guide, tasting as you go.', location: '{city} Street Food Alley', duration: '2.5 hrs', baseCost: 30, type: 'food' },
    { name: 'Wine or Beer Tasting', description: 'Visit a local winery or craft brewery near {city} for a guided tasting of regional wines or ales.', location: '{city} City Winery', duration: '2 hrs', baseCost: 35, type: 'food' },
    { name: 'Afternoon Tea Experience', description: 'Enjoy a classic afternoon tea at one of {city}\'s most elegant hotels or tea rooms.', location: '{city} Grand Tea Room', duration: '1.5 hrs', baseCost: 40, type: 'food' },
    { name: 'Spice Market & Tasting Tour', description: 'A sensory journey through {city}\'s historic spice market, with tastings and explanations from a local guide.', location: '{city} Spice Market', duration: '2 hrs', baseCost: 25, type: 'food' },
  ],
  afternoon_shopping: [
    { name: 'Designer District Exploration', description: 'Browse {city}\'s upscale designer boutiques and flagship stores in the most stylish part of town.', location: '{city} Fashion District', duration: '2.5 hrs', baseCost: 0, type: 'shopping' },
    { name: 'Local Souvenir Market', description: 'Hunt for the perfect locally-made souvenirs and gifts at {city}\'s most popular craft and souvenir market.', location: '{city} Souvenir Market', duration: '2 hrs', baseCost: 30, type: 'shopping' },
    { name: 'Antique Quarter Browse', description: 'Explore {city}\'s fascinating antique shops, galleries, and flea markets — ideal for unique finds.', location: '{city} Antique Quarter', duration: '2 hrs', baseCost: 20, type: 'shopping' },
    { name: 'Mall & Shopping Centre', description: 'Spend the afternoon in {city}\'s premier shopping mall, combining local and international brands under one roof.', location: '{city} Grand Mall', duration: '3 hrs', baseCost: 0, type: 'shopping' },
  ],

  // ── Evening ───────────────────────────────────────────────────────────────
  evening_cultural: [
    { name: 'Traditional Dinner Show', description: 'Enjoy a locally-cooked dinner accompanied by traditional folk music and dance in {city}.', location: '{city} Cultural Centre', duration: '3 hrs', baseCost: 55, type: 'entertainment' },
    { name: 'Open-Air Film Screening', description: 'Catch an outdoor film screening in one of {city}\'s squares or parks — a beloved local summer tradition.', location: '{city} Open-Air Cinema', duration: '2.5 hrs', baseCost: 12, type: 'entertainment' },
    { name: 'Classical Concert or Opera', description: 'Spend the evening at the grand opera house or concert hall in {city} for a world-class cultural performance.', location: '{city} Opera House', duration: '3 hrs', baseCost: 70, type: 'entertainment' },
    { name: 'Night Visit to Illuminated Monuments', description: 'See {city}\'s iconic landmarks beautifully lit up after dark — a completely different perspective on the city.', location: '{city} Main Monuments', duration: '2 hrs', baseCost: 0, type: 'attraction' },
  ],
  evening_foodie: [
    { name: 'Fine Dining Restaurant', description: 'Book a table at one of {city}\'s most celebrated restaurants — a culinary highlight of any trip.', location: '{city} Restaurant Row', duration: '2.5 hrs', baseCost: 90, type: 'food' },
    { name: 'Local Neighbourhood Tavern', description: 'Discover a beloved, unpretentious local restaurant in {city}\'s residential quarters — often the best food in town.', location: '{city} Local Quarter', duration: '2 hrs', baseCost: 30, type: 'food' },
    { name: 'Sunset Dinner Cruise', description: 'Enjoy dinner and drinks on the water as the sun sets over {city}\'s skyline — one of the most romantic options.', location: '{city} Marina', duration: '3 hrs', baseCost: 80, type: 'food' },
    { name: 'Night Hawker Stalls', description: 'Experience {city}\'s famous night market food stalls — cheap, delicious, and packed with local atmosphere.', location: '{city} Night Market', duration: '2 hrs', baseCost: 15, type: 'food' },
  ],
  evening_nightlife: [
    { name: 'Cocktail Bar Hopping', description: 'Start the evening at {city}\'s famous cocktail and craft beer bars, hopping between the best spots.', location: '{city} Bar District', duration: '3 hrs', baseCost: 40, type: 'entertainment' },
    { name: 'Rooftop Bar Sundowner', description: 'Watch the sunset from a spectacular rooftop bar in {city} with panoramic city views and signature cocktails.', location: '{city} Rooftop Bar', duration: '2 hrs', baseCost: 35, type: 'entertainment' },
    { name: 'Live Jazz or Blues Club', description: 'Catch live music at one of {city}\'s legendary jazz or blues clubs — a perfect evening atmosphere.', location: '{city} Jazz Club', duration: '3 hrs', baseCost: 25, type: 'entertainment' },
    { name: 'Night Club Experience', description: 'Dance till late at one of {city}\'s top nightclubs, known for its world-class DJs and energetic crowd.', location: '{city} Nightclub', duration: '4 hrs', baseCost: 30, type: 'entertainment' },
  ],
  evening_relaxation: [
    { name: 'Sunset Walk Along the Waterfront', description: 'A peaceful evening stroll along {city}\'s waterfront promenade, watching the sunset and unwinding.', location: '{city} Waterfront', duration: '1.5 hrs', baseCost: 0, type: 'activity' },
    { name: 'Hotel Rooftop Pool Swim', description: 'End the day with a refreshing swim at your hotel\'s rooftop pool as the city lights begin to glow.', location: '{city} Hotel Rooftop', duration: '1.5 hrs', baseCost: 0, type: 'activity' },
    { name: 'Night Spa & Steam Room', description: 'Finish the evening at a luxury spa in {city} with steam, sauna, and a relaxing wind-down treatment.', location: '{city} Spa', duration: '2 hrs', baseCost: 55, type: 'activity' },
    { name: 'Evening Fire-Pit Gathering', description: 'Join a low-key social gathering around a fire pit at a beachfront or resort setting near {city}.', location: '{city} Beach Resort', duration: '2 hrs', baseCost: 0, type: 'activity' },
  ],

  // ── Food suggestions (used as optional slot) ─────────────────────────────
  food_suggestions: [
    { name: 'Lunch at Waterfront Restaurant', description: 'Fresh local seafood and regional specialties at a well-regarded {city} waterfront restaurant.', location: '{city} Waterfront', duration: '1.5 hrs', baseCost: 25, type: 'food' },
    { name: 'Street Snack Break', description: 'Stop for a quick bite of {city}\'s most popular street snack — a local institution.', location: '{city} Street Corner', duration: '30 mins', baseCost: 5, type: 'food' },
    { name: 'Traditional Set Lunch', description: 'Enjoy a traditional set lunch (today\'s catch or chef\'s special) at a local {city} eatery.', location: '{city} Local Restaurant', duration: '1 hr', baseCost: 18, type: 'food' },
    { name: 'Café Lunch Break', description: 'A light lunch break at a charming café in {city} — sandwiches, salads, and good coffee.', location: '{city} Café', duration: '1 hr', baseCost: 14, type: 'food' },
  ],
};

// ─── Day Titles ───────────────────────────────────────────────────────────────

const DAY_TITLES: Record<number, string[]> = {
  1: ['Arrival & First Impressions', 'Welcome to {city}', 'Getting Settled in {city}'],
  2: ['Discovering the Heart of {city}', 'Exploring {city} Like a Local', 'Diving Into {city}'],
  3: ['Hidden Gems & Local Life', 'Off the Beaten Path in {city}', 'A Deeper Look at {city}'],
  4: ['Culture, Food & Relaxation', 'Rest & Recharge Day', 'The Best of {city} So Far'],
  5: ['Day Trips & Panoramic Views', 'Beyond {city} — A Day Excursion', 'Scenic Escapade from {city}'],
  6: ['Markets, Shopping & Local Crafts', 'Leisure & Shopping Day', '{city} Shopping Spree'],
  7: ['Final Memories & Farewell', 'Last Day in {city}', 'Farewell, {city}'],
};

function getDayTitle(dayNum: number, destination: string, seed: string): string {
  const day = Math.min(dayNum, 7);
  const titles = DAY_TITLES[day] || DAY_TITLES[7];
  const title = pick(titles, seed, dayNum);
  return title.replace(/{city}/g, cityName(destination));
}

// ─── Style → Template Category Mapping ───────────────────────────────────────

/**
 * Given a user's travel styles, determine which morning / afternoon / evening
 * template buckets to draw from. Falls back to 'cultural' if nothing selected.
 */
function resolveCategories(styles: TravelStyle[], preferences: string[], tripType: string): {
  morning: string;
  afternoon: string;
  evening: string;
} {
  const hasStyle = (...s: TravelStyle[]) => styles.some(x => s.includes(x));
  const hasPref = (...p: string[]) => preferences.some(x => p.includes(x.toLowerCase()));

  // Morning
  let morning = 'morning_cultural';
  if (hasStyle('adventure')) morning = 'morning_adventure';
  else if (hasStyle('relaxation')) morning = 'morning_relaxation';
  else if (hasStyle('foodie')) morning = 'morning_food';
  else if (hasPref('nature', 'scenic', 'outdoor')) morning = 'morning_nature';
  else if (hasStyle('cultural', 'photography')) morning = 'morning_cultural';

  // Afternoon
  let afternoon = 'afternoon_cultural';
  if (hasStyle('adventure')) afternoon = 'afternoon_adventure';
  else if (hasStyle('relaxation')) afternoon = 'afternoon_relaxation';
  else if (hasStyle('foodie')) afternoon = 'afternoon_food';
  else if (hasPref('shopping')) afternoon = 'afternoon_shopping';

  // Evening
  let evening = 'evening_cultural';
  if (hasPref('nightlife')) evening = 'evening_nightlife';
  else if (hasStyle('foodie') || hasPref('food', 'local cuisine')) evening = 'evening_foodie';
  else if (hasStyle('relaxation')) evening = 'evening_relaxation';
  else if (hasStyle('adventure') || hasStyle('photography')) evening = 'evening_cultural';

  // Family/couple overrides — keep things lighter in the evening
  if (tripType === 'family') evening = 'evening_cultural';
  if (tripType === 'couple') evening = hasPref('nightlife') ? 'evening_nightlife' : 'evening_foodie';

  return { morning, afternoon, evening };
}

// ─── Activity Builder ─────────────────────────────────────────────────────────

function buildActivity(
  template: ActivityTemplate,
  city: string,
  budgetTier: BudgetTier,
  idSuffix: string,
): Activity {
  const replace = (s: string) => s.replace(/{city}/g, city);
  return {
    id: `act_${idSuffix}`,
    name: replace(template.name),
    description: replace(template.description),
    location: replace(template.location),
    duration: template.duration,
    cost: activityCost(budgetTier, template.baseCost),
    type: template.type,
  };
}

// ─── Main Generator ───────────────────────────────────────────────────────────

/**
 * Generates a full ItineraryDay[] array from TripWizardData.
 *
 * The generator is deterministic — same inputs always produce the same output.
 * This means regeneration works reliably, and sharing a trip URL shows the same plan.
 */
export function generateItinerary(wizardData: TripWizardData, tripId: string): ItineraryDay[] {
  const {
    destination,
    startDate,
    endDate,
    travelStyles,
    preferences,
    tripType,
    budgetMax,
    specialRequests,
  } = wizardData;

  // Guard: invalid dates
  if (!destination || !startDate || !endDate) return [];

  const numDays = tripDays(startDate, endDate);
  const city = cityName(destination);
  const tier = getBudgetTier(budgetMax);
  const seed = `${tripId}_${destination}`.toLowerCase();

  const categories = resolveCategories(
    travelStyles.length > 0 ? travelStyles : ['cultural'],
    preferences,
    tripType,
  );

  const days: ItineraryDay[] = [];

  for (let i = 0; i < numDays; i++) {
    const dayNum = i + 1;
    const date = addDays(startDate, i);

    // Pick templates — vary per day using dayNum as seed offset
    const morningPool = TEMPLATES[categories.morning] ?? TEMPLATES.morning_cultural;
    const afternoonPool = TEMPLATES[categories.afternoon] ?? TEMPLATES.afternoon_cultural;
    const eveningPool = TEMPLATES[categories.evening] ?? TEMPLATES.evening_cultural;
    const foodPool = TEMPLATES.food_suggestions;

    const morningTemplate = pick(morningPool, seed, dayNum);
    const afternoonTemplate = pick(afternoonPool, seed, dayNum + 100);
    const eveningTemplate = pick(eveningPool, seed, dayNum + 200);
    const lunchTemplate = pick(foodPool, seed, dayNum + 300);

    // First day: lighter morning (arrival/check-in context)
    // Last day: lighter afternoon to account for departure
    const morning: Activity[] = [
      buildActivity(morningTemplate, city, tier, `${tripId}_d${dayNum}_m1`),
    ];

    // Add lunch as a mid-day food suggestion in the morning slot (rendered under afternoon)
    const afternoon: Activity[] = [
      buildActivity(lunchTemplate, city, tier, `${tripId}_d${dayNum}_a0`),
      buildActivity(afternoonTemplate, city, tier, `${tripId}_d${dayNum}_a1`),
    ];

    const evening: Activity[] = [
      buildActivity(eveningTemplate, city, tier, `${tripId}_d${dayNum}_e1`),
    ];

    // Day-specific notes
    let dayNotes = '';
    if (dayNum === 1) dayNotes = `Welcome to ${city}! Allow time for check-in and settling in before this first day's activities.`;
    if (dayNum === numDays && numDays > 1) dayNotes = `Last day in ${city}. Don't forget to check-out on time. Consider a light bag so activities remain comfortable.`;
    if (specialRequests && dayNum === 1) dayNotes += specialRequests ? ` Note: ${specialRequests}` : '';

    days.push({
      id: `day_${tripId}_${dayNum}`,
      tripId,
      day: dayNum,
      date,
      title: getDayTitle(dayNum, destination, seed),
      morning,
      afternoon,
      evening,
      notes: dayNotes || undefined,
    });
  }

  return days;
}
