# Booze Better!

[![Build Status](https://travis-ci.com/bthuilot/BoozeBetter.svg?token=DwRwXcm2t95em7ygX8ov&branch=master)](https://travis-ci.com/bthuilot/BoozeBetter) [![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://lbesson.mit-license.org/)

A simple react app to find cocktails based on what you have in your kitchen.
No matter what you have in your frigde, you should BoozeBetter!

## Contributing

Contributions are always welcome! Feel free to fork this repo and make a PR if you would like to contriubte

When making a PR be sure to run all tests (including Database tests `yarn test:db`) and run eslint `yarn lint`

## Running locally

_This assumes you have a postgres db setup. if not try [this]([https://lmgtfy.com/?q=how+to+set+up+postgres+database)_

After cloning the repo, `cd` into the directory

1. Edit the file in `db/development.yml` to have the correct database params

2. run `yarn run migrations up` to run migration files

3. run `yarn run dev` to run both the express & react apps, then simply navigate to `http://localhost:3000` to see the site
