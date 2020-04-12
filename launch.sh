#!/bin/bash
rm -rf ./build
if [ -d './node_modules' ]
then 
echo 'node exists'
truffle migrate --reset
npm run dev
else
echo 'node doesnt exist'
npm install
truffle migrate
npm run dev
fi
