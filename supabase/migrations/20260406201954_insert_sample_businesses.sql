/*
  # Insert Sample Business Data

  Populates the businesses table with realistic mock data including:
  - Diverse business categories
  - Mix of women-led and traditional businesses
  - Various locations across the UK
  - Realistic business descriptions
*/

INSERT INTO businesses (name, category, description, location, postcode, phone, email, website, is_women_owned, is_home_based, is_startup, is_featured, image_url) VALUES
('Bloom & Co Floristry', 'Home Services', 'Bespoke floral arrangements for weddings, events, and everyday occasions. Specializing in sustainable, locally-sourced flowers.', 'Bristol', 'BS1 4DJ', '0117 123 4567', 'hello@bloomandco.co.uk', 'https://bloomandco.co.uk', true, false, false, true, 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800'),

('Tech Savvy Solutions', 'IT & Technology', 'Full-service IT support for small businesses. From cloud migration to cybersecurity, we keep your business running smoothly.', 'London', 'EC1A 1BB', '020 7946 0958', 'info@techsavvy.io', 'https://techsavvy.io', true, false, true, true, 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800'),

('The Wellness Studio', 'Health & Wellness', 'Yoga, pilates, and mindfulness classes in a welcoming community space. All levels welcome.', 'Manchester', 'M1 1AE', '0161 123 4567', 'studio@wellnessmcr.com', 'https://wellnessmcr.com', true, false, false, false, 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800'),

('Artisan Coffee Roasters', 'Food & Catering', 'Small-batch coffee roastery sourcing ethical beans from around the world. Wholesale and retail available.', 'Edinburgh', 'EH1 1YZ', '0131 123 4567', 'beans@artisancoffee.scot', 'https://artisancoffee.scot', false, false, true, true, 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800'),

('Bright Beginnings Tutoring', 'Education & Tutors', 'One-on-one and group tutoring for primary and secondary students. English, maths, and science specialists.', 'Birmingham', 'B1 1BB', '0121 123 4567', 'learn@brightbeginnings.edu', 'https://brightbeginnings.edu', true, true, false, false, 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800'),

('Pixel Perfect Design', 'Marketing & Social Media', 'Brand identity, web design, and digital marketing for growing businesses. Let your brand shine.', 'Leeds', 'LS1 1BA', '0113 123 4567', 'hello@pixelperfect.design', 'https://pixelperfect.design', true, true, true, false, 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800'),

('Crafted with Love', 'Handmade & Crafts', 'Handcrafted jewelry, home decor, and personalized gifts. Each piece tells a story.', 'Cardiff', 'CF10 1DD', '029 2123 4567', 'create@craftedwithlove.wales', 'https://craftedwithlove.wales', true, true, false, false, 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800'),

('Green Thumb Gardening', 'Local Services', 'Professional garden maintenance, landscaping design, and seasonal planting services.', 'Liverpool', 'L1 1JQ', '0151 123 4567', 'gardens@greenthumb.services', 'https://greenthumb.services', false, false, false, false, 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800'),

('Style & Grace Salon', 'Beauty & Salon', 'Full-service hair salon offering cuts, color, and treatments in a relaxing atmosphere.', 'Newcastle', 'NE1 1EE', '0191 123 4567', 'book@styleandgrace.salon', 'https://styleandgrace.salon', true, false, false, true, 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800'),

('The Content Collective', 'Writers & Content Creators', 'Freelance content writing, copywriting, and editorial services for brands and publications.', 'Brighton', 'BN1 1AA', '01273 123456', 'write@contentcollective.co.uk', 'https://contentcollective.co.uk', true, true, true, false, 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800'),

('Milestone Events', 'Events & Planning', 'Full-service event planning for weddings, corporate events, and celebrations. Every detail perfected.', 'Oxford', 'OX1 1AA', '01865 123456', 'events@milestone.events', 'https://milestone.events', true, false, false, false, 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800'),

('Urban Yoga Collective', 'Coaching & Consulting', 'Wellness coaching, corporate yoga sessions, and mindfulness training for modern professionals.', 'Cambridge', 'CB1 1AA', '01223 123456', 'hello@urbanyoga.uk', 'https://urbanyoga.uk', true, false, true, false, 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800'),

('Fresh Bakes Bakery', 'Food & Catering', 'Artisan breads, pastries, and custom cakes. Using organic flour and traditional techniques.', 'Bath', 'BA1 1AA', '01225 123456', 'order@freshbakes.co.uk', 'https://freshbakes.co.uk', true, false, false, false, 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800'),

('Click & Capture Photography', 'Photography', 'Professional photography for weddings, portraits, and commercial projects. Telling your story through images.', 'Nottingham', 'NG1 1AA', '0115 123 4567', 'book@clickcapture.photo', 'https://clickcapture.photo', false, true, false, false, 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800'),

('Savvy Social Media', 'Marketing & Social Media', 'Social media management and strategy for small businesses. Grow your online presence.', 'Sheffield', 'S1 1AA', '0114 123 4567', 'hello@savvysocial.agency', 'https://savvysocial.agency', true, true, true, false, 'https://images.unsplash.com/photo-1611926653458-09294b3142bf?w=800'),

('Handmade by Hannah', 'Fashion & Clothing', 'Sustainable fashion and custom clothing alterations. Quality craftsmanship, ethical practices.', 'Reading', 'RG1 1AA', '0118 123 4567', 'hannah@handmadebyhannah.com', 'https://handmadebyhannah.com', true, true, false, true, 'https://images.unsplash.com/photo-1558769132-cb1aea6c8f61?w=800'),

('Peak Performance Coaching', 'Coaching & Consulting', 'Business coaching and leadership development for entrepreneurs and executives.', 'Plymouth', 'PL1 1AA', '01752 123456', 'coach@peakperformance.consulting', 'https://peakperformance.consulting', false, true, false, false, 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800'),

('Little Learners Nursery', 'Education & Tutors', 'Montessori-inspired early years education in a nurturing environment.', 'Southampton', 'SO14 0AA', '023 8012 3456', 'enquiries@littlelearners.education', 'https://littlelearners.education', true, false, false, false, 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800'),

('Code & Create Academy', 'IT & Technology', 'Coding classes and workshops for children and adults. From beginner to advanced.', 'York', 'YO1 1AA', '01904 123456', 'learn@codecreate.academy', 'https://codecreate.academy', true, false, true, false, 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800'),

('The Repair Shop', 'Local Services', 'Electronics repair, phone screen replacement, and device troubleshooting. Fast, affordable service.', 'Gloucester', 'GL1 1AA', '01452 123456', 'fix@repairshop.services', 'https://repairshop.services', false, false, false, false, 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800');
