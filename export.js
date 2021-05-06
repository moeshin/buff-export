(function () {
    const tableSelector = 'table.list_tb';
    const win = window.open();
    win.document.write(`
<html lang="en">
<head>
<title>Buff Export</title>
</head>
<body>
<table>
<thead>
<th>id</th>
<th>gid</th>
<th>name</th>
<th>price</th>
<th>seller</th>
<th>time</th>
<th>status</th>
</thead>
<tbody>`);
    function dump($table) {
        $table.find('tbody tr').each(function () {
            const children = this.children;
            const _good = children[2];
            const _status = children[6];
            const $tips = $(_status).find('.j_tips_handler');
            let status = _status.firstElementChild.textContent.trim();
            if ($tips.length) {
                status += '\n' + $tips.attr('data-content');
            }
            const gid = parseInt($('.name-cont > a', _good)[0].search.match(/[&?]goods_id=(\d+)(?:&|$)/)[1]);
            win.document.write(`
<tr>
<td>${this.id.replace(/^bill_order_/, '')}</td>
<td>${gid}</td>
<td><a href="https://buff.163.com/market/goods?goods_id=${gid}">${_good.textContent.trim()}</a></td>
<td>${children[3].firstElementChild.textContent.trim()}</td>
<td>${children[4].textContent.trim()}</td>
<td>${children[5].textContent.trim()}</td>
<td>${status}</td>
</tr>`)
        });
    }
    function dumpNext() {
        $.ajax({
            url: base + ++current,
            mothd: 'GET',
            success: function(data) {
                const $table = $(tableSelector, data);
                if ($table.length && !$table.find('tbody > tr.empty').length) {
                    dump($table);
                    dumpNext();
                } else {
                    win.document.write(`</tbody></table>Total pages: ${current}</body></html>`)
                }
            }
        });
    }
    let current = 1;
    let base = location.search.replace(/([&?])page_num=(\d+)(&|$)/, function (m, m1, m2, m3) {
        current = parseInt(m2);
        return m3 ? m1 : '';
    });
    base = 'https://buff.163.com/market/buy_order/history' + base + (base.length ? '&' : '?') + 'page_num=';
    const $table = $(tableSelector);
    if ($table.length) {
        dump($table);
    }
    dumpNext();
})();