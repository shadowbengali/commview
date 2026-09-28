## The Heatmiser problem

I have a Heatmiser system controlling the heating in my house.

It has an app.

The app works.

But I do not actually want an app.

I want a warm house at the lowest sensible cost.

Today, achieving that outcome means opening an interface, checking rooms, looking at temperatures, changing settings and managing schedules.

But imagine an AI system has secure access to the heating controls, weather, tariffs and usage patterns.

I could simply say:

> Keep the house comfortable this week, but minimise the cost.

At that point, what is the primary product?

The app?

Or the underlying system that exposes reliable data, permissions and actions to an intelligent interface?

That question gets much more interesting when you apply it to B2B software.

[[FIGURE:inline]]

## What the CRM would look like if it started today

Imagine you were building a CRM from scratch.

Would you begin by designing hundreds of fields, fixed dashboards, menu structures and forms?

Maybe some of them.

But I suspect the starting point would increasingly be the data model, permissions, business logic and actions the system can safely perform.

Then the user could express intent.

> Which opportunities stalled this week and why?

> What do I need to know before tomorrow's meeting with Acme?

> Show me pipeline by region and explain what changed.

> Which accounts need attention today?

The system determines which records, events and context matter, then constructs the answer.

That is fundamentally different from making the user know which report to open, which filters to set and which fields somebody configured six months ago.

The interface moves from:

> Navigate the software correctly.

towards:

> Tell the software what you are trying to achieve.

## Intent-based software is not "put a chatbot on it"

This distinction matters.

There is a lazy version of AI product design that takes an existing application and puts a chat window in the corner.

That is not what I mean.

Intent-based software starts deeper.

The product understands:

- what the user is allowed to do
- what data exists
- how entities relate
- which actions are available
- what requires confirmation
- what requires human judgement
- how to explain what happened

The conversational layer is just one possible interface.

Sometimes the system may respond with text.

Sometimes a table.

Sometimes a chart.

Sometimes an editable workflow.

Sometimes it may carry out an action and ask for confirmation.

The point is that the **intent determines the interface**, rather than the interface forcing the user through a predetermined sequence.

## Three product decisions this changes

### 1. What features are worth building?

Traditional product development often turns recurring requests into interface features.

Add a report.

Add a filter.

Add another dashboard.

Add an export.

But if an intelligent layer can assemble the answer dynamically from governed data, some interface features become unnecessary.

The product question changes from:

> Should we build this screen?

to:

> What capability does the user actually need?

That could materially change roadmaps.

### 2. What interfaces are worth designing?

Design does not disappear.

It becomes more important in different places.

Users still need to understand state, consequences, confidence, permissions and available actions.

If AI performs more of the navigation, designers have to make the resulting interaction trustworthy and controllable.

A generated answer with no provenance can be worse than an old-fashioned dashboard.

A system taking an action without clear confirmation can be dangerous.

The craft moves.

It does not vanish.

### 3. What data models become strategic?

If the interface can be generated around intent, the quality of the underlying data becomes even more important.

The system needs to know that a contact belongs to an account, an account has opportunities, opportunities have interactions, products have usage events and users have permissions.

Messy relationships create messy AI.

That makes architecture, semantics and governance product concerns, not just technical concerns.

The beautiful conversational interface is the visible layer.

The difficult product is underneath it.

## What changes for product managers

AI can accelerate a lot of the mechanical work around product.

User journeys.

Prototype creation.

Specifications.

Research synthesis.

Draft stories.

Analysis.

That does not mean AI should decide the roadmap.

The hard questions remain human questions.

Who are we building for?

Which problem matters?

What trade-off are we making?

What evidence do we trust?

What risk are we willing to accept?

What should we deliberately not build?

AI makes execution faster.

That makes judgement more important, not less.

If a team can now prototype five ideas in the time it previously took to prototype one, it has not solved prioritisation.

It has created five things to prioritise.

## Where traditional interfaces still win

AI-first should not become AI-only.

There are plenty of situations where a conventional interface is better.

### Precision

If I am editing a financial model, I may want exact control over cells, formulas and assumptions rather than describing every change conversationally.

### Comparison

Humans are good at scanning structured visual information.

A table of ten options may be better than a conversational description of them.

### Creative manipulation

Design, video, documents and spatial work often benefit from direct manipulation.

### High-risk actions

When money, access, legal commitments or destructive changes are involved, explicit interfaces and confirmation can reduce ambiguity.

### Repeated expert workflows

An experienced user may complete a familiar task faster with a purpose-built interface than by explaining the task every time.

The future is unlikely to be one enormous chat box.

It is more likely to be software that can choose the right interaction for the user's intent.

## The question I would ask before building software now

Not:

> How do we add AI to this product?

Ask:

> If the user could simply state the outcome they wanted, which parts of this interface would still need to exist?

Some will survive.

Some will become dynamically generated.

Some will disappear.

And some products may discover that the interface was never the valuable part in the first place.

The valuable part was the data, permissions, logic and ability to make something happen.

That is a much more radical product question than adding a copilot.
