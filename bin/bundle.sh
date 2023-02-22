#!/bin/sh
suffix=.meta.json
for each in `ls bundle/*$suffix`; do
  target=`basename $each $suffix`
  echo "Bundle target ($target)..."
  npx webpack --env target=$target
done
