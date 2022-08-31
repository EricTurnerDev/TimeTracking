## Overview

This is a node module containing common code that is used by both the
main process, and the rendering process.

To use it, modify source code in the `src` directory.

You can run `npm run tsc` to manually run the typescript compiler, but
this is done automatically when you run or build the TimeTracking app itself.

The output of compilation is placed in `lib`.

TimeTracking installs this as a local file-based node module in its package.json:

```json
{
  "dependencies": {
    "timetracking-common": "file:timetracking-common"
  }
}
```
