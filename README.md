# Xperiments - A/B Testing Platform

**Support:** [Backend](https://github.com/dsnipe), [Frontend](https://github.com/manpreetssethi)
<br />
**Continuous Integration:** [![Build Status](https://travis-ci.com/WeTransfer/Xperiments.svg?token=CRN5Yz56tcLXSp42GUm8&branch=master)](https://travis-ci.com/WeTransfer/Xperiments)
<br />
**License:** [![Apache 2](http://img.shields.io/badge/license-Apache%202-brightgreen.svg)](http://www.apache.org/licenses/LICENSE-2.0)
<br/>

## Project

A simple A/B testing platform.  
Xperiments A/B Tesing Service is a real time platform to create and manage A/B experiments. Users are empowered to run experiments across many applications and platforms (e.g. web, mobile, desktop)
It's very fast and can handle millions of users.

## Features

* **API driven** - Separate API endpoints that deal with management and assignment of experiments
* **Experiment Management UI** - Comes bundled with a Material-UI based interface to manage experiments

## Requirements
  
  * Postgresql verions 9.4 and newer
  * Elixir 1.4
  * Erlang 19.0 (might work on older versions, not tested)
  * Node.js v4.0 and higher

## Installation

##### Mac OS

```bash
% brew install elixir
% git clone git@github.com:WeTransfer/Xperiments.git
% cd Xperiments; mix deps.get
% mix ecto.create && mix ecto.migrate
% npm install yarn
% yarn install
% mix phoenix.server
```

Now you can visit [`localhost:5000`](http://localhost:5000) from your browser.
