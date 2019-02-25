require(["config"], function() {
    require(["mui"], function(mui) {
        function init() {
			mui.init({
				  pullRefresh : {
					container:"#pullRefresh",//待刷新区域标识，querySelector能定位的css选择器均可，比如：id、.class等
					up : {
					  height:50,//可选.默认50.触发上拉加载拖动距离
					  auto:true,//可选,默认false.自动上拉加载一次
					  contentrefresh : "正在加载...",//可选，正在加载状态时，上拉加载控件上显示的标题内容
					  contentnomore:'没有更多数据了',//可选，请求完毕若没有更多数据时显示的提醒内容；
					  callback :ajaxData //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
					}
				}
			});
			sort();
			find();
			look();
			delt();
			search();
        }
		
		//上拉加载
		var page = 0;
		var pageSize = 8;
		var sortCunt = 1;
		function ajaxData(sortClick){
			page++;
			setTimeout(function(){
				mui.ajax('/api/findPage',{
					data:{
						page:page,
						pageSize:pageSize,
						sortCunt:sortClick
					},
					dataType:'json',//服务器返回json格式数据
					type:'post',//HTTP请求类型
					timeout:10000,//超时时间设置为10秒；
					success:function(data){
						if(data.data.length == 0){
							mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
						}else{
							mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
						}
						document.querySelector(".list").innerHTML = data.data.map(function(item,index){
							return `
									<li class="mui-table-view-cell">姓名：<span>${item.name}</span>
									    <button type="button" class="mui-btn mui-btn-primary button look" data-id="${item._id}">查看</button>
									    <button type="button" class="mui-btn mui-btn-danger delete" data-id="${item._id}">删除</button>
									</li>
									`
						}).join("");
					},
					error:function(xhr,type,errorThrown){}
				});
			})
		}

		//查找全部
        function find() {
            mui.ajax('/api/find', {
                dataType: 'json', //服务器返回json格式数据
                type: 'post', //HTTP请求类型
                timeout: 10000, //超时时间设置为10秒；
                success: function(data) {
                    document.querySelector(".list").innerHTML = data.data.map(function(item, index) {
                        return `<li class="mui-table-view-cell">姓名：<span>${item.name}</span>
                                    <button type="button" class="mui-btn mui-btn-primary button look" data-id="${item._id}">查看</button>
                                    <button type="button" class="mui-btn mui-btn-danger delete" data-id="${item._id}">删除</button>
                                </li>
								`
                    }).join("");
                },
                error: function(xhr, type, errorThrown) {}
            });
        }
        
		
		//删除
		function delt(){
			mui(".list").on("tap",".delete",function(){
				var id = this.getAttribute("data-id");
				mui.ajax('/api/remove',{
					data:{
						id:id
					},
					dataType:'json',//服务器返回json格式数据
					type:'post',//HTTP请求类型
					timeout:10000,//超时时间设置为10秒；
					success:function(data){
						mui.alert(data.data,function (e) {
						   window.location.reload();
						})
					},
					error:function(xhr,type,errorThrown){
						
					}
				});
			})
		}
		
		
		//查找
		function search(){
			document.querySelector(".search").addEventListener("tap",function(){
				var searchName = document.querySelector('.searchName').value;
				mui.ajax('/api/mohu',{
					data:{
						name:searchName
					},
					dataType:'json',//服务器返回json格式数据
					type:'post',//HTTP请求类型
					timeout:10000,//超时时间设置为10秒；
					success:function(data){
						var str  ="";
						document.querySelector(".list").innerHTML = data.data.map(function(item,index){
							return `<li class="mui-table-view-cell">姓名：<span>${item.name}</span>
										<button type="button" class="mui-btn mui-btn-primary button look" data-id="${item._id}">查看</button>
										<button type="button" class="mui-btn mui-btn-danger delete" data-id="${item._id}">删除</button>
									</li>
									`
									}).join("");
					},
					error:function(xhr,type,errorThrown){}
				});
			})
		}
		
		
		//查看
		function look(){
			mui(".list").on("tap",".look",function(){
				var id = this.getAttribute("data-id");
				window.location.href = "./page/detail.html?id=" + id;
			})
		}
		
		
		//排序
		function sort(){
			document.querySelector(".right").addEventListener("tap",function(){
				if(sortCunt == 1){
					document.querySelector(".list").innerHTML="";
					ajaxData(1);
					sortCunt = 0;
				}else{
					document.querySelector(".list").innerHTML="";
					ajaxData(0);
					sortCunt = 1;
				}
			})	
		}
		init()
    })
})