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
    
## Django view

```

    class TestDataGridListView(ListView):
        """
        Test datagrid Django view
        """
    
        def get_page_range_trimmed(self, page_range, current_page=1, trim_by=1):
            start = page_range.index(current_page) - trim_by if page_range.index(current_page) - trim_by >= 0 else 0
            end = page_range.index(current_page) + trim_by + 1
            return page_range[start:end]
    
        def get(self, request, *args, **kwargs):
    
            items_per_page = request.GET.get('per_page', 10)  # items per page
            sort_by = request.GET.get('sort_by', 'id')
            items_list = Invoice.objects.all().order_by(sort_by)
            paginator = Paginator(items_list, items_per_page)
            page = request.GET.get('page', 1)
    
            try:
                items = paginator.page(page)
            except PageNotAnInteger:
                page = 1
                items = paginator.page(page)
            except EmptyPage:
                page = paginator.num_pages
                items = paginator.page(page)
    
            invoices_list = {'current_page': int(page),
                             'page_range': paginator.page_range,
                             'total_pages': paginator.num_pages,
                             'has_previous': paginator.page(int(page)).has_previous(),
                             'page_range_trimmed': self.get_page_range_trimmed(
                                 paginator.page_range,
                                 current_page=int(page),
                                 trim_by=3
                             ),
                             'has_next': paginator.page(int(page)).has_next(),
                             'invoices': []
                             }
    
            for invoice in items:
                invoices_list['invoices'].append(
                    {
                        'id': invoice.id,
                        'created': arrow.get(invoice.created).to('Europe/Moscow').format('DD.MM.YY HH:mm'),
                        'amount': invoice.amount,
                        'is_safe': invoice.is_safe,
                        'current_state': invoice.current_state
                    })
    
            return JsonResponse({'status': 'success', 'invoices_data': invoices_list})


```


