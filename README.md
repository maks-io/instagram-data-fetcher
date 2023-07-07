# instagram-data-fetcher 📸

[![Version](https://img.shields.io/npm/v/instagram-data-fetcher)](https://www.npmjs.com/package/instagram-data-fetcher)

Fetch instagram picture data from one or more accounts, via long lived tokens.

**This package is mainly intended for private use - therefore I skip documenting it with details for now.**

## Usage

### Step 1 - config file
A valid config file could look like this:

example-config.json:

```
{
    "some-unique-identifier-for-ig-user-1": {
        "tokenPath": "A_PATH_TO_WHERE_YOUR_TOKEN_SITS_AT",
        "nrOfTokenBackups": NR_OF_TOKEN_BACKUPS_TO_KEEP,
        "mediaTargetPath": "A_FILENAME_WHERE_THE_PICTURE_DATA_WILL_BE_STORED.json"
    },
    "some-unique-identifier-for-ig-user-2": {
        "tokenPath": "A_PATH_TO_WHERE_YOUR_TOKEN_SITS_AT",
        "nrOfTokenBackups": NR_OF_TOKEN_BACKUPS_TO_KEEP,
        "mediaTargetPath": "A_FILENAME_WHERE_THE_PICTURE_DATA_WILL_BE_STORED.json"
    }
}
```

### Step 2 - provide initial tokens:
For every entry in the config file above, you need to provide the initial token at `"A_PATH_TO_WHERE_YOUR_TOKEN_SITS_AT"`, in the following shape:

`some-unique-identifier-for-ig-user-1_longLivedToken.json`:
```
{
    type: "LONG_LIVED_TOKEN",
    value: [YOUR_TOKEN_VALUE]
}
```

### Step 3 - use it like so:
`igdf -c ./example-config.json`
