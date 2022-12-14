# TimeTracking

TimeTracking is a cross-platform _**desktop**_ application for tracking the time
that you work for clients. I created it specifically for my own use in
freelance software development to replace the spreadsheets I was using,
but it should be usable for other professions.

IMPORTANT: TimeTracking is not ready for public use. I started developing it
in earnest in September 2022, and expect to have a usable version by
the end of 2022.

* Cross-platform: runs on Windows, macOS, and Linux
* Data is stored locally, never in the cloud
* Works offline (i.e. without an Internet connection)
* Export time records to a spreadsheet (e.g. for creating invoices, reporting, etc)
* Create backups of the TimeTracking database, and restore from them
* [Pomodoro timers](https://en.wikipedia.org/wiki/Pomodoro_Technique) help you focus on your work :tomato:
* Free and Open Source under the [Mozilla Public License](https://en.wikipedia.org/wiki/Mozilla_Public_License)

## Installation

TimeTracking executables for various platforms are not currently available.
Links to these will be added here once I start building them. Until then,
clone the Github repo, and run:

```shell
npm install
npm run build
```

The application will be built in the `dist` directory.

### Windows

Run the `TimeTracking-[version].exe` file to install the application. A shortcut
will be added to your Desktop that you can use to run it.

### Linux

Copy the `TimeTracking-[version].AppImage` to your `~/bin` directory, and ensure
that you have execute permissions by running `chmod u+x ~/bin/TimeTracking-[version].AppImage`.
The `~/bin` directory should already be in your `$PATH`, so you should be able to run TimeTracking
anywhere from the command line.

### macOS

TODO

## Contributing

There are several ways you can contribute to TimeTracking development:

* Use it, and let us know if you like it, problems you run into, and changes you would like us to make
* Create issues in Github for bugs and feature requests
* Work on Gitlab issues. Fork the Github repository, make changes, and submit pull requests to have your changes added to TimeTracking

## Technologies Used

Some of the more important technologies used in TimeTracking are:

* Nextron: a framework that combines Electron and Next.js for creating cross-platform applications using web technologies
* SQLite: a lightweight file-based relational database
* TailwindCSS: a class-based CSS (styling) framework