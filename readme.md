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

⚠ Currently the configuration location under `data/config.json` can't be changed!

```jsonc
{
    // allowedLogLevel: determines which logs should be logged, "debug" allows all logs, default log level is "error"
    "allowedLogLevel": "error",
    // used in the reports, deffault is "€$"
    "currency": "€",
    // used to format dates for logs and in reports, see https://date-fns.org/v1.30.1/docs/format, default is "dd.MM.yyyy"
    "dateFormat": "dd.MM.yyyy",
    // used to format time for logs and in reports, see https://date-fns.org/v1.30.1/docs/format, default is "HH:mm:ss"
    "timeFormat": "HH:mm:ss",
    // default is false, uncategorized transaction are marked as "unmatched", when true every transaction needs to be matched or an error is printed
    "strict": false,
    // user configuration on when to start a report, otherwise "oldest" transaction is used
    "startDate": "01.01.2021",
    // user configuration on when to end a report, today is used as default
    "endDate": "31.12.2021",
    // has to be either "trend" or "fixedpayday", otherwise an error is printed
    "report": "trend",
    // only used in trend report, can be fixed, variable, special or income for a detailed categorized report on a specific transaction type,
    // default is a trend report on all transaction types, without showing the details of every category.
    "trendType": "fixed",
    // options for a data source
    "source": {
        "type": "csv", // api will be supported some day
        "path": "", // either a directory where all .csv files are loaded and merged or a path directly to one csv file
        "dataKeys": {
            // used to match the columns to generate transaction of every row in a csv file
            "initiator": "",
            "purpose": "",
            "value": "",
            "date": ""
        },
        "columns": [], // has to be filled apropriatly by the user
        "dateFormat": "MM/dd/yyyy" // optional when date format in csv file and date format for logs and other output are different
    },
    // a list of categories to categorize every transaction from source, can be used in combination with strict: true
    "categories": [
        // has to be filled apropriatly by the user
        {
            "name": "example",
            "type": "fixed", // or fixed, special, income
            "period": "mothly", // default or yearly, quarter, half, only used in combination with fixed type
            "samples": [
                {
                    "initiator": "", // exact initiator of a transaction to match, when started with ~ the following string has to be included
                    "purpose": "" // optional, used in combination with the initiator sample, only as included search
                }
            ]
        }
    ]
}
```

An example configuration, like this, is created on first start up.

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
-   Implementing a budget report
