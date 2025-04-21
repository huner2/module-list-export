# module-list-export
A FoundryVTT module to export a list of all installed modules with the following information:
- Name
- ID
- Description
- Version

This package is useful for keeping track of installed modules and their versions, especially when sharing your FoundryVTT setup with others or when you want to keep a record of your module collection.

The export can be started in the settings tab of the sidebar.

## Important Notes

- The export will only work as expected from a browser, not from the FoundryVTT application.
- Attempting an export by browsing to either `localhost` or `127.0.0.1` will open the CSV and JSON export types as a blob in a new browser tab.  This is due to the sandboxing nature of modern browsers.  This does not affect the file contents, you can right click the page and `save as` to save the file as usual.
