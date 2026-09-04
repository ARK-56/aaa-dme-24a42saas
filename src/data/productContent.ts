/**
 * Long-form editorial copy for the catalogue, keyed by product id.
 *
 * Deliberately separate from products.json: that document is synced from Redis
 * and can be edited in the admin panel, so anything stored there would be lost
 * on the next sync. This file is the editorial layer and stays in the repo.
 *
 * Products without an entry fall back to generic copy on the detail page, so a
 * newly added product still renders correctly.
 */
export interface ProductContent {
  /** Two or three paragraphs shown under "Product Overview & Benefits". */
  overview: string[];
  /** Concrete capabilities, rendered as a bullet list. */
  features: string[];
  /** One line on who the item suits — helps patients self-select. */
  bestFor: string;
}

export const PRODUCT_CONTENT: Record<string, ProductContent> = {
  // ── Wheelchairs ────────────────────────────────────────────────────────────
  "3fcbc09d-615a-4197-ade5-8a36ce3c4503": {
    overview: [
      "The ProLite Ultra is built around a lightweight aluminium frame, which makes the difference between a chair a caregiver can lift into a car boot alone and one that needs two people. At this weight most users can self-propel comfortably over everyday distances without the shoulder fatigue a heavier steel chair causes.",
      "The seat and back are shaped to hold posture over a long sitting day rather than just to be sat in briefly, and the frame folds flat for storage in a hallway cupboard or car. It ships assembled and ready to use.",
    ],
    features: [
      "Lightweight aluminium frame for easy lifting and transport",
      "Ergonomic seat and back designed for extended sitting",
      "Folds flat for car boot or cupboard storage",
      "Available in Black, Blue and Silver, in Standard and Wide seat widths",
      "HCPCS K0001 — commonly covered as a standard manual wheelchair",
    ],
    bestFor:
      "Everyday independent mobility where the user can self-propel or has a caregiver who transports the chair regularly.",
  },
  "a1b2c3d4-1111-4aaa-bbbb-000000000009": {
    overview: [
      "Tilt-in-space is a clinical feature, not a comfort upgrade. Tilting the whole seat while keeping hip and knee angles fixed shifts pressure off the sitting bones without the user sliding forward, which is what makes it a standard recommendation for anyone at risk of pressure injuries or who cannot reposition themselves independently.",
      "Joystick control and a 300 lb capacity cover most full-time power chair users. Because this is a K0856 power chair, insurers will expect a face-to-face mobility evaluation and detailed physician documentation — we handle assembling that paperwork as part of the request.",
      "Delivery is white-glove: the chair is assembled in your home, positioned where you need it, and the packaging removed.",
    ],
    features: [
      "Power tilt-in-space for pressure relief without repositioning",
      "Joystick control with adjustable sensitivity",
      "300 lb weight capacity",
      "White-glove delivery, in-home assembly and setup included",
      "5-Year Full warranty",
      "HCPCS K0856 — prescription and mobility evaluation required",
    ],
    bestFor:
      "Full-time power chair users, particularly anyone with limited independent repositioning or a history of pressure injury.",
  },
  "a1b2c3d4-1111-4aaa-bbbb-000000000014": {
    overview: [
      "At 19 lbs the UltraFold is a transport chair rather than a self-propelled wheelchair: the rear wheels are small, so it is pushed by a companion rather than driven by the user. That trade-off buys a chair light enough to lift one-handed and narrow enough for aircraft aisles and tight doorways.",
      "It is the chair most families end up keeping in the car for appointments, airports and days out, alongside a heavier everyday chair at home.",
    ],
    features: [
      "19 lb total weight — liftable one-handed by most caregivers",
      "Companion-propelled with locking hand brakes",
      "Folds compactly for car boot and air travel",
      "Narrow frame clears standard interior doorways",
      "HCPCS E1038 — transport chair",
    ],
    bestFor:
      "Appointments, travel and outings where a companion pushes and packing size matters more than self-propulsion.",
  },
  "a1b2c3d4-1111-4aaa-bbbb-000000000017": {
    overview: [
      "A wheelchair cushion is the single most effective thing you can add to a chair to prevent pressure injury. This one pairs a gel layer, which spreads load away from the sitting bones, with a memory foam base that keeps the shape stable rather than bottoming out over the course of a day.",
      "The cover is waterproof and removable, which matters more than it sounds: cushions that cannot be cleaned properly get replaced far sooner than ones that can.",
    ],
    features: [
      "Gel top layer for pressure redistribution",
      "Memory foam base that resists bottoming out",
      "Waterproof, removable, machine-washable cover",
      "Non-slip underside keeps the cushion seated in the chair",
      "HCPCS E2603 — general use seat cushion",
    ],
    bestFor:
      "Anyone sitting in a wheelchair for extended periods, and essential for users with reduced sensation or a pressure injury history.",
  },

  // ── Hospital Beds ──────────────────────────────────────────────────────────
  "02be18b0-56b8-44f3-a17b-a85acb9c4efb": {
    overview: [
      "Full-electric means all three adjustments — head, foot and overall bed height — are motorised and controlled from a handset. The height adjustment is the one people underestimate: being able to drop the bed low for a safe transfer and raise it for care reduces both fall risk and caregiver back strain.",
      "The bed ships with a premium mattress and side rails included, so there is nothing further to source. Delivery is white-glove, which for a hospital bed means assembly in the room you want it, removal of packaging, and a walkthrough of the controls before the crew leaves.",
      "This is prescription equipment. Insurers generally want documentation of the medical need for positioning or height adjustment at home, which we gather with your physician.",
    ],
    features: [
      "Full-electric head, foot and height adjustment via handset",
      "Premium pressure-redistributing mattress included",
      "Side rails included",
      "Whisper-quiet motor suitable for overnight adjustment",
      "White-glove delivery, in-room assembly and controls walkthrough",
      "5-Year Full warranty · HCPCS E0260 — prescription required",
    ],
    bestFor:
      "Long-term home care where positioning changes are needed through the day and night, and where a caregiver assists with transfers.",
  },
  "a1b2c3d4-1111-4aaa-bbbb-000000000018": {
    overview: [
      "Semi-electric splits the difference on cost: head and foot sections are motorised and adjusted from the handset, while overall bed height is set manually with a crank. If the bed will sit at one height and stay there, you are paying for motors you would rarely use on a full-electric model.",
      "Where a caregiver transfers the patient in and out several times a day, the manual height crank becomes the bottleneck and a full-electric bed is usually worth the difference.",
    ],
    features: [
      "Electric head and foot adjustment via handset",
      "Manual crank for overall bed height",
      "Side rails and mattress platform included",
      "White-glove delivery and in-room assembly",
      "3-Year Full warranty · HCPCS E0261 — prescription required",
    ],
    bestFor:
      "Home care where head and foot positioning changes often but bed height can be set once and left.",
  },
  "a1b2c3d4-1111-4aaa-bbbb-000000000012": {
    overview: [
      "An alternating pressure mattress runs a pump that inflates and deflates air cells in sequence, so the points bearing weight change continuously through the day. For someone who cannot reposition themselves, that mechanical cycling does the job that turning would otherwise do.",
      "This system is prescribed for treating existing pressure injuries and for prevention in high-risk patients. The pump is deliberately quiet — a noisy pump next to the bed is the most common reason these get switched off at night, which defeats the purpose.",
    ],
    features: [
      "Alternating air cell cycling for continuous pressure redistribution",
      "Whisper-quiet pump suitable for bedside overnight use",
      "Adjustable pressure settings for patient weight",
      "Fits standard hospital bed frames",
      "HCPCS E0277 — prescription required",
    ],
    bestFor:
      "Patients with limited independent repositioning, existing pressure injuries, or documented high risk of developing them.",
  },

  // ── Walkers & Rollators ────────────────────────────────────────────────────
  "beab45b7-d83b-4976-b02b-01e2c4ffea6b": {
    overview: [
      "A four-wheel rollator is for people who can walk but need something steady in front of them and somewhere to sit when they tire. The padded seat is the feature that most changes daily life — it turns a walk that had to be planned around available benches into one that does not.",
      "Handle height adjusts to the user, which matters: handles set too high push the shoulders up and undo the stability the frame is meant to provide. The storage basket takes shopping, and the frame folds for the car.",
    ],
    features: [
      "Four-wheel frame with locking hand brakes",
      "Padded seat for resting mid-walk",
      "Under-seat storage basket",
      "Adjustable handle height",
      "Folds for transport and storage",
      "HCPCS E0143 — commonly covered wheeled walker",
    ],
    bestFor:
      "Users who walk independently but tire quickly or need stability and a place to sit on longer outings.",
  },
  "a1b2c3d4-1111-4aaa-bbbb-000000000011": {
    overview: [
      "Bariatric equipment is not simply a standard model with a higher number on the label. The ProFlex has a reinforced frame, wider wheelbase and extra-wide seat, all engineered together so the 500 lb rating holds under real-world use rather than just static load.",
      "Using a standard rollator above its rated capacity is a genuine safety risk — frames fail at the joints, usually while the user is putting weight on them. If the user is near or above a standard walker's limit, this is the right specification.",
    ],
    features: [
      "500 lb weight capacity with reinforced frame",
      "Extra-wide padded seat",
      "Wider wheelbase for lateral stability",
      "Locking hand brakes sized for the frame",
      "HCPCS E0148 — bariatric walker",
    ],
    bestFor:
      "Users at or above the weight limit of a standard rollator who need the same walk-and-rest capability.",
  },
  "a1b2c3d4-1111-4aaa-bbbb-000000000015": {
    overview: [
      "A quad cane puts four contact points on the ground, so it stands on its own and gives lateral support a single-point cane cannot. The small base fits on a standard stair tread, which is where large-base quad canes become awkward.",
      "The offset handle places your weight over the centre of the base rather than in front of it — the detail that makes a quad cane feel planted instead of tippy.",
    ],
    features: [
      "Four-point small base, stable on stair treads",
      "Ergonomic offset handle centres load over the base",
      "Tool-free height adjustment",
      "Stands unaided when set down",
      "HCPCS E0105 — quad cane with tips",
    ],
    bestFor:
      "Users with mild one-sided weakness who need more support than a single-point cane but less than a walker.",
  },

  // ── Respiratory ────────────────────────────────────────────────────────────
  "02e02e2f-4fdf-4a95-a206-bc3cba2ad1ec": {
    overview: [
      "An auto-adjusting CPAP measures your airway through the night and varies pressure to match, rather than holding one fixed pressure. Most people find it easier to tolerate, particularly in the first weeks when adherence is most fragile.",
      "The heated humidifier addresses the dry mouth and nose that make people abandon therapy. Integrated data tracking records your usage — worth knowing that insurers routinely require documented nightly use over a compliance period to keep covering the machine and supplies.",
      "Masks, tubing, cushions and filters are consumables on a replacement schedule. Once your machine is set up we track your eligibility dates so resupply arrives before the old parts degrade.",
    ],
    features: [
      "Auto-adjusting pressure responding to airway resistance",
      "Integrated heated humidifier",
      "Quiet operation suitable for a shared bedroom",
      "Built-in usage tracking for insurance compliance reporting",
      "3-Year Full warranty · HCPCS E0601 — prescription and sleep study required",
    ],
    bestFor:
      "Diagnosed obstructive sleep apnoea, especially first-time users who need the gentlest possible introduction to therapy.",
  },
  "a1b2c3d4-1111-4aaa-bbbb-000000000008": {
    overview: [
      "BiPAP delivers two pressures — a higher one as you breathe in and a lower one as you breathe out. That drop on exhale is the point: it makes breathing out against the machine far less effortful, which is why BiPAP is prescribed where CPAP is not tolerated or where there is a ventilation problem rather than a simple obstruction.",
      "Expiratory pressure relief softens the transition further. Conditions like COPD with overlapping sleep apnoea, and neuromuscular conditions affecting breathing strength, are the usual indications.",
    ],
    features: [
      "Separate inspiratory and expiratory pressure settings",
      "Expiratory pressure relief for easier exhalation",
      "Integrated humidifier",
      "Usage and therapy data logging",
      "3-Year Full warranty · HCPCS E0471 — prescription required",
    ],
    bestFor:
      "Patients who cannot tolerate CPAP, or who need ventilatory support rather than airway splinting alone.",
  },
  "47c48a65-a8d9-4770-b358-c6dc91752b87": {
    overview: [
      "This is a continuous-flow portable concentrator, which is a meaningful distinction. Pulse-dose units deliver oxygen only when they detect an inhalation and are lighter, but they do not suit everyone — during sleep, or with shallow breathing, the trigger can be missed. Continuous flow delivers steadily regardless.",
      "It is FAA-approved for air travel, so it can be used in flight with the airline notified in advance, and the battery life is sized for a day out rather than a short errand.",
      "Concentrators ship as LTL freight on a pallet with a signature required, and your prescribed flow rate in litres per minute must match the unit's capability — we confirm that against your prescription before anything is dispatched.",
    ],
    features: [
      "Continuous flow delivery, suitable for overnight use",
      "FAA-approved for commercial air travel",
      "Extended battery life for full-day outings",
      "No tank refills or deliveries to schedule",
      "3-Year Full warranty · HCPCS E1390 — prescription required",
    ],
    bestFor:
      "Long-term oxygen therapy where mobility matters, and anyone whose prescription calls for continuous rather than pulse-dose flow.",
  },
  "a1b2c3d4-1111-4aaa-bbbb-000000000006": {
    overview: [
      "A nebuliser turns liquid medication into a fine mist you breathe in over several minutes. For young children, and for anyone in an acute flare who cannot coordinate an inhaler, it delivers medication reliably when an inhaler would not.",
      "The piston compressor is the quiet type, which matters for treating a distressed child. Five reusable cups mean you are not rationing parts between cleanings — nebuliser cups need washing after use, and having spares is what makes that realistic.",
    ],
    features: [
      "Quiet piston compressor for tabletop use",
      "Five reusable medication cups included",
      "Adult and paediatric masks plus mouthpiece",
      "Simple two-control operation",
      "2-Year Limited warranty · HCPCS E0570 — prescription required",
    ],
    bestFor:
      "Asthma, COPD and other conditions needing inhaled medication, particularly for children and during acute flares.",
  },
  "a1b2c3d4-1111-4aaa-bbbb-000000000016": {
    overview: [
      "A portable suction unit clears secretions from the airway for patients who cannot clear them by coughing — common after a tracheostomy, in advanced neuromuscular disease, and in some stroke recovery.",
      "The rechargeable battery is what makes it genuinely portable, and it is the reason this unit works as emergency equipment: airway clearance cannot wait for a power outlet. Adjustable vacuum pressure lets you set suction appropriate to the patient rather than running at maximum.",
    ],
    features: [
      "Rechargeable battery for use away from mains power",
      "Adjustable vacuum pressure",
      "Reusable collection canister with overflow protection",
      "Carry handle for room-to-room and travel use",
      "2-Year Limited warranty · HCPCS E0600 — prescription required",
    ],
    bestFor:
      "Patients requiring routine airway clearance, especially with a tracheostomy or an impaired cough reflex.",
  },
  "a1b2c3d4-1111-4aaa-bbbb-000000000010": {
    overview: [
      "A fingertip pulse oximeter reads blood oxygen saturation and pulse rate in seconds. For anyone managing COPD, heart failure or recovery from a respiratory illness, it turns 'I feel short of breath' into a number you can act on and report to your clinician.",
      "The OLED display is readable without reading glasses, which sounds trivial and is not — a meter you cannot read at 3am does not get used. No prescription is needed for this one.",
      "One caution: readings can be unreliable with cold hands, nail polish or poor circulation. Treat a surprising reading as a prompt to recheck and call your clinician, not as a diagnosis.",
    ],
    features: [
      "SpO2 and pulse rate in a few seconds",
      "Large high-contrast OLED display",
      "Automatic shut-off to preserve battery",
      "Fits adult and older-child fingertips",
      "No prescription required · HCPCS A4606",
    ],
    bestFor:
      "Home monitoring for chronic respiratory and cardiac conditions, and tracking recovery after a respiratory illness.",
  },

  // ── Mobility Scooters ──────────────────────────────────────────────────────
  "9fb1d88f-e4df-434e-a08b-c17e34ded751": {
    overview: [
      "A knee scooter is for a specific situation: a below-the-knee injury or surgery where you must keep all weight off one foot, but the other leg and both arms work normally. You rest the injured leg's shin on the padded platform and push with the good leg.",
      "Compared with crutches for the same injury, it keeps your hands free, does not load your shoulders and armpits, and most people find it far faster. Steering plus a dual braking system make it manageable indoors and on pavements.",
      "It is not suitable if you cannot bend the injured knee, or if balance or upper-body strength is significantly impaired.",
    ],
    features: [
      "Steerable front wheels for indoor manoeuvring",
      "Dual braking system with parking lock",
      "Adjustable knee pad height for user leg length",
      "Folds for car transport",
      "No prescription required · HCPCS E0118",
    ],
    bestFor:
      "Non-weight-bearing recovery below the knee — foot and ankle surgery, fractures, severe sprains — with good balance.",
  },
  "a1b2c3d4-1111-4aaa-bbbb-000000000005": {
    overview: [
      "A four-wheel scooter trades the tight turning circle of a three-wheel model for markedly better stability, which is the right trade outdoors, on cambered pavements and on grass. The 25-mile range covers a full day of errands without range anxiety.",
      "LED headlights are a genuine safety feature, not a styling one — scooters are low and easily missed by drivers at dusk. Delivery is LTL freight on a pallet with a signature required.",
      "Insurers assess scooters against whether the equipment is needed inside the home, not just outdoors. That distinction decides many claims, and we will tell you honestly where a request stands before you commit.",
    ],
    features: [
      "Four-wheel configuration for outdoor stability",
      "Up to 25-mile range per charge",
      "LED headlights for low-light visibility",
      "Delta tiller steering, adjustable seat height",
      "2-Year Limited warranty · HCPCS K0800 — prescription required",
    ],
    bestFor:
      "Users with the trunk control and vision to drive safely who need to cover distances walking no longer allows.",
  },
  "a1b2c3d4-1111-4aaa-bbbb-000000000020": {
    overview: [
      "A folding ramp is what makes a wheelchair or scooter genuinely usable — a single 6-inch threshold or a couple of front steps is an absolute barrier without one. The 600 lb capacity covers an occupied power chair, not just the chair alone, which is the figure that actually matters.",
      "It folds like a suitcase and travels in a car boot, so the same ramp handles your front step at home, a relative's house and a kerb at a destination. The non-slip surface holds in wet weather.",
      "Check the rise before ordering: gentler slopes are safer and, for an unassisted user, far more manageable. We will help you work out the length you need.",
    ],
    features: [
      "600 lb capacity — rated for an occupied power chair",
      "Folds in half with a carry handle",
      "Non-slip traction surface for wet conditions",
      "Aluminium construction resists corrosion",
      "2-Year Limited warranty · HCPCS E1399",
    ],
    bestFor:
      "Thresholds, front steps and vehicle loading where a permanent ramp is not practical or not yet installed.",
  },

  // ── Bath Safety ────────────────────────────────────────────────────────────
  "a1b2c3d4-1111-4aaa-bbbb-000000000001": {
    overview: [
      "Most falls at home happen in the bathroom, on wet tile, during the transfer in and out of a shower. A shower chair removes the need to stand on that surface at all.",
      "Height adjusts to the user's leg length so the feet rest flat and standing up is possible without a caregiver hauling. Drainage holes stop water pooling on the seat and the rubber feet grip wet tile.",
      "Worth knowing before you request coverage: Medicare generally treats bath safety equipment as a convenience item rather than medically necessary, so these are usually an out-of-pocket purchase. We will tell you that up front rather than after a denial.",
    ],
    features: [
      "Tool-free adjustable seat height",
      "Non-slip rubber feet for wet tile",
      "Drainage holes prevent water pooling",
      "Lightweight, rustproof frame",
      "No prescription required · HCPCS E0240",
    ],
    bestFor:
      "Anyone unsteady standing for the length of a shower, or recovering from surgery affecting balance or weight-bearing.",
  },
  "a1b2c3d4-1111-4aaa-bbbb-000000000002": {
    overview: [
      "A transfer bench solves the hardest part of bathing: getting over the tub wall. You sit on the outboard section, then slide across the bench and swing your legs over, so you never stand on one leg on wet enamel.",
      "For anyone with hip precautions after surgery, or significant one-sided weakness, this is usually a more appropriate choice than a shower chair. The backrest and armrest give something to push up from.",
    ],
    features: [
      "Sliding seat crosses the tub wall without standing",
      "Backrest and armrest for support and pushing up",
      "Adjustable legs level the bench across the tub wall",
      "Non-slip feet inside and outside the tub",
      "No prescription required · HCPCS E0247",
    ],
    bestFor:
      "Bathtub transfers with hip precautions, one-sided weakness, or poor standing balance.",
  },
  "a1b2c3d4-1111-4aaa-bbbb-000000000013": {
    overview: [
      "A raised toilet seat reduces how far you have to lower yourself and, more importantly, how far you have to push back up. After hip or knee replacement it is often the single item that makes independent toileting possible during recovery.",
      "This one locks to the bowl rather than resting on it — an unlocked seat that shifts as you sit is a fall risk. Installation is tool-free, and the padded armrests give something to push against.",
    ],
    features: [
      "Locks securely to the bowl, no movement in use",
      "Padded armrests for pushing up",
      "Tool-free installation and removal for cleaning",
      "Fits standard and most elongated bowls",
      "No prescription required · HCPCS E0244",
    ],
    bestFor:
      "Hip and knee replacement recovery, and anyone who struggles to rise from a standard-height toilet.",
  },
  "a1b2c3d4-1111-4aaa-bbbb-000000000019": {
    overview: [
      "A shower commode does two jobs, which is the point: the patient is transferred once onto the chair, then wheeled to the toilet or into a roll-in shower without further transfers. Every transfer avoided is a fall risk and a caregiver injury risk removed.",
      "The wheels lock for transfers and the seat opening is removable, so it works as a bedside commode too. It suits accessible bathrooms with roll-in showers rather than standard tub-shower combinations.",
    ],
    features: [
      "Rolls over a standard toilet and into roll-in showers",
      "Locking wheels for safe transfers",
      "Removable seat opening and collection pail",
      "Padded seat and backrest for longer sitting",
      "No prescription required · HCPCS E0167",
    ],
    bestFor:
      "Patients needing assistance with both toileting and bathing, in homes with an accessible bathroom.",
  },

  // ── Patient Lifts ──────────────────────────────────────────────────────────
  "a1b2c3d4-1111-4aaa-bbbb-000000000003": {
    overview: [
      "Once a patient cannot bear weight to transfer, manual lifting stops being safe for either person. Caregiver back injury from repeated manual transfers is one of the most common and most preventable harms in home care.",
      "The HydraLift takes the load hydraulically with a 450 lb capacity and a six-point spreader bar, which keeps the sling balanced and the patient level through the lift. The base legs widen to clear a wheelchair or bed frame and narrow to pass through doorways.",
      "Delivery is white-glove: assembled in your home with a demonstration of a full transfer cycle. Do not attempt a first transfer without that walkthrough. The lift needs a compatible sling, sold separately.",
    ],
    features: [
      "450 lb hydraulic lifting capacity",
      "Six-point spreader bar keeps the patient level",
      "Adjustable base legs clear wheelchairs and narrow for doorways",
      "Locking castors for stable positioning",
      "White-glove delivery with transfer demonstration",
      "3-Year Full warranty · HCPCS E0630",
    ],
    bestFor:
      "Home transfers where the patient cannot bear weight and a caregiver would otherwise lift manually.",
  },
  "a1b2c3d4-1111-4aaa-bbbb-000000000004": {
    overview: [
      "The sling is the part that touches the patient, and sizing it correctly matters more than any other accessory decision. Too large and the patient can slip during the lift; too small and it puts pressure where it should not.",
      "This padded mesh sling has head support, which is required for anyone without reliable head and neck control, and fits most standard lift systems with a six-point spreader bar. Mesh dries quickly, so it can be used for bathing transfers.",
      "Slings wear out. Inspect the straps and stitching before every use and replace at the first sign of fraying — sling failure mid-lift is exactly the accident these are meant to prevent.",
    ],
    features: [
      "Padded mesh with head and neck support",
      "Compatible with most six-point spreader bar lifts",
      "Quick-drying — suitable for bathing transfers",
      "Reinforced strap attachment points",
      "1-Year Limited warranty · HCPCS E0621",
    ],
    bestFor:
      "Full-body lift transfers, particularly for patients without independent head control.",
  },
  "a1b2c3d4-1111-4aaa-bbbb-000000000007": {
    overview: [
      "A lift recliner tilts forward and rises to bring you to a near-standing position, so the chair does the work your legs and arms would otherwise do. For anyone who can walk but cannot rise from a standard armchair unaided, it restores a surprising amount of independence.",
      "Infinite positioning means the back and footrest move independently, so you can find a genuinely comfortable position rather than choosing between three presets. Dual motors are what make that possible. Heat and massage are comfort features rather than clinical ones.",
      "Coverage note: insurers typically cover only the seat lift mechanism, not the chair and upholstery around it. We will set out what that means for your out-of-pocket cost before you order.",
    ],
    features: [
      "Powered lift to a near-standing position",
      "Dual motors for independent back and footrest positioning",
      "Heat and massage settings",
      "Infinite recline positions including near-flat",
      "2-Year Limited warranty · HCPCS E0627",
    ],
    bestFor:
      "Users who can walk but cannot rise unaided from a standard chair, and who spend long periods seated.",
  },
};

export function getProductContent(id: string): ProductContent | undefined {
  return PRODUCT_CONTENT[id];
}
