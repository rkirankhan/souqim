-- ListMio sample listings (~12)
-- Paste into the Supabase SQL editor and run.
--
-- - All rows are tagged owner_name = 'ListMio Sample' so you can wipe
--   them all in one go later (DELETE statement at the bottom of this file).
-- - Idempotent: ON CONFLICT (slug) DO NOTHING — safe to re-run.
-- - owner_id is NULL — these belong to no real account.

INSERT INTO businesses (
  slug, name, owner_name, categories, description, tagline, founding_year,
  location, postcode, phone, email, website,
  social_instagram, social_facebook,
  image_url, photos, opening_hours, services,
  is_women_owned, is_home_based, is_startup,
  status
) VALUES

-- 1. Cafe — women-led
('hearth-and-hop-cafe', 'Hearth & Hop Café', 'ListMio Sample',
  ARRAY['Food & Catering'],
  'A neighbourhood cafe in Stokes Croft serving slow-brewed coffee, all-day brunch and warm sourdough loaves baked on-site. Local roasters, seasonal kitchen, dog-friendly.',
  'Coffee, sourdough and a quiet corner.', 2019,
  'Stokes Croft, Bristol', 'BS1 3PR', '0117 555 0114', 'hello@hearthandhop.example', 'https://hearthandhop.example',
  'https://instagram.com/hearthandhop', 'https://facebook.com/hearthandhop',
  'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&q=80',
    'https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=1200&q=80',
    'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=1200&q=80'
  ],
  '{"Monday":{"open":true,"start":"08:00","end":"17:00"},"Tuesday":{"open":true,"start":"08:00","end":"17:00"},"Wednesday":{"open":true,"start":"08:00","end":"17:00"},"Thursday":{"open":true,"start":"08:00","end":"17:00"},"Friday":{"open":true,"start":"08:00","end":"17:00"},"Saturday":{"open":true,"start":"09:00","end":"16:00"},"Sunday":{"open":true,"start":"09:00","end":"15:00"}}'::jsonb,
  '[{"title":"Brunch","description":"All-day brunch using produce from local growers.","price":"from £9"},{"title":"Pour-over coffee","description":"Single-origin beans, hand-brewed.","price":"£3.80"},{"title":"Sourdough loaf","description":"Baked daily, take-home.","price":"£4.50"}]'::jsonb,
  true, false, false, 'live'),

-- 2. Home bakery — home-based
('bakeway-home-bakery', 'Bakeway Home Bakery', 'ListMio Sample',
  ARRAY['Food & Catering','Handmade & Crafts'],
  'Custom celebration cakes and artisan biscuit boxes baked from a small home kitchen in Norwich. Order ahead for birthdays, weddings and corporate gifts.',
  'Cakes you''d remember anyway, baked with care.', 2021,
  'Thorpe St Andrew, Norwich', 'NR7 0PN', NULL, 'orders@bakeway.example', NULL,
  'https://instagram.com/bakeway.bakery', NULL,
  'https://images.unsplash.com/photo-1534432182912-63863115e106?w=1200&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1534432182912-63863115e106?w=1200&q=80',
    'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=1200&q=80'
  ],
  NULL,
  '[{"title":"Celebration cake","description":"Custom design, serves 12.","price":"from £55"},{"title":"Biscuit gift box","description":"12 hand-iced biscuits in a kraft box.","price":"£28"},{"title":"Wedding tier","description":"Three-tier; tasting included.","price":"from £320"}]'::jsonb,
  true, true, false, 'live'),

-- 3. Photographer — startup
('lumiere-studios', 'Lumière Studios', 'ListMio Sample',
  ARRAY['Photography'],
  'Edinburgh-based portrait and brand photography studio. We work with small businesses and growing startups to make your team and product look like the real deal.',
  'Photography that earns a second look.', 2024,
  'Leith, Edinburgh', 'EH6 5HG', '0131 555 0188', 'studio@lumiere.example', 'https://lumiere.example',
  'https://instagram.com/lumierestudios', NULL,
  'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=1200&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=1200&q=80',
    'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=1200&q=80',
    'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1200&q=80'
  ],
  '{"Monday":{"open":true,"start":"09:30","end":"18:00"},"Tuesday":{"open":true,"start":"09:30","end":"18:00"},"Wednesday":{"open":true,"start":"09:30","end":"18:00"},"Thursday":{"open":true,"start":"09:30","end":"18:00"},"Friday":{"open":true,"start":"09:30","end":"18:00"},"Saturday":{"open":false,"start":"09:00","end":"17:00"},"Sunday":{"open":false,"start":"09:00","end":"17:00"}}'::jsonb,
  '[{"title":"Headshot session","description":"60-min studio session, 5 retouched images.","price":"from £180"},{"title":"Brand day","description":"Half-day on-location shoot.","price":"from £650"}]'::jsonb,
  false, false, true, 'live'),

-- 4. Web / marketing studio — startup
('northstack-studio', 'Northstack Studio', 'ListMio Sample',
  ARRAY['IT & Technology','Marketing & Social Media'],
  'A small Leeds studio building fast websites and clear marketing strategy for early-stage UK businesses. Fixed-price projects, friendly process, no surprises.',
  'Websites and growth, without the bloat.', 2023,
  'Kirkstall, Leeds', 'LS5 3AS', NULL, 'hi@northstack.example', 'https://northstack.example',
  'https://instagram.com/northstack.studio', 'https://facebook.com/northstack',
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&q=80',
    'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&q=80'
  ],
  '{"Monday":{"open":true,"start":"09:00","end":"17:30"},"Tuesday":{"open":true,"start":"09:00","end":"17:30"},"Wednesday":{"open":true,"start":"09:00","end":"17:30"},"Thursday":{"open":true,"start":"09:00","end":"17:30"},"Friday":{"open":true,"start":"09:00","end":"15:00"},"Saturday":{"open":false,"start":"09:00","end":"17:00"},"Sunday":{"open":false,"start":"09:00","end":"17:00"}}'::jsonb,
  '[{"title":"Website build","description":"5-page marketing site, mobile-first.","price":"from £1,800"},{"title":"Monthly retainer","description":"Ongoing growth + small changes.","price":"from £600/mo"}]'::jsonb,
  false, false, true, 'live'),

-- 5. Hair salon — women-led
('the-honey-salon', 'The Honey Salon', 'ListMio Sample',
  ARRAY['Beauty & Salon'],
  'Independent hair salon in the Northern Quarter known for warm balayage, lived-in colour and good chats. Aveda colour, walk-in trims on Wednesdays.',
  'Honest hair, honestly priced.', 2017,
  'Northern Quarter, Manchester', 'M4 1HW', '0161 555 0177', 'book@thehoneysalon.example', 'https://thehoneysalon.example',
  'https://instagram.com/thehoneysalon', 'https://facebook.com/thehoneysalon',
  'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200&q=80',
    'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200&q=80'
  ],
  '{"Monday":{"open":false,"start":"09:00","end":"18:00"},"Tuesday":{"open":true,"start":"09:30","end":"19:00"},"Wednesday":{"open":true,"start":"09:30","end":"19:00"},"Thursday":{"open":true,"start":"10:00","end":"20:00"},"Friday":{"open":true,"start":"09:30","end":"18:00"},"Saturday":{"open":true,"start":"09:00","end":"17:00"},"Sunday":{"open":false,"start":"10:00","end":"15:00"}}'::jsonb,
  '[{"title":"Cut & finish","description":"Consult, wash, cut, blow-dry.","price":"from £45"},{"title":"Balayage","description":"Half head, including toner.","price":"from £140"},{"title":"Walk-in trim","description":"Wednesdays only, no booking.","price":"£20"}]'::jsonb,
  true, false, false, 'live'),

-- 6. Plumber — local services
('pipefit-plumbing', 'Pipefit Plumbing', 'ListMio Sample',
  ARRAY['Home Services','Local Services'],
  'Family-run plumbing and heating across Sheffield. Boilers, leaks, bathroom installs. Same-week appointments, transparent pricing, Gas Safe registered.',
  'Family-run, fully Gas Safe.', 2009,
  'Hillsborough, Sheffield', 'S6 2DA', '0114 555 0162', 'jobs@pipefit.example', 'https://pipefit.example',
  NULL, 'https://facebook.com/pipefitplumbing',
  'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=1200&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=1200&q=80'
  ],
  '{"Monday":{"open":true,"start":"08:00","end":"18:00"},"Tuesday":{"open":true,"start":"08:00","end":"18:00"},"Wednesday":{"open":true,"start":"08:00","end":"18:00"},"Thursday":{"open":true,"start":"08:00","end":"18:00"},"Friday":{"open":true,"start":"08:00","end":"17:00"},"Saturday":{"open":true,"start":"09:00","end":"13:00"},"Sunday":{"open":false,"start":"09:00","end":"13:00"}}'::jsonb,
  '[{"title":"Emergency callout","description":"Same-day, daytime hours.","price":"from £85"},{"title":"Boiler service","description":"Annual service + safety check.","price":"£95"},{"title":"Bathroom install","description":"Strip-out, plumbing, tile prep.","price":"from £2,400"}]'::jsonb,
  false, false, false, 'live'),

-- 7. Florist — women-led, home-based
('petals-and-stem', 'Petals & Stem Florist', 'ListMio Sample',
  ARRAY['Handmade & Crafts','Events & Planning'],
  'Small-batch florist working from a home studio in Cardiff. Seasonal British flowers, hand-tied bouquets, weddings and quiet weekly subscriptions.',
  'British flowers, gathered with care.', 2022,
  'Pontcanna, Cardiff', 'CF11 9LJ', NULL, 'hello@petalsandstem.example', 'https://petalsandstem.example',
  'https://instagram.com/petalsandstem', NULL,
  'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=1200&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=1200&q=80',
    'https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=1200&q=80',
    'https://images.unsplash.com/photo-1469259943454-aa100abba749?w=1200&q=80'
  ],
  NULL,
  '[{"title":"Hand-tied bouquet","description":"Seasonal, wrapped to gift.","price":"from £35"},{"title":"Weekly subscription","description":"Fresh flowers every Friday.","price":"from £80/month"},{"title":"Wedding flowers","description":"Bridal, ceremony, table arrangements.","price":"from £450"}]'::jsonb,
  true, true, false, 'live'),

-- 8. Yoga studio — women-led
('calm-studio-yoga', 'Calm Studio Yoga', 'ListMio Sample',
  ARRAY['Health & Wellness','Coaching & Consulting'],
  'A bright Brighton yoga studio with small-group hatha, vinyasa and slow-flow classes. Welcoming for beginners and folk returning after a break. Drop-ins always welcome.',
  'Slow movement, friendly room.', 2018,
  'Kemptown, Brighton', 'BN2 1RH', '01273 555 0143', 'hello@calmstudio.example', 'https://calmstudio.example',
  'https://instagram.com/calmstudio.brighton', 'https://facebook.com/calmstudiobrighton',
  'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=1200&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=1200&q=80',
    'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1200&q=80'
  ],
  '{"Monday":{"open":true,"start":"07:00","end":"21:00"},"Tuesday":{"open":true,"start":"07:00","end":"21:00"},"Wednesday":{"open":true,"start":"07:00","end":"21:00"},"Thursday":{"open":true,"start":"07:00","end":"21:00"},"Friday":{"open":true,"start":"07:00","end":"19:00"},"Saturday":{"open":true,"start":"08:30","end":"16:00"},"Sunday":{"open":true,"start":"09:00","end":"15:00"}}'::jsonb,
  '[{"title":"Drop-in class","description":"All classes, all levels.","price":"£14"},{"title":"5-class pass","description":"Use within 6 weeks.","price":"£60"},{"title":"Beginners course","description":"4 weeks, small group.","price":"£75"}]'::jsonb,
  true, false, false, 'live'),

-- 9. Bookshop — local
('margin-notes-bookshop', 'Margin Notes Bookshop', 'ListMio Sample',
  ARRAY['Local Services','Education & Tutors'],
  'A tightly-curated independent bookshop in Bath specialising in literary fiction, poetry and small-press non-fiction. Reading nights every other Thursday.',
  'Smaller shelves, better books.', 2015,
  'Walcot Street, Bath', 'BA1 5BD', '01225 555 0119', 'hello@marginnotes.example', 'https://marginnotes.example',
  'https://instagram.com/marginnotes.bath', NULL,
  'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&q=80',
    'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1200&q=80'
  ],
  '{"Monday":{"open":false,"start":"10:00","end":"18:00"},"Tuesday":{"open":true,"start":"10:00","end":"18:00"},"Wednesday":{"open":true,"start":"10:00","end":"18:00"},"Thursday":{"open":true,"start":"10:00","end":"20:00"},"Friday":{"open":true,"start":"10:00","end":"18:00"},"Saturday":{"open":true,"start":"09:30","end":"18:00"},"Sunday":{"open":true,"start":"11:00","end":"16:00"}}'::jsonb,
  NULL,
  false, false, false, 'live'),

-- 10. Coffee roastery — startup
('steel-city-roasters', 'Steel City Roasters', 'ListMio Sample',
  ARRAY['Food & Catering'],
  'A small batch coffee roastery in Sheffield. Speciality single origins, monthly subscriptions, and wholesale to a handful of cafes around Yorkshire.',
  'Roasted on Mondays, with you by Friday.', 2023,
  'Kelham Island, Sheffield', 'S3 8SE', NULL, 'hello@steelcityroasters.example', 'https://steelcityroasters.example',
  'https://instagram.com/steelcityroasters', NULL,
  'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=1200&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=1200&q=80',
    'https://images.unsplash.com/photo-1442550528053-c431ecb55509?w=1200&q=80'
  ],
  '{"Monday":{"open":true,"start":"09:00","end":"17:00"},"Tuesday":{"open":true,"start":"09:00","end":"17:00"},"Wednesday":{"open":true,"start":"09:00","end":"17:00"},"Thursday":{"open":true,"start":"09:00","end":"17:00"},"Friday":{"open":true,"start":"09:00","end":"15:00"},"Saturday":{"open":false,"start":"09:00","end":"15:00"},"Sunday":{"open":false,"start":"09:00","end":"15:00"}}'::jsonb,
  '[{"title":"250g whole bean","description":"Single origin, freshly roasted.","price":"£11"},{"title":"Monthly subscription","description":"500g delivered, last Friday of every month.","price":"£18/mo"}]'::jsonb,
  false, false, true, 'live'),

-- 11. Tutor — women-led, home-based
('brightspark-tutors', 'Brightspark Tutors', 'ListMio Sample',
  ARRAY['Education & Tutors'],
  'One-to-one and small-group GCSE and A-level tutoring in Birmingham — maths and the sciences. Friendly, structured, with proper exam prep. Some online slots available.',
  'Confidence first, then exam grades.', 2020,
  'Moseley, Birmingham', 'B13 9DD', '0121 555 0107', 'hello@brightspark.example', 'https://brightspark.example',
  NULL, NULL,
  'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&q=80'
  ],
  '{"Monday":{"open":true,"start":"15:30","end":"20:00"},"Tuesday":{"open":true,"start":"15:30","end":"20:00"},"Wednesday":{"open":true,"start":"15:30","end":"20:00"},"Thursday":{"open":true,"start":"15:30","end":"20:00"},"Friday":{"open":false,"start":"15:30","end":"19:00"},"Saturday":{"open":true,"start":"09:30","end":"14:00"},"Sunday":{"open":false,"start":"10:00","end":"14:00"}}'::jsonb,
  '[{"title":"GCSE Maths","description":"60-min one-to-one session.","price":"£40"},{"title":"A-level Physics","description":"60-min one-to-one session.","price":"£48"},{"title":"Small group","description":"Up to 4 students, weekly.","price":"£28 each"}]'::jsonb,
  true, true, false, 'live'),

-- 12. Joinery / makers
('greycombe-joinery', 'Greycombe Joinery', 'ListMio Sample',
  ARRAY['Handmade & Crafts','Home Services'],
  'A two-person workshop in Newcastle making bespoke shelving, kitchens and small furniture from native British timber. Commissions taken for homes and small businesses.',
  'Made by hand, made to last.', 2014,
  'Ouseburn, Newcastle', 'NE1 2PA', '0191 555 0193', 'commissions@greycombe.example', 'https://greycombe.example',
  'https://instagram.com/greycombe.joinery', 'https://facebook.com/greycombejoinery',
  'https://images.unsplash.com/photo-1503602642458-232111445657?w=1200&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1503602642458-232111445657?w=1200&q=80',
    'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=1200&q=80',
    'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&q=80'
  ],
  '{"Monday":{"open":true,"start":"08:30","end":"17:00"},"Tuesday":{"open":true,"start":"08:30","end":"17:00"},"Wednesday":{"open":true,"start":"08:30","end":"17:00"},"Thursday":{"open":true,"start":"08:30","end":"17:00"},"Friday":{"open":true,"start":"08:30","end":"15:00"},"Saturday":{"open":false,"start":"09:00","end":"13:00"},"Sunday":{"open":false,"start":"09:00","end":"13:00"}}'::jsonb,
  '[{"title":"Built-in shelving","description":"Surveyed, made and installed.","price":"from £950"},{"title":"Bespoke table","description":"Solid oak or ash.","price":"from £1,400"},{"title":"Small kitchen","description":"Cabinets + worktop.","price":"from £6,800"}]'::jsonb,
  false, false, false, 'live')

ON CONFLICT (slug) DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────────
-- To wipe just the sample listings later:
--
-- DELETE FROM businesses WHERE owner_name = 'ListMio Sample';
-- ─────────────────────────────────────────────────────────────────────────
