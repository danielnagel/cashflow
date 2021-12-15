# cashflow

Generates financial reports from various data sources.

I love to have an overview over my finances and I love programming.
This is why I created cashflow.
There will be plenty of reports in the future,
so you (and me) can get the best overview on what your (or my) current financial situation looks like.

This software is still under heavy development,
if you want to see the next plans consider reading the _Future plans_ section.

## Setup

To start _cashflow_ just run the following npm script

```
npm start
```

Currently the configuration has to be located under `data/config.json`.

It's planned to automatically generate the configuration on first start up.

See Configuration object in `src/typings/types.d.ts` for more Information.

The configuration object could change over time,
until I implemented most of my needed reports and connectors.

## Tests

I used this project to train my TDD skills.
This means, I wrote the tests first and then the production code.
So nearly every line of code in this project has a corrsponding unit test.

To run every test, type:

```
npm test
```

Also check out the tests to see how the software was planned to be used.

To see test coverage, run:

```
npm test:coverage
```

## Future plans

This software is still under heavy development and these are the next steps:

-   Implementing ApiConnector, to get the freshest Data from a web server
    -   I reached out to my bank and waiting now, that my bank finishes its API for private use.
-   Implementing a report to see on which exact date income is paid out, just like fix costs report.
-   Implementing a report to see how categorized variable costs develop over time.
-   Automatically generate configuration file on first start up, eventually user guided.
-   Implementing a budget report,
    I think this is an extension of the _categorized variable costs develop over time_ report.
