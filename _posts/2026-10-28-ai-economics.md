---
layout: post
title: "Why the Economics of AI Do Not Add Up"
description: "Subsidised token prices, missing ROI, an exposed Indian IT industry and a trillion-dollar capex bubble: why the way companies use AI today does not add up."
date: 2026-10-28 19:30:00 +0530
categories: [AI, Economics, Engineering]
tags: [AI, LLM, Agentic-AI, Tokens, Unit-Economics, ROI, AI-Bubble, Hyperscalers, Data-Centres, Venture-Capital, Indian-IT, Future-of-Work]
image:
  path: /assets/img/headers/ai-economics/ai-economics.webp
  lqip: data:image/webp;base64,UklGRlAAAABXRUJQVlA4IEQAAABQAwCdASoUAA4APtFUo0uoJKMhsAgBABoJagCdMoABz8jwwADWO4o2+lZbNh//4VroYh9gMtJw+1OLxu73r0XP5m7wAA==
---

## Background

A note before anything else: I am not against AI. This post is about the money, which is the part nobody at the keynote wants to talk about.

Earlier this year, Uber's CTO, Praveen Neppalli Naga, admitted something that should have been a much bigger story: the company had [burnt through its entire 2026 Claude Code budget by April](https://qz.com/uber-coo-ai-spending-harder-justify-052626). Adoption among Uber's engineers reportedly jumped from about a third in February to 84% by March. During one demo, the CTO himself ran up about $1,200 in roughly two hours.

Then came the line that stuck with me. Uber's COO, Andrew Macdonald, called the disclosure a "head-exploding moment" and said: *"We're going to have to start talking about token consumption and the associated cost versus headcount."* He also admitted it is hard to draw a line from the usage stats to *"Okay, now we're actually producing 25 percent more useful consumer features."*

I enjoyed that more than I should have. Uber spent most of a decade selling us rides below cost on investor money, and only posted its first full-year operating profit in 2023. If anyone should recognise a subsidised product when they see one, it is Uber.

So I went digging, expecting a one-off. It is not a one-off. The deeper I went, the bigger it got: token bills, then jobs, then India's IT industry, then who will be left to buy anything, then who trains the next generation of engineers, then a trillion-dollar bubble held together by investors who mostly just want an exit.

My stand, up front: **the way companies are using AI right now is not financially or economically sustainable** for the buyers, the sellers, or the economy they both depend on.

## The price you see is not the price

Almost every AI price you see today is subsidised.

In January 2025, Sam Altman posted that OpenAI was [losing money on its $200-a-month ChatGPT Pro subscription](https://fortune.com/2025/01/07/sam-altman-openai-chatgpt-pro-subscription-losing-money-tech) because *"people use it much more than we expected."* He said he picked that price himself and thought they would make money on it. So even at $200 a month per person, the product loses money.

At the company level, things get even worse. OpenAI's own projections, reported by [The Information](https://www.theinformation.com/articles/openai-projections-imply-losses-tripling-to-14-billion-in-2026), implied losses of up to $14 billion in 2026, before stock compensation, roughly triple the expected 2024 loss. Further out, a presentation reported by the Financial Times projects [about $278 billion in cumulative negative free cash flow from 2026 to 2030](https://www.tomshardware.com/tech-industry/artificial-intelligence/openai-projections-point-to-a-massive-usd278-billion-cash-burn-through-2030-that-exceeds-the-national-budgets-of-indonesia-and-norway-usd856-billion-compute-tab-outpaces-tenfold-revenue-surge). The revenue is real and growing fast. The compute spend is growing faster.

Think of the early days of food delivery apps: free delivery, 60% off coupons, cashback on everything. The apps were buying a habit with someone else's money. Once the market was captured, the delivery fees, platform fees, "small cart" fees and surge pricing showed up. The food did not get any better.

Every company that has rebuilt its workflows around today's AI pricing has made the same bet the delivery app customer made: that the discount is permanent. Someone eventually has to pay for the GPUs, and investors do not fund losses forever.

One layer down from the labs sit thousands of "AI-native" startups building on these APIs, and their unit economics only work at promotional rates. Traditional SaaS ran at gross margins of 60 to 80% or more because software's marginal cost was near zero. AI products do not get that luxury. Inference is a cost of goods sold, and every user action burns real GPU time.

a16z, one of the biggest investors in this ecosystem, [pointed this out all the way back in 2020](https://a16z.com/the-new-business-of-ai-and-how-its-different-from-traditional-software/): AI businesses look more like services than software, with gross margins closer to 50 to 60%, and agentic products today often run lower than that. Which means a good slice of the "AI revenue" everyone celebrates is a pass-through. The startup collects $20 a seat from you, forwards most of it to OpenAI or Anthropic, and keeps a thin spread on rented intelligence. If the labs ever price for reality, that spread disappears overnight, and with it a layer of the ecosystem that was never really a business.

## The meter is already running

Price increases have already begun. So far they are arriving as billing changes, with no headline price hike to point at.

On June 1, 2026, GitHub moved [all Copilot plans to usage-based billing](https://github.blog/changelog/2026/04/27/github-copilot-is-moving-to-usage-based-billing/). Premium requests are gone; you now get a monthly allotment of AI Credits, and usage is calculated on token consumption (input, output and cached) at each model's API rate. In practice, the flat fee is now the least you will pay.

Cursor tried the same approach a year earlier. When it switched its Pro plan to a usage pool billed at API rates in June 2025, users reported running out after just a handful of prompts on Claude models. Some were hit with unexpected overage charges, and the CEO had to [apologise publicly](https://techcrunch.com/2025/07/07/cursor-apologizes-for-unclear-pricing-changes-that-upset-users/).

In May 2026, Microsoft's Experiences + Devices division (Windows, Microsoft 365, Teams, Surface) [started cancelling most of its internal Claude Code licences](https://the-decoder.com/microsoft-pulls-claude-code-licenses-and-pushes-developers-back-toward-its-own-ai-tool/) and moving engineers to GitHub Copilot CLI. The official reason was strategic: they would rather dogfood their own tool, but [reporting also pointed to operating costs](https://windowscentral.com/microsoft/microsoft-cancels-claude-code-licenses-shifting-developers-to-github-copilot-cli-a-move-likely-driven-by-financial-motives) going into the new fiscal year. If a company that *owns a hyperscale cloud* is watching its AI bill, everyone else should be too.

Gartner now predicts that [spending on AI coding agents will exceed the average developer's salary by 2028](https://devops.com/ai-coding-costs-could-exceed-developer-salaries-gartner-warns/). Nearly a quarter of tech leaders are already spending $200 to $500 per developer per month on tokens, and about 6% are spending over $2,000. (Hold on to that $2,000 number. It matters a lot more once we get to India.)

*Technical note:* agentic tools burn money fast for a simple reason. Every turn of an agent loop resends the growing context, files, tool outputs, and previous turns back to the model. A long session therefore costs something like the sum of an ever-growing context, resent over and over. Counting prompts and multiplying by a price per prompt badly undercounts it. Prompt caching helps a lot, but the shape of the curve is still there. A chat assistant is a taxi ride. An agent left running all afternoon is a taxi you forgot to send away.

## "Replace the humans" has a refund policy

The other half of the AI business case is headcount: spend on AI, save on people. On paper it makes sense. In practice, several high-profile companies have walked it back.

Klarna was the poster child. It claimed its AI assistant was handling 75% of customer chats and froze hiring. By 2025, the CEO was telling Bloomberg they were [hiring human agents again](https://www.peoplematters.in/news/leadership/this-ceos-regret-about-ai-will-change-how-you-view-automation-45640), because cost had been *"a too predominant evaluation factor"* in how support was organised, and *"what you end up having is lower quality."*

Commonwealth Bank of Australia reversed itself much faster. In July 2025, CBA announced an AI voice bot would replace 45 customer service roles. A month later, it apologised and admitted the roles were not redundant after all. According to the union, call volumes had gone up, and team leaders were pulled in to answer phones.

Taco Bell rolled out voice AI to over 500 US drive-thrus. Then someone [ordered 18,000 cups of water](https://www.computing.co.uk/news/2025/ai/taco-bell-scales-back-ai-tests-after-customer-complaints), the clips went viral, and the company's chief digital officer told the WSJ they would now think carefully about where to use AI, including possibly not at drive-thrus.

In all three cases, AI shifted the cost elsewhere. The savings appeared on one line of the spreadsheet, while the bill arrived on others: customer churn, overtime, brand damage, rehiring, retraining.

Builder.ai is the extreme version. The Microsoft-backed startup raised around $445 million by selling "AI that builds your app". When it collapsed into insolvency in 2025, reports claimed that about 700 human engineers, mostly in India, did much of the work its "AI" was credited with (former staff have disputed that framing), and that its revenue had been massively overstated. If the reports are right, the AI *was* the humans.

## The ROI nobody can find

Credit where it is due: companies are not stupid for trying. Boards and investors are leaning hard on them to "do something with AI". The trouble is that few of them can show it is paying for itself.

MIT NANDA's *State of AI in Business 2025* report found that [about 95% of enterprise generative AI pilots produced no measurable impact on P&L](https://fortune.com/2025/08/18/mit-report-95-percent-generative-ai-pilots-at-companies-failing-cfo). The sample was modest, around 150 interviews, 350 employee surveys and 300 public deployments, so treat the exact number with some salt. Even if it is off by a lot, it is not a good number.

Gartner is no kinder. It predicts [over 40% of agentic AI projects will be scrapped by the end of 2027](https://www.outlookbusiness.com/artificial-intelligence/over-40-of-agentic-ai-projects-will-be-scrapped-by-2027-says-gartner) because of escalating costs and unclear business value. It also estimates that only about 130 of the thousands of "agentic AI" vendors are the real thing. The rest is agent-washing.

My favourite is the METR study. METR ran a controlled study with experienced open-source developers working on codebases they knew well. With AI tools, they [took about 19% longer](https://newsletter.getdx.com/p/metr-study-on-how-ai-affects-developer-productivity) to finish tasks. Yet they *believed* AI had made them about 20% faster.

If the people using the tool feel faster while being slower, then every internal survey saying "our engineers love it and it saves them hours" is close to worthless as evidence of ROI. Which brings us right back to Uber's COO, who has the token bill in one hand and the shipped features in the other, and cannot connect the two. METR's study was in early 2025, and the models have improved since. The perception gap sits with the people using them, though, and better models have not closed it.

Step back from individual companies to the whole economy, and you get a number you will rarely hear on a keynote stage. Daron Acemoglu, the MIT economist who won the 2024 Nobel Prize, modelled AI's macroeconomic impact in [*The Simple Macroeconomics of AI*](https://www.nber.org/papers/w32487) and arrived at a total factor productivity gain of *no more than 0.66% over ten years*. He then argued that even that was probably too generous, because early evidence comes from easy-to-learn tasks, and revised it to under 0.53%. The implied GDP boost works out to roughly 1%, and that is for the whole decade combined.

His model is deliberately conservative, but that is the point: these are the numbers you get *before* you start arguing about whether the models get dramatically better. Hold them up against the roughly $700 billion a year of capex we will get to later, and ask what "measurable impact on P&L" is supposed to look like even if everything goes right.

None of this is new, by the way. In 1987, the economist Robert Solow wrote: *"You can see the computer age everywhere but in the productivity statistics."* Companies spent years pouring money into computers, and economists spent [more than a decade arguing](https://www.brookings.edu/articles/the-solow-productivity-paradox-what-do-computers-do-to-productivity/) about why productivity numbers barely moved. The standard defence is that the gains show up eventually. Maybe. But "eventually" is doing a lot of heavy lifting when your annual AI budget runs out in April.

## Costs that never show up on the invoice

The token bill is the cost everyone can see. The more expensive ones never appear on an invoice from OpenAI or Anthropic.

Start with being wrong. In 2025, Deloitte Australia [had to refund part of an A$440,000 government contract](https://www.techspot.com/news/109758-deloitte-admits-ai-hallucinated-quotes-government-report-offers.html) after a University of Sydney academic found the report cited papers that did not exist. The corrected version quietly added a disclosure that a GPT-4o-based tool chain had been used. That is a Big Four firm, billing a government, caught shipping hallucinations. A year earlier, a Canadian tribunal [ruled Air Canada liable](https://dailyhive.com/canada/air-canada-chatbot-decision) for a bereavement refund policy its chatbot made up. It rejected the airline's argument that it was not responsible for what its own chatbot said. The amount was small, around C$650. The precedent is not: your AI's mistakes are legally your mistakes.

Then there is what researchers from Stanford's Social Media Lab and BetterUp Labs named "workslop" in Harvard Business Review: AI-generated work that looks polished but does not move the task forward. In their survey of 1,150 US employees, 40% said they had received some recently, and each instance took nearly two hours to deal with. They put the cost at [about $186 per employee per month](https://www.govtech.com/question-of-the-day/what-is-ai-generated-workslop-and-is-it-costing-businesses-money), or roughly $9 million a year for a 10,000-person company. The person who generated it saved ten minutes. Their colleague lost two hours. Guess which one the adoption dashboard records as a win.

Code is the third one, and it compounds. GitClear analysed 211 million changed lines of code from 2020 to 2024 and found [copy-pasted code going up while refactoring fell sharply](https://www.i-programmer.info/news/105-artificial-intelligence/17871-gitclear-reveals-ais-negative-impact-on-code-quality.html), with duplicated blocks of five or more lines roughly eight times more frequent in 2024. The data shows a correlation, not causation. But every engineer knows what duplicated, unrefactored code turns into. Technical debt has the worst interest rate in the industry, because you pay it in engineer-hours, years later, usually during an outage.

## The bill lands on everyone else

The costs do not stay inside the tech industry, either. AI is being pushed into every domain at once, and in each one the same thing happens: someone who never signed up for it ends up paying.

Start with media. A [Pew Research study](https://the-decoder.com/pew-finds-that-only-1-percent-of-users-click-a-source-link-directly-from-googles-ai-overviews/) of nearly 69,000 real Google searches found that when an AI Overview appeared, users clicked a result about 8% of the time, against 15% without one, and only about 1% of AI Overviews led to a click on a cited source. (Google disputes the methodology.) The AI summary is built on the publisher's reporting, and the publisher loses the visit that paid for that reporting. Google is slowly strangling the supply chain its own answers depend on.

Freelance writers and translators are already living it. A Washington University and NYU study found that Upwork writing freelancers [saw their monthly earnings drop and fewer jobs posted](https://olin.washu.edu/about/news-and-media/news/2023/08/study-ai-tools-cause-a-decline-in-freelance-work-and-incomeat-least-in-the-short-run.php) after ChatGPT launched. Many of these are the same gig workers, a lot of them in India and the Philippines, who were sold the "remote work is the future" dream a few years ago.

Then there is your electricity bill, the one most people never connect. In the US, PJM, the grid operator for 13 states and DC, saw capacity auction prices jump from about $29/MW-day to [around $270, then to the $329 cap](https://introl.com/blog/pjm-rate-shock-100-billion-data-center-electricity-2026), and analysts point to data centre demand as the main driver. That cost lands on household power bills. Families who have never opened ChatGPT are helping pay for the data centres.

And the climate gets the invoice last. Google's 2026 Environmental Report shows its [electricity load up 37% in a single year](https://www.axios.com/2026/06/30/google-ai-boom-emissions-power-use), its emissions covered by its climate goals up 18% to around 14.5 million tonnes of carbon dioxide, and admits its AI buildout is accelerating faster than the grid is decarbonising. Microsoft promised to be carbon negative by 2030 and has instead [reported emissions up 23.4% on its 2020 baseline](https://techcrunch.com/2025/06/02/breakneck-data-center-growth-challenges-microsofts-sustainability-goals), mostly from data centre construction. The companies using AI never get a bill for that. Everybody else pays it.

So even if a company's AI project "works", the bill does not vanish. It gets spread across publishers, freelancers, support staff and households, who, not coincidentally, are everyone's customers. Keep that thought. We come back to it.

## Why India gets hit hardest

This is the part I care about most, because I live here, and because I think India is more exposed to AI economics than almost anywhere else on the planet.

### Indian IT is built on the exact thing AI attacks

According to NASSCOM, India's tech industry is expected to hit [about $315 billion in revenue in FY26, with roughly $246 billion of that in exports and around 5.95 million people employed](https://www.outlookbusiness.com/deeptech/tech/indian-tech-industry-revenues-to-grow-61-to-315-bn-in-fy26-nasscom). Most of that is built on one idea: skilled labour here costs less than skilled labour in the US or Europe, so you bill by the hour (or by the head) and pocket the difference.

That is what AI attacks. If a client in New Jersey can get "good enough" code, testing, documentation, or support out of an AI tool, the hours you were going to bill them for disappear, and the arbitrage disappears with them.

The early signs are already here. In 2025, TCS announced it would cut [about 12,000 roles, roughly 2% of its workforce](https://gulfnews.com/business/markets/ai-overhaul-indias-tcs-to-cut-12000-jobs-this-year-after-growth-slows-in-q1-1.500212931), mostly at middle and senior levels. TCS itself says the cuts were about [changing delivery models, not AI](https://www.peoplematters.in/news/recruiting-and-onboarding/tcs-makes-25000-fresher-offers-says-changing-delivery-modelsnot-ailed-to-layoffs-49194). Fair enough. But in 2026, "changing delivery models" covers a lot of ground.

Fresher hiring tells a similar story. In April, TCS's CEO said it had made [25,000 fresher offers for FY27](https://www.peoplematters.in/news/recruiting-and-onboarding/tcs-makes-25000-fresher-offers-says-changing-delivery-modelsnot-ailed-to-layoffs-49194) so far, and that *"clarity on demand will lead to more hiring."* It hired about 44,000 freshers in FY26. Offers are not hires, and the year had barely started, so this is not a like-for-like drop. But the company is in no hurry to hire, either.

Across the top five, the picture is flat. In Q2 FY26, TCS posted [its largest-ever quarterly headcount drop](https://analyticsindiamag.com/it-services/indian-it-is-laying-off-employees-and-calling-it-restructuring), and the other four of India's top five IT services firms barely grew enough to offset it: a net addition of under 3,000 people across all five.

### The BPO problem

The BPO and BPM sector employs roughly [1.65 million people in data processing, voice support and admin work](https://gulfnews.com/technology/ai-agents-take-over-indias-bpos-what-it-means-for-millions-of-jobs-1.500308112), and annual headcount growth has reportedly fallen from tens of thousands to under 20,000. These are the jobs voice AI vendors are pitching to replace. For many families in Tier 2 and Tier 3 cities, a BPO job was the first white-collar salary in the house. That ladder is getting shorter.

### India is the world's biggest free trial

This is where the subsidy story from earlier lands in India.

In late 2025, [OpenAI made ChatGPT Go free for a year for every user in India](https://www.digit.in/news/apps/chatgpt-gemini-and-perplexity-pro-paid-subscriptions-are-now-free-in-india-heres-how-to-get-them.html). Airtel bundled a year of Perplexity Pro. Jio bundled 18 months of Google's Gemini Pro. Every major AI company, it seems, decided India, with hundreds of millions of smartphone users, was where it would win users at any cost.

We have seen this movie before. Jio did it with free data in 2016. It worked brilliantly for Jio, and then tariffs went up. The difference is that mobile data has a marginal cost close to zero once the towers are built. AI inference does not. Every query burns GPU time, and someone is paying for it right now so that you will be habituated by the time ChatGPT Go flips to ₹399 a month.

For a country where a lot of people still pick their phone recharge based on a ₹50 difference, I am curious how many of those "users" survive the conversion to paid.

### Priced in dollars, paid in rupees

Gartner's prediction was that AI coding spend will pass the average developer's salary by 2028. Some companies are already there: about 6% of tech leaders are spending over $2,000 a month per developer, and at Uber, the heaviest users ran up [$500 to $2,000 a month](https://qz.com/uber-coo-ai-spending-harder-justify-052626).

That number might sound low in San Francisco. Here, it is not far off what a mid-level engineer takes home. So for an Indian company with heavy agentic usage, "AI costs as much as the engineer" is already a line on the 2026 invoice.

There is a nasty little twist, too: the salaries are in rupees, but the token bill is in dollars. Every time the rupee weakens, your AI bill rises while your revenue does not. An Indian startup replacing a ₹1 lakh/month engineer with a dollar-denominated AI subscription swaps a domestic cost for currency risk.

### Someone else's models

Scratch the surface of most Indian AI products, and you will find an American model underneath, paid for in dollars, on American terms. The price, the rate limits, the terms of service and even whether you get access at all are decided in San Francisco and Washington, not Bengaluru.

We have already seen how fragile that is. In January 2025, the outgoing US administration's AI diffusion rule put India in the middle tier of countries, with caps on how many advanced AI chips could be imported. It was rescinded a few months later, but the point was made: access to the compute itself is a policy decision someone else makes.

The government's answer is the IndiaAI Mission, sanctioned at ₹10,371.92 crore in March 2024: a shared pool of GPUs offered to startups and researchers at subsidised rates (reportedly around ₹65 per GPU-hour), plus backing for "sovereign" models from companies like Sarvam AI. I want this to work. But look at the scale. ₹10,372 crore is roughly $1.2 billion, spread over several years. The big four hyperscalers are spending around $700 billion in 2026 alone. And even that pool has been slow to arrive: months after Sarvam was allotted 4,096 H100s, [reports said only about 1,500 had been delivered](https://analyticsindiamag.com/ai-features/indiaai-where-are-the-gpus).

So Indian companies get the worst of both worlds. They are exposed when the subsidy ends, and they have no say in what replaces it.

### Our resources, their margins

Google is building a [$15 billion AI hub in Visakhapatnam](https://www.business-standard.com/economy/news/google-defends-15-billion-vizag-ai-hub-amid-water-concerns-protests-126101200341_1.html), its biggest outside the US, and it already faces local protests over water in a city that is short on it. Google says it will use air cooling. Fine, but the land, water, and grid capacity are Indian, and the profits, if they ever show up, mostly will not be.

### The unicorn that invoiced itself

We are not immune to the hype either. Krutrim became India's first generative AI unicorn in early 2024 at a $1 billion valuation. In 2026, it [cut nearly half of its remaining workforce](https://inc42.com/buzz/krutrim-cuts-nearly-half-of-remaining-workforce-in-fresh-layoffs/) after earlier rounds of layoffs, and pivoted to being a cloud provider. In FY25, around 90% of its revenue reportedly came from other Ola Group companies. In other words, most of the revenue was the group invoicing itself.

### The demographic time bomb

India's big economic bet for the next two decades is the "demographic dividend": a huge young population entering the workforce. Lakhs of engineers graduate every year, and for the last 25 years, Indian IT and BPO have absorbed them.

If that sponge stops absorbing, the dividend turns into a liability. A generation of educated young people with no entry point into the formal economy would be a social and economic problem well beyond tech, and it would hit India harder than almost anywhere else. (This is my inference, not something I can point to a study for. But I would love to be shown I am wrong.)

## Who is going to buy it?

Those graduates, like the publishers, freelancers, support staff and households from earlier, are also somebody's customers. That is the thought I asked you to keep, and it brings me to the part of this post that is my own theory. I have not seen it framed this way in the mainstream coverage, so treat it as an opinion, not a finding.

**If AI does all the work and companies produce at levels where humans do not have jobs and are not earning money, who will buy what the AI is building?**

There is a famous story, almost surely apocryphal, of Henry Ford II showing union leader Walter Reuther around a new automated plant. Ford points at the robots and says, *"Walter, how are you going to get these robots to pay union dues?"* Reuther replies, *"Henry, how are you going to get them to buy your cars?"*

Whether or not it happened, Reuther had the economics right. An economy runs as a loop:

1. Companies pay people salaries.
2. People spend those salaries.
3. That spending is other companies' revenue.
4. Which pays more salaries.

Consumer spending is around two-thirds of US GDP. In India, private consumption is somewhere around 60% of GDP. Wages are the engine. Cut wages out of the loop, and the engine stalls.

Now look at what each company is doing on its own. Each one, rationally, says: "If I replace 20% of my staff with AI, my margins go up." That is true for one company. It is not true for all companies at once, because one company's staff are every other company's customers. Economists call this a fallacy of composition. I call it sawing off the branch you are sitting on, in perfect coordination with everyone else on the tree.

Dario Amodei, Anthropic's CEO, warned in 2025 that AI could [wipe out up to half of entry-level white-collar jobs and push unemployment to 10 to 20% within one to five years](https://axios.com/2025/05/28/ai-jobs-white-collar-unemployment-anthropic). He painted a picture of a fast-growing economy where *"20% of people don't have jobs."* I respect that he said it out loud. But in economic terms, 20% of people without income means 20% fewer customers for everyone, including AI companies.

In software, the link is even more direct. A huge chunk of enterprise software is priced *per seat*: Salesforce, Microsoft 365, Slack, Jira, all of it. If AI lets a company cut 30% of its staff, it also cuts 30% of its seats. AI vendors are shrinking their own seat counts.

The loop gets worse because the money concentrates. When a company replaces a ₹50,000-a-month salary with an AI subscription, the money stays in the economy, but it moves from a worker in Kochi to the shareholders of a handful of companies that own the models and the data centres. Back in 2024, the IMF's Kristalina Georgieva warned that AI would [affect almost 40% of jobs worldwide (around 60% in advanced economies) and likely worsen inequality](https://gulfnews.com/business/economy/ai-will-affect-almost-40-jobs-globally-and-worsen-inequality-imf-says-1.1705286945390) in most scenarios.

Concentration matters for demand because of a boring, reliable piece of economics: people with less money spend most of what they earn, and people with a lot of money do not. A worker earning ₹50,000 spends nearly all of it on rent, groceries, EMIs and school fees. A shareholder who gets another ₹50,000 in returns mostly reinvests it. So even if total output goes up, moving income from workers to the owners of compute means less of it gets spent. Output rises while spending power falls, and that is how the loop breaks.

Every technology wave has had someone predicting mass unemployment. Keynes popularised the phrase "technological unemployment" in 1930. ATMs were supposed to kill bank tellers; for a long time, the number of tellers in the US went *up*, because cheaper branches meant more branches. New jobs usually show up.

My worry is about speed and breadth. Previous waves hit one sector at a time and gave people a decade or two to move. This one is being aimed at every white-collar domain simultaneously (code, support, writing, design, legal, finance, translation), and investors are rewarding companies for cutting *now*, not for retraining. The usual answer to "what happens to the displaced people?" is something like universal basic income, funded by taxing AI profits that, as we saw earlier, do not exist yet.

## Where do senior engineers come from?

My second theory, and I think this one will bite much sooner.

**If companies stop hiring junior and mid-level engineers and replace their work with AI, where do the senior and staff engineers of 2035 come from?**

Nobody is born a senior engineer. You become one by being a junior who breaks production, gets yelled at (politely, hopefully), debugs someone else's terrible code at 2 AM, and slowly builds the judgement to know what *not* to build. That judgement is what you need to review AI-generated code. And you cannot get it by reviewing AI-generated code from day one.

The data says the bottom rungs are already being sawn off. In Stanford's "Canaries in the Coal Mine" paper, Erik Brynjolfsson and colleagues used ADP payroll data and found that [employment for 22- to 25-year-olds in the most AI-exposed jobs fell about 13% relative](https://digitaleconomy.stanford.edu/publication/canaries-in-the-coal-mine-six-facts-about-the-recent-employment-effects-of-artificial-intelligence/) to less-exposed jobs, even after controlling for company-level shocks. A 2026 update puts the gap at 19%. Most of it comes from companies not *hiring* young people, rather than firing them.

Big Tech shows the same pattern. In SignalFire's 2025 talent report, new grads made up [only about 7% of hires at Big Tech](https://www.signalfire.com/blog/signalfire-state-of-talent-report-2025). Even the AI labs are doing it: Anthropic's own research on [how employment is changing at Anthropic](https://anthropic.com/research/employment-at-anthropic) says it has been hiring fewer junior technical roles, and [Business Today reports](https://businesstoday.in/technology/news/story/is-ai-squeezing-entry-level-tech-jobs-anthropics-junior-technical-hiring-drops-from-27-to-9-562411-2026-10-19) that share fell from 27% to 9%.

The most sensible take I have read on this came from, of all people, AWS CEO Matt Garman, who called replacing junior staff with AI ["the dumbest thing I've ever heard"](https://www.theregister.com/2025/08/21/aws_ceo_entry_level_jobs_opinion/). His reasoning: juniors are your cheapest employees, they are the most fluent with AI tools, and if you stop hiring them, *"How's that going to work when ten years in the future you have no one that has learned anything?"*

Think of it like medicine. Imagine every hospital decided residents were too expensive and replaced them with AI diagnostic tools. It would look great on the budget for a few years. Then senior surgeons retire, and nobody has learned to operate.

The economics of this are brutal and delayed, which is why companies are ignoring it. Today, cutting juniors saves money and looks efficient to investors. In five to eight years, mid-level engineers will be scarce because nobody trained them. In ten to fifteen years, senior and staff engineers will be rare, expensive, and constantly poached, and salaries for whoever is left will go through the roof.

It is a classic tragedy of the commons. Every company bets that another company will keep training juniors so they can poach them later. If everyone makes that bet, nobody trains anyone. And the cost you "saved" on juniors in 2026 comes back as a talent crisis in 2036, with interest.

For India, this is doubly bad. Our entire IT industry was the world's training ground. The pyramid model (lots of freshers at the bottom, fewer seniors at the top) is what produced the Indian engineers now running teams at every big tech company. Flatten the pyramid, and you lose the pipeline along with the jobs.

## Infrastructure maths

Everything so far has been about the people buying AI and the people it displaces. The people selling it have their own problem, and this is where the numbers get absurd.

The big four hyperscalers (Microsoft, Alphabet, Amazon and Meta) are on track to spend [somewhere north of $700 billion on capex in 2026](https://sherwood.news/tech/alphabet-amazon-microsoft-meta-plan-more-than-700-billion-on-capex-this-year/), mostly on AI data centres. That is up from roughly $410 billion in 2025.

For that to make sense, someone will eventually have to pay for it. Bain & Company estimates AI companies will need about [$2 trillion in annual revenue by 2030](https://www.bloomberg.com/news/articles/2025-09-23/an-800-billion-revenue-shortfall-threatens-ai-future-bain-says) to fund the compute demand, and projects they will fall about $800 billion short, *even if* enterprises reinvest every rupee of AI-driven savings back into data centres.

IBM's CEO, Arvind Krishna, reached a similar conclusion with napkin maths on The Verge's Decoder podcast. Roughly 100 GW of announced AI data centre commitments at about $80 billion per gigawatt is about $8 trillion. Just the interest on that needs around $800 billion a year in profit. His conclusion: there is ["no way" that pays off at today's costs](https://www.fortune.com/2025/12/03/ibm-ceo-no-way-hyperscalers-google-amazon-turn-profit-data-center-spending).

Krishna also made the point people tend to forget: a bridge you build today is still useful in 50 years, but AI chips need replacing every five years or so. *"You've got to use it all in five years, because at that point, you've got to throw it away and refill it."*

Michael Burry (yes, the *Big Short* guy) went further, arguing the hyperscalers are depreciating GPUs over five to six years when the real product cycle is closer to two or three, and that this [overstates industry earnings by around $176 billion over 2026 to 2028](https://www.fool.com/investing/2025/12/02/michael-burry-just-sent-a-warning-to-artificial-in). Nvidia disagrees and points out that A100s (released in 2020) are still in heavy use. Somebody is wrong here, and it is an expensive somebody. The industry, as it stands, is building an asset that depreciates like a laptop, is financed like a highway, and is priced like a free trial. Something in that sentence has to give.

## The AI bubble

Which brings us to the word everyone is dancing around.

### What is a bubble, actually?

A bubble is when prices stop being driven by what an asset will earn, and start being driven by the belief that someone else will pay more for it later. The technology underneath can be completely real. The internet was real. Railways were real. Both had bubbles that wiped out many people anyway.

During the dot-com crash, the Nasdaq fell nearly 80% from its peak. Telecom companies had laid so much fibre that most of it sat dark for years. The internet survived and went on to change everything. A lot of the companies, and a lot of the people who invested in them, did not.

Sam Altman himself has said investors are [overexcited and that we are in a bubble](https://www.techspot.com/news/109090-sam-altman-investors-acting-irrational-booming-ai-bubble.html), and compared it to the dot-com era. Sundar Pichai told the BBC there are ["elements of irrationality"](https://qz.com/pichai-warning-ai-alphabet-google-bubble-bursts) in the market and that no company would be immune if it bursts, *including Google*. When the people selling the shovels say there is a bubble, it is probably worth listening.

### The warning signs

Circular money worries me most. Nvidia invests in OpenAI. OpenAI uses that money to buy Nvidia chips or to sign compute deals with Oracle and CoreWeave, who also buy Nvidia chips; Nvidia has also invested in CoreWeave. AMD gives OpenAI warrants to buy AMD stock in exchange for OpenAI buying AMD chips. [The money goes round and round](https://theconversation.com/whos-paying-whom-the-circular-money-machine-behind-the-ai-boom-or-bubble-293938), and each lap shows up as "revenue" somewhere. It is like me lending you ₹100 so you can buy ₹100 of stuff from my shop, and then both of us telling the bank our business is booming.

Concentration is the second sign. AI companies took around [80% of all global venture funding in Q1 2026](https://gcn.com/ai-companies-claimed-percent-all-startup/20885/), according to Crunchbase data. Semiconductor companies hit a record share of the S&P 500 this year, [nearly a fifth of the index](https://www.wionews.com/business-economy/chip-stocks-now-control-nearly-one-fifth-of-s-p-500-market-value-1779952891145).

Third, debt. The early boom was funded by Big Tech's cash piles. Increasingly, it is funded by debt, especially at the "neocloud" companies like CoreWeave whose whole business is renting GPUs. Debt does not care about your vision. It wants its interest.

Fourth, and this is where a tech correction turns into an economic one: the boom is holding up the economy. Jason Furman, the Harvard economist and former White House CEA chairman, calculated that investment in data centres and information-processing technology accounted for [around 92% of US GDP growth in the first half of 2025](https://fortune.com/2025/10/07/data-centers-gdp-growth-zero-first-half-2025-jason-furman-harvard-economist/). Strip it out, and annualised growth was roughly 0.1%. Furman himself cautioned that this does not mean the economy would have stalled without it, since some of that money would have been spent elsewhere. But it shows how much of the growth story now rests on one kind of spending. The boom is no longer contained in the tech sector; headline economic numbers rest on it. So when the capex slows, for any of the reasons in the next section, the damage will not stay in the Nasdaq. It will show up in the economy the Nasdaq was supposed to be a proxy for.

And it is already wobbling. In the week of October 15, 2026, as I was writing this, the biggest AI and chip stocks [shed more than $1 trillion in value in a single week](https://www.cnbc.com/2026/10/15/sk-hynix-samsung-softbank-stocks-asia-tech-rout-ai-funding-worries.html) on worries about AI financing and interest rates, with CoreWeave [falling about 15% in a day](https://www.tikr.com/blog/coreweave-crwv-stock-bonds-fall-ai-debt-fears) after a chart of its bond yields went viral. It is not a burst yet. But the floor is softer than it looks.

China has already gone further. On October 26, 2026, Reuters reported that the STAR 50, the mainland index of AI and chip companies, had [fallen 40% in less than four months, wiping out about $480 billion in market value](https://www.reuters.com/world/china/china-ai-bubble-has-already-burst-2026-10-26/). According to Goldman Sachs, AI stocks make up 42% of China's market capitalisation, so the damage did not stay in one corner of the market. The people holding the losses are the ones you would expect: robot maker Unitree's share offering was 8,000 times oversubscribed by retail investors, and its shares have halved since August. Even after the crash, the STAR 50 trades at around 100 times earnings, against about 30 for the Nasdaq 100. A Beijing fund manager told Reuters: *"The stock market later evolved into a speculative crazy bull. And now we see the bubble bursting."*

### How it could burst

Nobody can predict the timing, and I will not pretend I can. But here are the scenarios I think are plausible:

1. The slow leak. No dramatic crash. Capex growth just slows in 2027 and 2028 as borrowing gets more expensive, valuations deflate over a couple of years, and a lot of AI startups die or get absorbed. Painful but survivable, and I think it is the most likely outcome.
2. The credit event. A heavily leveraged player (a neocloud, or a data centre developer) cannot refinance its debt. Its lenders take losses, the GPUs it bought get dumped at a discount, and suddenly everyone has to mark down *their* GPUs too. This is the 2008-style scenario, where the financing wrapped around the technology is what breaks.
3. A price shock. To finally turn a profit, the AI labs raise prices hard. Enterprise customers, who already cannot prove ROI (see MIT's 95%), cancel. Revenue projections miss, and the capex built for that revenue becomes stranded.
4. Someone ships a model that is dramatically cheaper to train and run. We have already seen a preview: in January 2025, DeepSeek's release wiped close to $600 billion off Nvidia's market value in a single day. If a future model needs a fraction of the compute, all those trillions in data centres suddenly look oversized.
5. Macro. Inflation, interest rates, a recession, a war. AI valuations are priced for perfection, and perfection does not survive a bad macro year. We are arguably watching an early version of this right now.

In each of these scenarios, the founders get hurt less than the retail investors, pension funds and employees holding stock options, and less than every company that rebuilt its operations around a vendor that turns out to be far less permanent than its pitch deck.

## The VC playbook

To understand why the bubble keeps inflating even when the economics do not work, you have to understand who is funding it and what they want.

A venture capital fund needs a company to be *worth more to the next buyer* than it was when the fund invested, whether or not it ever turns a profit. That buyer can be another investor in a later round, a public market via IPO, or a big tech company via acquisition. Most funds have a 10-year life, charge management fees regardless of outcome, and raise their *next* fund based on how good their portfolio looks on paper. A big markup in a hot sector looks great on paper, whether or not the company ever earns a rupee.

So the incentive is to get in, get marked up and get out before the music stops. The AI boom has invented some creative exits to match.

The reverse acqui-hire is the most creative. In 2025, Google paid [$2.4 billion to license Windsurf's technology and hire its CEO and a few dozen key staff](https://www.fastcompany.com/91384816/what-is-the-reverse-acquihire), without buying the company. Investors and the founders did fine. A lot of the remaining employees reportedly got nothing from that deal until Cognition stepped in and bought what was left. Microsoft did a similar thing with Inflection AI in 2024, which drew an FTC look. It is an exit that skips the "buy the company" part, along with the obligations to everyone in it.

Large secondary sales and tender offers do the same job more quietly. They let early investors and insiders sell shares privately at sky-high valuations. The risk gets transferred to later money, while the people who know the company best take chips off the table.

The smart money is also rotating. In late 2025, [SoftBank sold its entire Nvidia stake for about $5.8 billion](https://www.bloomberg.com/news/articles/2025-11-11/softbank-s-profit-surges-after-boost-from-soaring-ai-valuations) to help fund the $22.5 billion it still owed OpenAI as part of a $30 billion commitment, and Peter Thiel's fund also dumped its Nvidia shares. SoftBank said it was about raising capital, not a view on Nvidia. Maybe. But "sell the public stock everyone can see, buy the private one nobody can value" is a specific kind of bet.

And there is valuation without revenue. Builder.ai raised around $445 million. Krutrim hit a billion-dollar valuation in a year. Both were funded on the story, and the story was the product.

Plenty of VCs fund useful companies, and venture capital is a big part of why I can even write this post on the tools I use. But the money funding this boom gets rewarded when AI *looks* sustainable for long enough to exit, whether or not it ever is.

## Where AI makes sense

I do not want to be the guy who only complains, so here is what I think the sustainable version looks like. The MIT report agrees with a lot of it: the biggest returns it found were in back-office automation, not the flashy sales and marketing use cases that were eating most of the budgets.

- Narrow tasks where you can count the before and after: document extraction, classification, triage, first-pass summarisation.
- The smallest model that does the job. Not every task needs a frontier model. Much of what companies run through the most expensive model available could run on a model that costs a fraction as much, or even on-prem.
- Per-person budgets, set before the invoice arrives. Treat tokens like cloud spend, with alerts and owners.
- Use AI to make people faster, and keep them in the loop. Klarna and CBA both learnt this the expensive way.
- Keep hiring juniors, and pair them with AI and with seniors. They are your cheapest staff, your fastest AI adopters, and your only source of future seniors.
- Price your product on the unsubsidised cost. If you are building on top of these APIs, model your margins as if the price will go up 2 to 3 times. If your business only works at today's prices, what you have is a promotional offer.

## Final thoughts

Underneath every number in this post is the question nobody on an earnings call wants to answer: if AI takes the jobs, who is left with a salary to buy what AI makes?

What we have right now is a subsidy with a countdown timer. The companies that come out of this fine will be the ones that treated AI as a tool with a cost and budgeted for it like one, because the bill always comes due, and the only question is who holds it when it does.

---

*Figures in this post come from public reporting, company statements and analyst projections as of October 2026. Several of them (OpenAI's losses, Uber's internal numbers, Microsoft's reasoning) come from leaked documents or secondary reporting and may not match what the companies would confirm officially. The sections on consumer demand and the junior pipeline are my own opinion and inference, not established findings.*
