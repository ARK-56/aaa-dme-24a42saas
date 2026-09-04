-- AAA DME — catalogue seed
--
-- Generated from src/data/products.json and featured-products.json, which the
-- app also uses as its offline fallback. Product ids are preserved, so existing
-- /product/<id> links keep working.
--
-- Idempotent: re-running updates the row rather than duplicating it.

insert into public.products (
  id, name, description, price, original_price,
  image, images, category, hcpcs_code, fda_class,
  is_prescription_required, shipping_class, warranty_type,
  in_stock, inventory, rating, review_count,
  colors, sizes, is_sale,
  is_featured, featured_rank
) values
  ('3fcbc09d-615a-4197-ade5-8a36ce3c4503', 'ProLite Ultra Wheelchair', 'Ultra-lightweight aluminum frame wheelchair with ergonomic design for maximum comfort and mobility.', 1257, 1635, 'assets/images/products/p25.avif', array['assets/images/products/p25.avif']::text[], 'Wheelchairs', 'K0001', 'Class I', false, 'standard', '2-Year Limited', true, 10, 4.8, 124, array['Black', 'Blue', 'Silver']::text[], array['Standard', 'Wide']::text[], true, true, 1),
  ('02be18b0-56b8-44f3-a17b-a85acb9c4efb', 'MedCare Hospital Bed', 'Full-electric adjustable hospital bed with premium mattress, side rails, and whisper-quiet motor.', 2897, 3450, 'assets/images/products/p23.avif', array['assets/images/products/p23.avif']::text[], 'Hospital Beds', 'E0260', 'Class II', true, 'white-glove', '5-Year Full', true, 10, 4.9, 89, '{}', '{}', true, true, 2),
  ('beab45b7-d83b-4976-b02b-01e2c4ffea6b', 'StrideSafe Rollator Walker', 'Four-wheel rollator with padded seat, storage basket, and adjustable height handles.', 389, null, 'assets/images/products/p29.png', array['assets/images/products/p29.png']::text[], 'Walkers & Rollators', 'E0143', 'Class I', false, 'standard', '1-Year Limited', true, 7, 4.7, 256, array['Red', 'Blue', 'Black']::text[], '{}', false, true, 3),
  ('02e02e2f-4fdf-4a95-a206-bc3cba2ad1ec', 'AirSense CPAP Machine', 'Auto-adjusting CPAP with heated humidifier, quiet operation, and integrated data tracking.', 1442, 1875, 'assets/images/products/p22.avif', array['assets/images/products/p22.avif']::text[], 'Respiratory', 'E0601', 'Class II', true, 'standard', '3-Year Full', true, 9, 4.6, 198, '{}', '{}', true, true, 4),
  ('47c48a65-a8d9-4770-b358-c6dc91752b87', 'OxyFlow Concentrator', 'Portable oxygen concentrator with continuous flow, long battery life, and FAA-approved for air travel.', 1861, 2795, 'assets/images/products/p4.avif', array['assets/images/products/p4.avif']::text[], 'Respiratory', 'E1390', 'Class II', true, 'ltl-freight', '3-Year Full', true, 10, 4.8, 67, '{}', '{}', true, true, 5),
  ('9fb1d88f-e4df-434e-a08b-c17e34ded751', 'FlexRide Knee Scooter', 'Steerable knee scooter with dual braking system, adjustable knee pad, and foldable design.', 279, null, 'assets/images/products/p19.avif', array['assets/images/products/p19.avif']::text[], 'Mobility Scooters', 'E0118', 'Class I', false, 'standard', '1-Year Limited', true, 10, 4.5, 312, array['Black', 'Blue']::text[], '{}', false, true, 6),
  ('a1b2c3d4-1111-4aaa-bbbb-000000000001', 'ComfortGrip Bath Chair', 'Adjustable-height shower chair with non-slip rubber feet and drainage holes for safe bathing.', 149, null, 'assets/images/products/p28.svg', array['assets/images/products/p28.svg']::text[], 'Bath Safety', 'E0240', 'Class I', false, 'standard', '1-Year Limited', true, 10, 4.6, 203, '{}', '{}', false, false, null),
  ('a1b2c3d4-1111-4aaa-bbbb-000000000002', 'SafeStep Transfer Bench', 'Sliding transfer bench with backrest and armrest for safe entry and exit from the bathtub.', 219, null, 'assets/images/products/p9.avif', array['assets/images/products/p9.avif']::text[], 'Bath Safety', 'E0247', 'Class I', false, 'standard', '1-Year Limited', true, 10, 4.4, 178, '{}', '{}', false, false, null),
  ('a1b2c3d4-1111-4aaa-bbbb-000000000003', 'HydraLift Patient Lift', 'Hydraulic patient lift with 450 lb capacity, six-point spreader bar, and full-body sling included.', 3495, 4200, 'assets/images/products/p21.avif', array['assets/images/products/p21.avif']::text[], 'Patient Lifts', 'E0630', 'Class I', false, 'white-glove', '3-Year Full', true, 10, 4.7, 45, '{}', '{}', true, false, null),
  ('a1b2c3d4-1111-4aaa-bbbb-000000000004', 'EasyGlide Hoyer Sling', 'Padded mesh patient sling compatible with most lift systems, with head support and quick-dry fabric.', 189, null, 'assets/images/products/p18.avif', array['assets/images/products/p18.avif']::text[], 'Patient Lifts', 'E0621', 'Class I', false, 'standard', '1-Year Limited', true, 10, 4.3, 92, '{}', array['Small', 'Medium', 'Large']::text[], false, false, null),
  ('a1b2c3d4-1111-4aaa-bbbb-000000000005', 'PowerDrive Mobility Scooter', '4-wheel electric mobility scooter with 25-mile range, LED headlights, and full suspension.', 2299, 2799, 'assets/images/products/p5.avif', array['assets/images/products/p5.avif']::text[], 'Mobility Scooters', 'K0800', 'Class II', true, 'ltl-freight', '2-Year Limited', true, 10, 4.8, 156, array['Red', 'Blue', 'Silver']::text[], '{}', true, false, null),
  ('a1b2c3d4-1111-4aaa-bbbb-000000000006', 'AirPure Nebulizer System', 'Compact tabletop nebulizer with quiet piston compressor and five reusable nebulizer kits included.', 89, null, 'assets/images/products/p20.avif', array['assets/images/products/p20.avif']::text[], 'Respiratory', 'E0570', 'Class II', true, 'standard', '2-Year Limited', true, 10, 4.5, 340, '{}', '{}', false, false, null),
  ('a1b2c3d4-1111-4aaa-bbbb-000000000007', 'LiftAssist Recliner Chair', 'Power lift recliner with heat and massage, infinite positions, and dual motor for independent back and leg control.', 1195, 1495, 'assets/images/products/p2.avif', array['assets/images/products/p2.avif']::text[], 'Patient Lifts', 'E0627', 'Class I', false, 'ltl-freight', '2-Year Limited', true, 10, 4.6, 87, array['Brown', 'Blue', 'Burgundy']::text[], '{}', true, false, null),
  ('a1b2c3d4-1111-4aaa-bbbb-000000000008', 'QuietBreeze BiPAP Machine', 'Auto BiPAP with expiratory pressure relief, integrated humidifier, and wireless data reporting.', 1899, 2350, 'assets/images/products/p8.avif', array['assets/images/products/p8.avif']::text[], 'Respiratory', 'E0471', 'Class II', true, 'standard', '3-Year Full', true, 10, 4.7, 74, '{}', '{}', true, false, null),
  ('a1b2c3d4-1111-4aaa-bbbb-000000000009', 'TiltMaster Power Wheelchair', 'Power tilt-in-space wheelchair with joystick control, 300 lb capacity, and programmable seating positions.', 4850, 5900, 'assets/images/products/p16.avif', array['assets/images/products/p16.avif']::text[], 'Wheelchairs', 'K0856', 'Class II', true, 'white-glove', '5-Year Full', true, 10, 4.9, 38, array['Black', 'Red']::text[], '{}', true, false, null),
  ('a1b2c3d4-1111-4aaa-bbbb-000000000010', 'ClearView Pulse Oximeter', 'Fingertip pulse oximeter with large OLED display, SpO2 and pulse rate monitoring, and lanyard included.', 49, null, 'assets/images/products/p7.avif', array['assets/images/products/p7.avif']::text[], 'Respiratory', 'A4606', 'Class II', false, 'standard', '1-Year Limited', true, 10, 4.4, 528, '{}', '{}', false, false, null),
  ('a1b2c3d4-1111-4aaa-bbbb-000000000011', 'ProFlex Bariatric Walker', 'Heavy-duty bariatric rollator with 500 lb capacity, extra-wide seat, and reinforced steel frame.', 445, null, 'assets/images/products/p24.avif', array['assets/images/products/p24.avif']::text[], 'Walkers & Rollators', 'E0148', 'Class I', false, 'standard', '2-Year Limited', true, 10, 4.5, 112, '{}', '{}', false, false, null),
  ('a1b2c3d4-1111-4aaa-bbbb-000000000012', 'MediRest Alternating Pressure Mattress', 'Alternating pressure mattress system with whisper-quiet pump, adjustable pressure settings, and CPR quick-release.', 689, 849, 'assets/images/products/p3.avif', array['assets/images/products/p3.avif']::text[], 'Hospital Beds', 'E0277', 'Class II', true, 'standard', '2-Year Limited', true, 10, 4.6, 95, '{}', '{}', true, false, null),
  ('a1b2c3d4-1111-4aaa-bbbb-000000000013', 'GripSafe Raised Toilet Seat', 'Locking raised toilet seat with padded armrests, tool-free installation, and 300 lb weight capacity.', 79, null, 'assets/images/products/p26.avif', array['assets/images/products/p26.avif']::text[], 'Bath Safety', 'E0244', 'Class I', false, 'standard', '1-Year Limited', true, 10, 4.3, 267, '{}', '{}', false, false, null),
  ('a1b2c3d4-1111-4aaa-bbbb-000000000014', 'UltraFold Transport Chair', 'Lightweight folding transport wheelchair at only 19 lbs with companion brakes and swing-away footrests.', 329, null, 'assets/images/products/p13.avif', array['assets/images/products/p13.avif']::text[], 'Wheelchairs', 'E1038', 'Class I', false, 'standard', '1-Year Limited', true, 10, 4.5, 189, array['Black', 'Blue', 'Burgundy']::text[], '{}', false, false, null),
  ('a1b2c3d4-1111-4aaa-bbbb-000000000015', 'SureStep Cane Quad Base', 'Small-base quad cane with ergonomic offset handle, adjustable height, and non-slip rubber tips.', 59, null, 'assets/images/products/p30.png', array['assets/images/products/p30.png']::text[], 'Walkers & Rollators', 'E0105', 'Class I', false, 'standard', '1-Year Limited', true, 10, 4.2, 445, array['Black', 'Silver']::text[], '{}', false, false, null),
  ('a1b2c3d4-1111-4aaa-bbbb-000000000016', 'BreathEasy Suction Unit', 'Portable suction unit with rechargeable battery, adjustable vacuum pressure, and autoclavable collection canister.', 399, null, 'assets/images/products/p27.avif', array['assets/images/products/p27.avif']::text[], 'Respiratory', 'E0600', 'Class II', true, 'standard', '2-Year Limited', false, 0, 4.7, 63, '{}', '{}', false, false, null),
  ('a1b2c3d4-1111-4aaa-bbbb-000000000017', 'ComfortAir Gel Cushion', 'Gel wheelchair seat cushion with memory foam base, waterproof cover, and pressure redistribution design.', 129, null, 'assets/images/products/p17.avif', array['assets/images/products/p17.avif']::text[], 'Wheelchairs', 'E2603', 'Class I', false, 'standard', '1-Year Limited', true, 10, 4.4, 221, '{}', array['16x16', '18x16', '20x18']::text[], false, false, null),
  ('a1b2c3d4-1111-4aaa-bbbb-000000000018', 'NovaBed Semi-Electric Bed', 'Semi-electric hospital bed with electric head and foot adjustment, manual height, and locking casters.', 1895, 2295, 'assets/images/products/p31.png', array['assets/images/products/p31.png']::text[], 'Hospital Beds', 'E0261', 'Class II', true, 'white-glove', '3-Year Full', true, 10, 4.7, 56, '{}', '{}', true, false, null),
  ('a1b2c3d4-1111-4aaa-bbbb-000000000019', 'AquaShield Shower Commode', 'Rolling shower commode chair with padded seat, locking wheels, and removable bucket for easy cleaning.', 349, null, 'assets/images/products/p1.avif', array['assets/images/products/p1.avif']::text[], 'Bath Safety', 'E0167', 'Class I', false, 'standard', '1-Year Limited', true, 10, 4.5, 134, '{}', '{}', false, false, null),
  ('a1b2c3d4-1111-4aaa-bbbb-000000000020', 'TravelLite Folding Ramp', 'Portable folding aluminum ramp with 600 lb capacity, non-slip surface, and carrying handle for easy transport.', 259, null, 'assets/images/products/p12.avif', array['assets/images/products/p12.avif']::text[], 'Mobility Scooters', 'E1399', 'Class I', false, 'standard', '2-Year Limited', true, 10, 4.6, 178, '{}', array['4ft', '6ft', '8ft']::text[], false, false, null)
on conflict (id) do update set
  name                     = excluded.name,
  description              = excluded.description,
  price                    = excluded.price,
  original_price           = excluded.original_price,
  image                    = excluded.image,
  images                   = excluded.images,
  category                 = excluded.category,
  hcpcs_code               = excluded.hcpcs_code,
  fda_class                = excluded.fda_class,
  is_prescription_required = excluded.is_prescription_required,
  shipping_class           = excluded.shipping_class,
  warranty_type            = excluded.warranty_type,
  in_stock                 = excluded.in_stock,
  inventory                = excluded.inventory,
  rating                   = excluded.rating,
  review_count             = excluded.review_count,
  colors                   = excluded.colors,
  sizes                    = excluded.sizes,
  is_sale                  = excluded.is_sale,
  is_featured              = excluded.is_featured,
  featured_rank            = excluded.featured_rank;
