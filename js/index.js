
var QuizAddress = "n1jLXfxrBCFS6GZq3nGBXG5QRFZQHUkD1eF";
$(function() {
	
	
		var NebPay = require("nebpay"); //https://github.com/nebulasio/nebPay
		var nebpay = new NebPay();


	$("#allQuiz").click(function() {
		$("#detailTitle").text("All Quiz-全部Quiz");

		var to = QuizAddress;
		var value = "0";
		var callFunction = "getQuiz";
		var callArgs = "[]";
		nebpay.simulateCall(to, value, callFunction, callArgs, {
			listener: function(resp) {
				//console.log(JSON.stringify(resp.result));
				if(resp.result == ""){
					$("#searchresult").html('<div class="panel-body" >没有记录</div>');
					return;
				}
				var res = JSON.parse(resp.result);
				if(res.length == 0){
					$("#searchresult").html('<div class="panel-body">没有记录</div>');
					return;
				}

				var tempStr = "";

				for (var i = 0; i < res.length; i++) {
					if (i % 2 == 0) {
						tempStr += '<div class="panel-body"> ';
					} else {
						tempStr += '<div class="panel-footer">';
					}

					//					
					tempStr += '<p>';
					tempStr += res[i].name+'  保证金:'+ res[i].value/1e15;
					tempStr += '</p>';
					tempStr += '<p>';
					tempStr += '<small><cite>' + 'Quiz ID:' + res[i].author + '</cite></small>';
					tempStr += '<br>';
					tempStr += '<a class="btn" href="javascript:void(0)" id="like" onclick="addMyQuiz(';
					tempStr += res[i].index;
					tempStr += ')">查看详细-获取答案</a>';

					tempStr += '</p> </div> ';
				}
				console.log(tempStr);
				$("#searchresult").html(tempStr);
			}
		});

	});
	$("#allQuiz").click();

	$("#myQuiz").click(function() {
		$("#detailTitle").text("My Quiz-收藏Quiz");



		var to = QuizAddress;
		var value = "0";
		var callFunction = "getMy";
		var callArgs = "[]";
		nebpay.simulateCall(to, value, callFunction, callArgs, {
			listener: function(resp) {
				//console.log(JSON.stringify(resp.result));
				if(resp.result == ""){
					$("#searchresult").html('<div class="panel-body">没有记录</div>');
					return;
				}
				var res = JSON.parse(resp.result);
				if(res.length == 0){
					$("#searchresult").html('<div class="panel-body">没有记录</div>');
					return;
				}
				

				var tempStr = "";

				for (var i = 0; i < res.length; i++) {
					if (i % 2 == 0) {
						tempStr += '<div class="panel-body"> ';
					} else {
						tempStr += '<div class="panel-footer">';
					}

					//					
					tempStr += '<p>';
					tempStr += res[i].name;
					tempStr += '</p>';
					tempStr += '<p>';
					tempStr += res[i].content;
					tempStr += '</p>';
					tempStr += '<p>';
					tempStr += '<small><cite>' + 'Quiz提交ID:' + res[i].author + '  保证金:'+ res[i].value/1e15 +'</cite></small>';
					tempStr += '<br>';
					tempStr += '<a class="btn" href="#" id="unMyQuiz" onclick="unMyQuiz(';
					tempStr += res[i].index;
					tempStr += ')">移除</a>';
					
					tempStr += '</p> </div> ';
				}
				console.log(tempStr);
				$("#searchresult").html(tempStr);
			}
		});

	});

	$("#newQuiz").click(function() {
		$("#detailTitle").text("New Quiz-提交新Quiz源码")

		var tempStr = '';
		tempStr += '<div class="panel-body"> ';
		tempStr += '<form role="form">';
		tempStr += '<div class="form-group">';
		tempStr += '<p>Quiz 谜题谜面 </p>';
		tempStr += '<textarea class="form-control" rows="5" id="name" ></textarea>';
		tempStr += '<p>Quiz 谜题谜底</p>';
		tempStr += '<textarea class="form-control" rows="3" id="content" >谜底:</textarea>';
		tempStr += '<p>提交保证金 会展示 自由选择</p>';
		tempStr += '<textarea class="form-control" rows="1" id="bals" >0.001</textarea>';	
		tempStr += '<button type="button" class="btn btn-primary" id="savebutton" onclick="save();">提交谜题Quiz</button>';		
		tempStr += '</div>';
		tempStr += '</form>';
		tempStr += '</div> ';
		console.log(tempStr);

		$("#searchresult").html(tempStr);
	});

});

function addMyQuiz(index){
	var NebPay = require("nebpay"); //https://github.com/nebulasio/nebPay
	var nebpay = new NebPay();
		var to = QuizAddress;
		var value = "0.000001";
		var callFunction = "adMy";
		var callArgs = "[\"" + index + "\"]";
		nebpay.call(to, value, callFunction, callArgs, {
			listener: function(resp) {
				console.log(JSON.stringify(resp.result));
			}
		});
};

function unMyQuiz(index){
	var NebPay = require("nebpay"); //https://github.com/nebulasio/nebPay
	var nebpay = new NebPay();
		var to = QuizAddress;
		var value = "0";
		var callFunction = "unMy";
		var callArgs = "[\"" + index + "\"]";
		nebpay.call(to, value, callFunction, callArgs, {
			listener: function(resp) {
				console.log(JSON.stringify(resp.result));
			}
		});
};

function save(){
	var NebPay = require("nebpay"); //https://github.com/nebulasio/nebPay
	var nebpay = new NebPay();
		var content = $("#content").val();
		var name = $("#name").val();
		var bal = $("#bals").val();
		if (content == "") {
			alert("请输入谜。");
			return;
		}
		if (name == "") {
			alert("请输入Quiz。");
			return;
		}
		if (bal == "") {
			alert("请输入保证金。");
			return;
		}
		content= content.replace(/\n/g,"<br>"); 
		name= name.replace(/\n/g,"<br>"); 
		var to = QuizAddress;
		var value = bal;
		var callFunction = "save";
		var callArgs = "[\"" + name + '","' + content + "\"]";
		nebpay.call(to, value, callFunction, callArgs, {
			listener: function Push(resp) {
				console.log("response of push: " + JSON.stringify(resp))
				var respString = JSON.stringify(resp);
				if(respString.search("rejected by user") !== -1){
					alert("关闭交易,取消上传谜题")
				}else if(respString.search("txhash") !== -1){
					alert("上传Hash: " + resp.txhash+"请等待交易确认,如果上传失败请检查内容是否含有特殊字符")
				}
			}
		});
	
};