#!/bin/bash

sleep 5
mocha
mocha --reporter xunit --reporter-options output=test-report.xml