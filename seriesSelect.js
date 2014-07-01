/***
 * ============================================================
 * Done by su9er 2014-07-01： 数据联动选择器组件
 * 【说明】
 * 此组件包含4个参数，其中第一个参数为必选参数，其他为可选参数
 * 1、第一个参数是要用来选择的数据对象data（数组对象）
 * 2、第二个参数是初始化时候的默认数据（字符串对象）,可以使数据的编号no,或者是数据的名称name
 * 3、第三个参数是联动选择器的最大显示级数（数字类型），默认是两级
 * 4、第四个参数是一级一级显示的开关（boolean类型），默认是false
 * 5、参数可以任意顺序任意数量
 *
 * * 【依赖以下文件】
 * 1. jQuery
 *
 *
 * * 【包含以下API】
 * 1. val(str):
 *  当str为空时，则返回当前所选数据的编号no，
 *  当str不为空是，则设置选择器的值为str，str可以是数据的编号no,可以是数据的名字name
 * 2. set(str):
 *  设置选择器的值为str，str可以是数据的编号no,可以是数据的名字name
 * 3. get(str):
 *  获取指定数据str的关联值，可以通过编号no获取名字name，也可以通过名字name获取编号no
 * 4. getSpanAreaData:
 *  获取当前选中的每一级数据数组对象[{no:'...',name:'...'},..]
 * 5. getTheSelect(select):
 *  获取指定select(dom or $(..))选中的数据对象{no:'...',name:'...'}
 * 6. getElem:
 *  获取选择器的最外层span的jQuery对象
 * 7. getCurrentNo:
 *  获取当前所选数据的编号no
 * 8. disabled(disabled, len):
 *  使指定级数的select为只读或可选
 * 9. change(func):
 *  为组件绑定外部事件，当选择变化时触发
 * ==========================================
 *
 *
 * **/


define(function() {
    /**
     * 数据选择器
     * @param {Object} data 数据
     * @param {String} str  初始化数据
     * @param {Number} num  显示的最大级数
     * @param {Boolean} bool 是否一级一级地显示
     * @returns {SeriesSelect}
     * @constructor
     */

    var SeriesSelect = function() {
        var args = arguments, len = args.length, data, str, sbs, l, _this = this,
            dataDeferred = $.when(true);
        for (var i = 0; i < len; i++) {
            switch(typeof args[i]) {
                case 'object':
                    data = args[i]; //数据
                    break;
                case 'string':
                    str = args[i];  //初始化数据
                    break;
                case 'number':
                    l = args[i];    //数据展现的级数
                    break;
                case 'boolean':
                    sbs = args[i];  //是否要一级一级显示
                    break;
                default : break;
            }
        }
        this.len = !!l ? l : 2;
        this._formatVal = !!str ? str : "";
        this._spanArea = $("<span/>").addClass("span-area");
        this._select = [];   //select元素数组
        this._lastSelect;    //当前有选中值的最后一个select元素
        this._currentNo = "";
        this._sbs = !!sbs;   //是否一级一级地显示
        this._disabled = false;
        this._disabledLen = 9;
        this._data = data;
        dataDeferred.done(function() {
            _this._createSelect();
            _this.getElem().on("change", "select", function() {
                _this._transformer(this);
                _this.trigger(_this.Event.CHANGE, [_this._currentNo]);
            });
            if(!!_this._formatVal) {
                _this.set(_this._formatVal);
            }
        });
    };
    SeriesSelect.prototype = new $.EventEmitter();
    SeriesSelect.prototype.Event = {
        CHANGE: "change"
    };
    SeriesSelect.prototype._transformer = function(select) {
        var $s = $(select),
            val = $s.val();
        if(val == this._currentNo) return ;
        this._clearNext($s);
        if(val != "-1") {
            var data = this._getSelectedData($s),
                subData = data.children;
            if(!!subData && subData.length) {
                var next = $s.data("next");
                if(!next) return;
                next.data("arr", subData);
                this._createOption(next);
            }
            $s.data("selected", {no: data.no, name: data.name});
            this._currentNo = val;
        } else {
            var prev = $s.data("prev");
            $s.data("selected", {});
            if(!!prev) {
                this._currentNo = prev.val();
            } else {
                this._currentNo = "";
            }
        }
        this._putData2SpanArea();
    };
    SeriesSelect.prototype._createSelect = function() {
        var s = $("<select/>"),
            o = $("<option/>"),
            arr = [],
            prev,
            _this = this;
        //注意闭包的影响，不过这里不会有问题
        for( var i = 0; i < this.len; i++) {
            this._select[i] = s.clone().append(o.clone().val('-1').html('--请选择--'))/*.hide()*/;
            if (this._sbs) {this._select[i].hide();}
            if(prev) {
                prev.after(this._select[i]).data("next", this._select[i]);
                this._select[i].data("prev", prev);
            } else {
                this.getElem().append(this._select[i]);
                this._select[i].data("prev", "");
            }
            prev = this._select[i];
        }
        this._select[0].data("arr", this._data);
        this._createOption(this._select[0]);
    };
    SeriesSelect.prototype._createOption = function(select) {
        var $s = $(select),
            o = $("<option/>"),
            data = $s.data("arr");
        for(var i = 0, len = data.length; i < len; i++) {
            $s.append(o.clone().val(data[i].no).html(data[i].name));
        }
        /* $s.show();*/
        if (this._sbs) {$s.show();}
    };
    SeriesSelect.prototype._clearNext = function(select) {
        var $s = $(select),
            $next = $s.data("next"),
            o = $("<option/>"),
            n;
        while($next) {
            n = $next.data("next");
            $next.data("selected", {}).data("arr", []).html(o.clone().val('-1').html('--请选择--'));
            //$next.css("display", "none");
            if (this._sbs) {$next.hide();}
            $next = n;
        }
    }
    SeriesSelect.prototype._getSelectedData = function(select) {
        var $s = $(select),
            data = $s.data("arr"),
            no = $s.val();
        for(var i = 0, len = data.length; i < len; i++) {
            if(data[i].no == no) {
                return data[i];
            }
        }
    };
    SeriesSelect.prototype._putData2SpanArea = function() {
        var s = this._select,
            arr = [],
            temp;
        for(var i = 0, len = s.length; i < len; i++) {
            temp = s[i].data("selected");
            if(!$.isEmptyObject(temp)) {
                arr.push(temp);
            } else {
                break;
            }
        }
        this.getElem().data("selectedData", arr);
    };
    SeriesSelect.prototype.getSpanAreaData = function() {
        return this.getElem().data("selectedData");
    };
    SeriesSelect.prototype.getTheSelectData = function(select) {
        var num, obj = {};
        if(typeof select == 'number') {
            num = Math.min(select, this._select.length - 1);
            obj = this._select[num].data("selected");
        } else obj = $(select).data("selected");
        return obj;
    }
    function cycleCheckName(data, name) {
        var no = "";
        if (!!name) {
            for (var i = 0, len = data.length; i < len; i++) {
                if (data[i].name == name) {
                    no = data[i].no;
                } else if (!!data[i].arr.length) {
                    no = cycleCheckName(data[i].arr, name);
                }
                if (!!no) break;
            }
        }
        return no;
    }
    SeriesSelect.prototype._getNo = function(name) {
        //TODO: liangchh 2013.01.16
        return cycleCheckName(this._data, name);
    };
    SeriesSelect.prototype._getName = function(strNo) {
        if (!!strNo) {
            var lv = parseInt(strNo.length / 4);
            var data = this._data, no, name = "";
            for (var i = 0; i < lv - 1; i++) {
                if (!data.length) return "";
                no = strNo.substr(0, (i + 1) * 4);
                data = cycleCheck(data, no);
            }
            for (var j = 0; j < data.length; j++) {
                if (data[j].no == strNo) {
                    return data[j].name;
                }
            }
        }
    };
    SeriesSelect.prototype.get = function(str) {
        return !!Number(str) ? this._getName(str) : this._getNo(str);
    };
    SeriesSelect.prototype._setByNo = function(strNo) {
        var lv = parseInt(strNo.length/4),
            no, s;
        for(var i = 0; i < lv; i++) {
            s = this._select[i];
            if(!s) break;
            no = strNo.substr(0, (i + 1)*4);
            s.val(no);
            this._transformer(s);
        }

    };
    SeriesSelect.prototype._setByName = function(name) {
        var no = this._getNo(name);
        this._setByNo(no);
    };
    SeriesSelect.prototype.set = function(str) {
        if (!!str) {
            !!Number(str) ? this._setByNo(str) : this._setByName(str);
        }
    };
    SeriesSelect.prototype.val = function(strNo) {
        return !strNo ? this.getCurrentNo() : this.set(strNo);
    };
    SeriesSelect.prototype.getElem = function() {
        return this._spanArea;
    };
    SeriesSelect.prototype.getCurrentNo = function() {
        return this._currentNo;
    };
    SeriesSelect.prototype.disabled = function(disabled, len) {
        this._disabled = disabled == undefined ? true : disabled;
        if(len != undefined) {
            this._disabledLen = parseInt(len);
        }
        var length = this._select.length > this._disabledLen ? this._disabledLen : this._select.length;
        for(var i = 0; i < length; i++) {
            this._select[i].prop("disabled", this._disabled);
        }
    };
    SeriesSelect.prototype.change = function(func) {
        if(func === undefined)
            this.trigger(this.Event.CHANGE);
        else if($.isFunction(func)){
            this.bind(this.Event.CHANGE, func);
        }
    };

    $.fn.seriesSelect = function(data, str, num){
        var $this = $(this),
            ss =  $this.data('series-select');
        switch(typeof data) {
            case 'string': {
                return ss[data].apply(ss, [].slice.call(arguments, 1))
            }
            case 'undefined': {
                return ss;
            }
            default : {
                if (!ss) {
                    $this.data('series-select', ss = new SeriesSelect(data, str, num));
                    ss.getElem().appendTo($this);
                    return $this;
                }
                return ss;
            }
        }

    };
    return $.SeriesSelect = function(data, str, num, bool) {
        return new SeriesSelect(data, str, num, bool);
    }

});