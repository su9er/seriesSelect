##seriesSelectJs使用指南##

###【说明】###
此组件包含4个参数，其中第一个参数为必选参数，其他为可选参数  
1. @param {Object} data : 第一个参数是要用来选择的数据对象data（数组对象）      
2. @param {String} str : 第二个参数是初始化时候的默认数据（字符串对象）,可以使数据的编号no,或者是数据的名称name   
3. @param {Number} num : 第三个参数是联动选择器的最大显示级数（数字类型），默认是两级  
4. @param {Boolean} boolean : 第四个参数是一级一级显示的开关（boolean类型），默认是false  
5. @return {Object} seriesSelect 
6. 参数可以任意顺序任意数量  


### 【依赖以下文件】 ###
1. jquery  


### 【API】 ###
1. val(str):  
	>   当str为空时，则返回当前所选数据的编号no，当str不为空是，则设置选择器的值为str，str可以是数据的编号no,可以是数据的名字name  

2. set(str):
	>   设置选择器的值为str，str可以是数据的编号no,可以是数据的名字name  

3. get(str):
	>   获取指定数据str的关联值，可以通过编号no获取名字name，也可以通过名字name获取编号no  

4. getSpanAreaData:
	>   获取当前选中的每一级数据数组对象[{no:'...',name:'...'},..]  

5. getTheSelect(select):
	>   获取指定select(dom or $(..))选中的数据对象{no:'...',name:'...'}  

6. getElem:
	>   获取选择器的最外层span的jQuery对象  

7. getCUrrentNo:
	>   获取当前所选数据的编号no

8. disabled(disabled, len):
	>   使指定级数的select为只读或可选

9. change(func):
	>   为组件绑定外部事件，当选择变化时触发






