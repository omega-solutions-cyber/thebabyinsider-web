# Hero image prompts

Prompts for generating the 10 article hero images with OpenAI image generation
(`gpt-image-1`). Every current image in `content/articles/**` is a generated
gradient placeholder that says so on the image — all of them must be replaced.

## Technical spec

- **Size: `1536x1024` (3:2 landscape).** This is the only size that survives
  every crop the site applies. The same file is re-cropped to 16:9 on the
  article page, 4:3 on cards, and a tall 1:1-ish panel in the homepage hero
  mosaic.
- **Composition must be crop-safe.** Keep the subject roughly centred and away
  from the outer 12% on every edge — that margin is what gets cut.
- **Keep the lower-left quadrant visually quiet** (out-of-focus, plain surface,
  or shadow). Headlines and category pills are overlaid there on the homepage
  mosaic, and busy detail behind them costs legibility.
- **No text, no logos, no watermarks, no UI chrome** anywhere in the frame.
- Save as `hero.jpg` inside the article's own folder, e.g.
  `content/articles/sleep/newborn-wake-windows/hero.jpg`. Velite picks up
  dimensions and generates the blur placeholder automatically.

## House style (applies to every image)

> Candid documentary photography, not stock. Soft natural window light, warm
> neutral palette (cream, oatmeal, muted sage, pale wood), shallow depth of
> field, gentle film grain. Real domestic interiors with a lived-in feel —
> slightly imperfect, never staged or glossy. Muted, desaturated colour
> grading. No text, logos or watermarks. Photorealistic.

Keep this paragraph in every prompt so the ten images read as one publication
rather than ten unrelated stock buys.

## Editorial safety — read before generating

Four of these images sit next to clinical guidance, and an image that
contradicts the article is worse than no image. These are not stylistic notes:

- **Any cot or sleep surface in frame must be AAP-compliant**: baby on their
  **back**, firm flat mattress, fitted sheet only. No pillows, blankets,
  bumpers, positioners or soft toys. This applies to images 1, 2 and 7.
- **Image 6 (first foods)** must not show honey, whole grapes, whole nuts,
  popcorn or large chunks of raw hard vegetable — all are choking or botulism
  hazards the article explicitly warns about.
- **Image 3 (tummy time)** must be on a firm flat surface, clearly supervised.
- Reject any generation that gets these wrong, however good it looks.

---

## Batch 1 — 8 images

Paste as a single prompt; generate at `1536x1024`.

> Generate 8 separate photorealistic images, each **1536x1024 (3:2 landscape)**.
>
> Shared style for all eight: candid documentary photography, not stock. Soft
> natural window light, warm neutral palette (cream, oatmeal, muted sage, pale
> wood), shallow depth of field, gentle film grain. Real domestic interiors with
> a lived-in feel — slightly imperfect, never staged or glossy. Muted,
> desaturated colour grading. No text, logos, watermarks or on-screen UI. Keep
> the subject centred with clear margin on all edges, and keep the lower-left
> area of each frame visually quiet.
>
> **1 — Newborn sleep, safe cot.** A sleeping newborn lying **on their back** in
> a plain wooden cot. Firm flat mattress with a fitted sheet only — absolutely
> no pillows, blankets, bumpers, positioners or toys anywhere in the cot. Baby
> in a plain sleeveless sleep sack. Early morning light through a sheer curtain.
> Calm and clinical-safe, but warm.
>
> **2 — Exhausted parent at night.** A parent in their thirties sitting on the
> edge of a bed in a dim bedroom at night, elbows on knees, rubbing their eyes.
> A cot visible behind them, **bare except for a fitted sheet**. Single warm
> lamp as the only light source, deep shadows, blue-grey ambient tone. Conveys
> exhaustion and endurance, not distress or danger.
>
> **3 — Tummy time.** A roughly four-month-old baby on their front on a firm
> flat play mat on the floor, pushing up on their forearms with head lifted,
> looking slightly off-camera. An adult's hands visible at the edge of frame,
> clearly supervising. Bright diffused daylight, plain uncluttered rug.
>
> **4 — Parent comparing apps on a phone.** Close, over-the-shoulder view of a
> parent holding a smartphone while a baby plays out of focus in the background.
> The phone screen is **blank, dark or entirely out of focus — no readable UI,
> text or app interface**. Kitchen table, morning light, coffee cup nearby.
>
> **5 — Phone on a kitchen counter.** A smartphone lying face-up on a pale wood
> kitchen counter beside a mug and a folded muslin cloth. The screen is
> **off/black and reflective — no UI or text of any kind**. Soft side light,
> shallow depth of field, one bright highlight on the glass.
>
> **6 — First foods.** A small ceramic bowl of smooth orange vegetable purée and
> a soft-tipped baby spoon on a high-chair tray, with a few pieces of
> well-cooked soft vegetable alongside. **No honey, no whole grapes, no whole
> nuts, no popcorn, no raw hard vegetable chunks.** Overhead angle, natural
> daylight, a little mess on the tray to feel real.
>
> **7 — Empty safe cot.** An empty wooden cot photographed from a low
> three-quarter angle in a quiet nursery. Firm flat mattress, fitted sheet only,
> **completely bare — nothing else in the cot at all**. Soft daylight, plain
> wall, one out-of-focus plant at the edge. Calm and reassuring rather than
> stark.
>
> **8 — Thermometer.** A modern white digital thermometer resting on a folded
> pale muslin cloth on a plain surface. **Display blank — no numbers or text.**
> Very shallow depth of field, soft directional light, cool-neutral tone with
> warm background falloff. Quiet and clinical, not alarming.

## Batch 2 — remaining 2 images

> Generate 2 separate photorealistic images, each **1536x1024 (3:2 landscape)**.
>
> Shared style: candid documentary photography, not stock. Soft natural window
> light, warm neutral palette (cream, oatmeal, muted sage, pale wood), shallow
> depth of field, gentle film grain. Lived-in domestic interiors, slightly
> imperfect, never glossy. Muted desaturated grading. No text, logos or
> watermarks. Subject centred with clear edge margin; lower-left area kept
> visually quiet.
>
> **9 — Parental burnout.** A parent sitting alone on a sofa in low evening
> light, staring into the middle distance, a muslin cloth and a baby toy beside
> them. Room otherwise empty. Warm lamp against cool blue window light. Reads as
> depleted and human — **not** clinically depressed, crying, or in crisis.
>
> **10 — Third-trimester hospital bag.** A part-packed weekend bag open on a bed
> beside neatly folded newborn clothes, a muslin square and a rolled towel. Late
> afternoon light across the duvet. Organised but mid-task, with a few items
> still loose.

---

## Batch 3 — advertorial (conversational turns)

This one deliberately breaks the house style. It is the hero for a paid-traffic
advertorial, so its job is to stop the scroll: more contrast, tighter framing,
a moment of visible tension. Keep it photorealistic and believable. No glowing
brains, neural-network overlays or fake scan imagery, because the article is
built on real research and a sci-fi visual would make it look like clickbait.

> Generate a photorealistic image, **1536x1024 (3:2 landscape)**.
>
> **11 — The moment of a conversational turn.** Extreme close-up, eye level, of
> a roughly 18-month-old toddler mid-word: mouth open in a small "o", eyebrows
> raised, eyes wide and locked on an adult just out of focus in the right
> foreground (only the soft curve of the parent's cheek and jaw visible, leaning
> in, clearly listening). The toddler's face is sharp and fills the centre third
> of the frame. Dramatic single-source window light from the left, Rembrandt-
> style, so one side of the toddler's face glows warm and the other falls into
> deep shadow; the background drops to near-black. A faint catchlight in both
> eyes. The feeling is electric and intimate, a split second you would normally
> miss, like a still from a nature documentary rather than a stock photo. Rich
> but natural skin tones, fine film grain, shallow depth of field (f/1.8 look).
> Lower-left quadrant in soft shadow. No text, logos or watermarks.

**Alternate, curiosity angle (11b).** Same lighting and framing rules, but the
toddler sits on a kitchen floor wearing a plain cotton vest with a small, matte
black audio recorder tucked into a chest pocket, the kind researchers used in
the study. The toddler is pointing at something out of frame and looking back
at an adult, mid-babble. The recorder should be noticeable but not explained:
the reader's first question should be "why is that baby wearing a recorder?"

Save as `content/articles/milestones/toddler-conversation-turns/hero.jpg`, then
delete the placeholder `hero.webp` there and update `heroImage` and
`heroImageAlt` in the frontmatter.

## File mapping

| #   | Save to                                                           |
| --- | ----------------------------------------------------------------- |
| 1   | `content/articles/sleep/newborn-wake-windows/hero.jpg`            |
| 2   | `content/articles/sleep/four-month-sleep-regression/hero.jpg`     |
| 3   | `content/articles/milestones/when-do-babies-roll-over/hero.jpg`   |
| 4   | `content/articles/gear/best-baby-milestone-apps/hero.jpg`         |
| 5   | `content/articles/gear/babyleap-review/hero.jpg`                  |
| 6   | `content/articles/feeding/starting-solids-first-foods/hero.jpg`   |
| 7   | `content/articles/newborn/aap-safe-sleep-update/hero.jpg`         |
| 8   | `content/articles/health/baby-fever-when-to-call/hero.jpg`        |
| 9   | `content/articles/parenting/parental-burnout-first-year/hero.jpg` |
| 10  | `content/articles/pregnancy/third-trimester-checklist/hero.jpg`   |

After dropping the files in, run `pnpm content` — Velite re-hashes them,
extracts dimensions and regenerates blur placeholders. Then check each article's
`heroImageAlt` in its frontmatter still describes what the new image actually
shows; the alt text is currently written against the placeholder brief.

## One caveat on AI-generated imagery

Generated photos of people are fine to publish, but two things are worth
deciding deliberately rather than by default:

- Some jurisdictions and platforms expect AI-generated imagery to be labelled.
  If you want that, add an `heroImageCredit: 'Illustration generated with AI'`
  line to the frontmatter — the article page already renders it.
- Generated medical or clinical scenes get details subtly wrong more often than
  they look like they do. The four safety notes above are the ones that matter
  here, but give every image a second look before it ships next to clinical
  guidance.
