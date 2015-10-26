var DataGrid = React.createClass({
    getInitialState: function () {
        return {
            items: [],
            current_page: 1,
            total_pages: 1,
            page_range: [],
            page_range_trimmed: [],
            has_previous: false,
            has_next: false,
            sort_by: this.props.sort_by
        };
    },

    loadData: function (page, sort_by) {

        $.ajax({
            type: 'GET',
            url: this.props.url,
            data: {
                page: page ? page : this.state.current_page,
                per_page: this.props.per_page ? this.props.per_page : 10,
                sort_by: sort_by ? sort_by : this.state.sort_by
            },
            dataType: 'json',
            success: function (data) {
                if (data.status == 'success') {
                    this.setState({
                        items: data.invoices_data.invoices,
                        current_page: data.invoices_data.current_page,
                        total_pages: data.invoices_data.total_pages,
                        page_range: data.invoices_data.page_range,
                        page_range_trimmed: data.invoices_data.page_range_trimmed,
                        has_previous: data.invoices_data.has_previous,
                        has_next: data.invoices_data.has_next,
                        sort_by: sort_by ? sort_by : this.state.sort_by
                    });
                }
            }.bind(this),
            error: function (jqXHR, textStatus) {
                console.info(textStatus);
            }.bind(this)
        });

    },

    componentWillMount: function () {
        this.loadData(this.state.current_page);
    },

    onPageChange: function (page) {
        this.loadData(page);
    },

    onSortChange: function (field_name) {
        field_name_str = (field_name == this.state.sort_by) ? '-' + field_name : field_name;
        this.loadData(this.state.current_page, field_name_str);
    },

    renderPaginator: function () {

        pagination = []

        if(this.state.has_previous){
            pagination.push(

                <a href=''

                   onClick={function(e){e.preventDefault(); this.onPageChange(this.state.page_range[0])}.bind(this)}>
                    &larr;
                </a>

            );
        }

        for (var i = 0; i < this.state.page_range_trimmed.length; i++) {
            pagination.push(
                <a key={i} href=''
                   className={this.state.current_page == this.state.page_range_trimmed[i] ? 'active': ''}
                   onClick={function(i, e){e.preventDefault(); this.onPageChange(this.state.page_range_trimmed[i])}.bind(this, i)}>
                    {this.state.page_range_trimmed[i]}
                </a>
            );
        }

         if(this.state.has_next){
            pagination.push(

                <a href=''

                   onClick={function(e){e.preventDefault(); this.onPageChange(this.state.page_range[this.state.page_range.length - 1])}.bind(this)}>
                    &rarr;
                </a>

            );
        }

        return (
            <div className='paginator'>Страницы:
                {pagination}
            </div>
        );
    },

    renderItemRow: function (item) {

        tableCells = []

        for (var i = 0; i < this.props.fields.length; i++) {
            tableCells.push(
                <td key={i}>{item[this.props.fields[i].name]}</td>
            )
        }

        return (<tr>
            <td></td>
            {tableCells}
            <td></td>
        </tr>);
    },

    renderTableHead: function () {

        var tableHead = [];

        for (var i = 0; i < this.props.fields.length; i++) {

            if ($.inArray(this.props.fields[i].name, this.props.sortable) != -1){

                var sort_style = '';

                if(this.props.fields[i].name == this.state.sort_by){
                    sort_style = this.props.styles.sort_ascending;
                }else if (('-' + this.props.fields[i].name) == this.state.sort_by){
                    sort_style = this.props.styles.sort_descending;
                }


                tableHead.push(

                    <th key={i}>
                        <a href='#' onClick={function(i, e){e.preventDefault(); this.onSortChange(this.props.fields[i].name)}.bind(this, i)}>
                            {this.props.fields[i].display_name}
                            <span className={sort_style}></span>
                        </a>

                    </th>
                );
            }else{

                 tableHead.push(

                    <th key={i}>
                        {this.props.fields[i].display_name}
                    </th>
                );

            }


        }

        return (

            tableHead

        );

    },


    render: function () {

        return (

            <div>
                <table>
                    <thead>
                    <tr>
                        <th></th>
                        {this.renderTableHead()}
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.items.map(this.renderItemRow)}
                    </tbody>
                </table>
                {this.renderPaginator()}
            </div>

        );
    }

});