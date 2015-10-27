#React.js DataGrid component

Represents an ajax-propelled data grid react.js component with sorting and pagination facilities

##Prerequisites

* React.js
* Jquery - for ajax requests
* Bootstrap 3 for styles

## Data Source

An example data source is included in data/invoices.txt

##Embedding data grid in a web page

See index.html

## Props

* sortable (Array) - field names on which dynamic sorting will be supported
* sort_by (String) - field name which will be used for default sorting
* fields (Array) - fields to be shown in the data grid
* url (String) - url to be used as data source
* per_page (Integer) - number of items shown on a single  page
* styles
    * sort_ascending (String) - style for column chosen for sorting (ascending)
    * sort_descending (String) - style for column chosen for sorting (descending)

