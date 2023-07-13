# ADRCheckIn
Scanning app that scans ADR employee QR codes


The ADRN codebase does the following:

It firstly uses a QR module to scan the badges on ADRN ID Cards. To do this, it uses the state variables and functions
* `hasPermission`: determines if the app has permission to use the camera (logistics handled by module)
* `scanned`: determines if QR was scanned with camera

* `handleBarCodeScanned()`: carries out out the logic of actually scanning the QR code and running API calls to access data. Within this function, there is a a get request to `https://portal.adrn.org/api/badge-status/uuid/` to determine the status of the badge (i.e. valid or invalid). Then, if the status is valid, a GET request to `https://api.envoy.com/v1/entries?page=1&perPage=30` is passed to get the first 30 entries from the ADRN check-in database. From there, we query the entries to determine if there is an entry that matches `uuid`s with the scanned QR. If there is a match and the user is checked in, we will check them out via posting to `https://api.envoy.com/v1/entries`. Else we will check them in at the same endpoint.

In order to start the server and run the app use the following command:

npx expo start

Install the app Expo go on mobile devices and scan the QR Code produced by the run to view and work with the application
