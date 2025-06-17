/* Tomasz Slugocki  (stockmap.pl) */
(function() {
    function mark(id) {
        const obj = document.getElementById(id);
        obj.style.background = options.highlight_color || "#FFFF99";
        setTimeout(function() {
            obj.style.background = "white";
            obj.style.color = "black";
        }, 500);
    }
    let one_day, last_published_date, date_diff, days_num, last_published, per_day, per_sec, speed, speed_ms, highlight_after, per_speed, curr_amount, result, addEvent, http_www, count_debt, long_template;
    options = window.DEBT_CFG || {};
    one_day = 1e3 * 60 * 60 * 24;
    last_published_date = new Date(2025, 5, 30);
    date_diff = Math.round(new Date().getTime() - last_published_date.getTime());
    days_num = date_diff / one_day;
    last_published = 2160045e6;
    per_day = 149e6;
    per_sec = 1731;
    speed = options.speed || 5;
    speed_ms = 1e3 - speed * 100;
    highlight_after = options.highlight_after || 5;
    per_speed = speed_ms / 1e3 * per_sec;
    curr_amount = last_published + days_num * per_day
    /* reasons for use document.write here
            https://stackoverflow.com/questions/802854/why-is-document-write-considered-a-bad-practice
            "
            It keeps the scripts small
            They don't have to worry about overriding already established onload events or including the necessary abstraction to add onload events safely
            It's extremely compatible
            "
        */;
    long_template = '<div id="debt_wrapper"><div id="header_wrapper"><span id="debt_header">\ufeffDług publiczny Polski:</span></div><div id="debt_value_wrapper"><span id="debt_value"></span></div></div><sup style="margin-left:0.5em;font-family: Tahoma, Verdana, sans-serif;font-size:9px;color:gray;">StockMap.pl</sup>';
    document.write(long_template);
    result = document.getElementById("debt_value");
    addEvent = function(el, ev, fn) {
        if (el.addEventListener) {
            el.addEventListener(ev, fn, false);
        } else if (el.attachEvent) {
            el.attachEvent("on" + ev, fn);
        } else {
            el["on" + ev] = fn;
        }
    };
    http_www = "http://www.";
    addEvent(document.getElementById("debt_wrapper"), "click", function() {
        window.open(http_www + "stockmap.pl", "open_window", "menubar, toolbar, location, directories, status, scrollbars, resizable, dependent, left=0, top=0");
    });
    count_debt = function() {
        if (typeof count_debt.cnt === "undefined") {
            count_debt.cnt = 0;
        } else {
            count_debt.cnt += 1;
        }
        setTimeout(function() {
            var digits_count, changed_idx, prev_num, prev_num_str, curr_num_str, c_len, outlist, out_html, added, how_many_digits, i, c1, c2, fin_res;
            curr_amount += per_speed;
            prev_num = count_debt.p_num || 0;
            if (prev_num) {
                prev_num_str = (parseInt(prev_num, 10) + "").split("");
                curr_num_str = (parseInt(curr_amount, 10) + "").split("");
                c_len = curr_num_str.length;
                outlist = [];
                added = false;
                how_many_digits = 0;
                let digits_count = 0;
                while (c_len--) {
                    digits_count += 1;
                    c1 = prev_num_str[c_len];
                    c2 = curr_num_str[c_len];
                    outlist[c_len] = c2;
                    if (digits_count % 3 === 0) {
                        outlist[c_len] = " " + outlist[c_len];
                    }
                    if (c1 === c2 && !added) {
                        changed_idx = c_len + 1;
                        added = true;
                    }
                }
                how_many_digits = outlist.length - changed_idx;
                outlist[changed_idx] = '<span id="debt_changed">' + outlist[changed_idx];
                outlist.push("</span>");
                out_html = outlist.join("");
            }
            fin_res = out_html || parseInt(curr_amount, 10);
            result.innerHTML = fin_res;
            if (how_many_digits + 1 > highlight_after) {
                mark("debt_changed");
            }
            count_debt.p_num = curr_amount;
            count_debt();
        }, speed_ms);
    };
    count_debt();
})();