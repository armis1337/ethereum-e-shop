#!/bin/bash
rm -rf ./build
if [ -d './node_modules' ]
then
truffle migrate --reset
npm run dev
else
npm install
truffle migrate
npm run dev
fi
exit
