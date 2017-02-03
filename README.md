# Xperiments

[![Build Status](https://travis-ci.com/WeTransfer/Xperiments.svg?token=CRN5Yz56tcLXSp42GUm8&branch=master)](https://travis-ci.com/WeTransfer/Xperiments)

A simple A/B testing platform.  
**Xperiments** A/B Tesing Service is a real time platform to create and manage A/B experiments. Users are empowered to run experiments acros many applications and platforms, e.g. web, mobile, desctop.  
It's very fast and handle millions of users.

## Installation

To start Xperiments application:
  * Install an Elixir with `brew install elixir` (OSX)
  * Clone the repository with `git clone git@github.com:WeTransfer/Xperiments.git`
  * Install dependencies with `cd Xperiments; mix deps.get`
  * Create and migrate your database with `mix ecto.create && mix ecto.migrate`
  * Install Node.js dependencies with `npm install`
  * Start Phoenix endpoint with `mix phoenix.server`

Now you can visit [`localhost:4000`](http://localhost:4000) from your browser.

## Requirements
  
  * Postgresql verions 9.4 and newer
  * Elixir 1.4
  * Erlang 19.0 (might work on older versions, not tested)
