## The four adoption failure modes

You shipped the feature.

The release went out.

Marketing announced it.

Product waited for usage to climb.

It did not.

The easiest conclusion is:

> Customers don't want it.

That might be true.

But "low adoption" describes the outcome, not the cause.

I would separate four failure modes.

### Discovery gap

The right customers would value the feature, but they do not know it exists or do not encounter it at the right moment.

### Activation gap

They find it and may even try it, but too much effort sits between discovery and useful first use.

### Value gap

They use it but it does not solve the problem well enough to change behaviour.

### Retention gap

They reach value once but do not develop a reason to return.

Those four problems require different responses.

Promoting a feature with a value gap just sends more people towards disappointment.

Redesigning a useful feature when the real issue is discovery wastes product capacity.

Diagnose first.

## Discovery, activation or value gap?

The funnel for feature adoption should be observable.

Not necessarily with a giant analytics project. Start with a few meaningful events.

**Eligible:** How many users could reasonably benefit?

**Exposed:** How many actually encountered the feature or its entry point?

**Started:** How many began using it?

**Activated:** How many reached the first meaningful value event?

**Repeated:** How many returned or incorporated it into normal behaviour?

Now the shape tells you something.

High eligibility but low exposure suggests discovery.

Strong exposure but weak starts can indicate poor relevance, unclear messaging or perceived effort.

Strong starts but weak activation points towards onboarding, usability or setup friction.

Strong activation but poor repeat usage suggests the value is episodic, weak or already satisfied elsewhere.

Do not reduce everything to "monthly active users".

Different products have different value rhythms.

A payroll feature may be valuable once a month.

A reporting feature may matter weekly.

A security control may be extremely valuable while rarely being touched.

Define adoption around the job the feature exists to perform.

[[FIGURE:inline]]

## When you shipped what customers said instead of what they needed

Customers are excellent sources of evidence.

They are not obliged to design your product for you.

A customer might say:

> We need an export button here.

The literal requirement is an export button.

The underlying need could be:

> Every Friday I have to give Finance a report and the current workflow takes me two hours.

Those are not the same thing.

Perhaps export is right.

Perhaps scheduled reporting solves it better.

Perhaps Finance should have controlled access.

Perhaps the information should flow automatically into another system.

If discovery captures only the requested solution, you can build exactly what the customer asked for and still fail to solve the problem.

This is also why feature-request volume can be misleading.

Ten requests for ten different capabilities may represent ten separate problems.

Or they may be ten workarounds for the same underlying job.

Product discovery exists to tell the difference.

## Instrumenting product adoption properly

Instrumentation should begin before development finishes.

For each meaningful feature, define:

### The target user

Who is expected to use it?

If everybody is the answer, the definition is probably too broad.

### The trigger

What situation should make the user need it?

### The activation event

What observable behaviour tells you they reached initial value?

Not "clicked the feature".

Value.

### The repeat behaviour

If the feature should become habitual, what indicates that?

### The outcome

What should change for the customer or business?

Time saved. Tasks completed. Errors reduced. Retention improved. Expansion enabled.

Then combine analytics with qualitative evidence.

Data can show where people stop.

It does not always tell you why.

A handful of well-selected user conversations can explain more than another dashboard when the behaviour is ambiguous.

## What to change before shipping the next feature

Do not wait until launch to think about adoption.

Before development, define:

**Discovery moment:** Where should the right user naturally encounter this?

**Activation path:** What is the shortest route from discovery to value?

**Value event:** What tells us the feature solved something meaningful?

**Measurement:** Are the events instrumented?

**Communication:** Does the user need education, or should the product make the value obvious in context?

**Follow-up:** What will we do if exposure is high but activation is weak?

This turns adoption from a launch problem into a product decision.

And sometimes the answer is not to improve adoption at all.

A feature may serve a small but commercially important group.

If it protects retention, unlocks a strategic segment or removes significant operational cost, low percentage adoption may be perfectly acceptable.

Again, context matters more than the headline metric.
