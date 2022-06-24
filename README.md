# Oona Frontend

## Introduction
This project is meant to provide the main

## Requirements
1. node_js 16+

## Installation pre-requisites
For this project, we recommend installing Node 16 Long Term Support Edition(LTE)

To easily switch between node versions on your machine, we recommend using a node virtual environment tool such as nave or nvm-windows, depending on your operating system.

For example, here is how you switch to a new node version using nave:

    # note that you don't even need to update your node version before installing nave
    npm install -g nave
    
    nave use 12.3.1
    node -v
    v12.3.1

# Installing the Angular CLI

With the following command the angular-cli will be installed globally in your machine:

    npm install -g @angular/cli 

# How To install this repository

We can install the master branch using the following commands:

    git clone http://192.168.0.207/oona/oona-v2-frontend.git

After cloning the repo, next you install npm on the project directory using the below commands on your terminal:

    cd oona-web-app
    npm install 

This should take a couple of minutes. If there are issues, try re-installing the node js again.

# To run the Development UI Server

To run the frontend part of our code, we will use the Angular CLI:

    ng serve

The application is visible at port 4200: [http://localhost:4200](http://localhost:4200)

