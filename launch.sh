#!/bin/bash  
rm -rf ./build
truffle migrate --reset
npm run dev
