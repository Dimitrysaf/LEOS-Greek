
catalog-CONF.json
=================

Example of this configuration file:

{
	"SJ-023": {
	  "list-of-environments": [{
		  "environments": "development",
		  "start-date": "10/02/2025 14:56",
		  "end-date": "11/02/2025 15:15"
		},
		{
		  "environments": "local",
		  "start-date": "12/02/2025 14:56"
		}
	  ]},
	"SJ-024": {
	  "environments": "development, all",
	  "end-date": "10/02/2025 15:15"
	},
	"SJ-025": {
	  "environments": "development"
	},
	"SJ-026": {
	  "environments": "production, local"
	}
}

We can use the key of a proposal to add an entry, for example "SJ-024".

For every new entry key that we add we can use those 3 fields to define a new restriction:

- "environments" - in this field we can use a list of environments separated by comma or space.
  If we miss this field, the entry will be ignored.
  We can use the word "all" in its value, meaning all environments.
  For open source version, we can use only values "local" or "all".

- "start-date" - date when a proposal will start to be displayed, in the format "dd/mm/yyyy hh:mm"
  This field is not mandatory. If no start date is defined, it means it's directly visible.

- "end-date" - date when a proposal will not be displayed anymore, in the format "dd/mm/yyyy hh:mm"
  This field is not mandatory. In the same logic of "start-date", if no visibility end date is defined, it means it's visible forever.

If we need more than one definition for the same proposal entry, we can use this field as well:
- "list-of-environments" - list of items with the same 3 fields previously explained ("environments", "start-date" and "end-date").

Some other rules:
- If we don't add any entry for an existing proposal, this means if is automatically visible in all environments.
