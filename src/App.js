import React, { Component } from 'react';
import './App.scss';
import $ from 'jquery';
import { Base64 } from 'js-base64';

class App extends Component {
	constructor(props){
		super(props);
		this.state = {
			authData: {},
			showImg: true
		}
	}
	componentWillMount(){
		this.init();
	}
	componentDidMount(){
		let _this = this;
		$('.switchBox .btn').mousedown(function(e) {
			// e.pageX
			let positionDiv = $(this).offset();
			let distenceX = e.pageX - positionDiv.left;
			$('.switchBox').addClass('moveing')
			let _X = 0;
			
			$(document).mousemove(function(e) {
				let x = e.pageX - distenceX - positionDiv.left;
				let endL = $('.switchBox').width() - $('.switchBox .btn').width();
				_X = x = x < 0 ? 0 : x > endL ? endL : x;

				$('.switchBox .btn, .top .dragBtn').css({
					'left': parseInt(x) + 'px',
				});
				$('.switchBox .btn-left').css({
					'width': parseInt(x + 40 -1) + 'px',
				});
			});
		
			$(document).mouseup(function() {
				
				//  事件结束时 释放移动事件
				$(document).off('mousemove');
				$(document).off('mouseup');

				//  获取提交数据对象并字符串序列化后 base64 加密在进行逆序
				let _dataStr = JSON.stringify({token: _this.state.authData.token, captcha: _X});
				_dataStr = Base64.encode(_dataStr);
				_dataStr = _dataStr.split('').reverse().join("");

				// 隐藏图片
				_this.setState({showImg: false})
				$('.switchBox').addClass('loading');
				// 提交数据进行验证
				_this.postData(_dataStr, type => {
					
					$('.switchBox').removeClass('moveing loading error success');

					if(type === 'err'){
						$('.switchBox').addClass('error');
						_this.init();
					}else{
						$('.switchBox').addClass('success');
					}
				})
			});
		});
		
	}
	init(){
		let settings1 = {
			"async": true,
			"crossDomain": true,
			"url": "/edusoho/api/drag_captcha",
			"method": "POST",
			"headers": {
				"Accept": "application/vnd.edusoho.v2+json",
				"cache-control": "no-cache",
				"Postman-Token": "a8d07797-7410-4b79-98eb-f342f4087bfa"
			}
		}
		let _this = this;
		$.ajax(settings1).done(function (response) {
			console.log(response);
			$('.switchBox').removeClass('loading error success');
			$('.switchBox .btn, .top .dragBtn, .switchBox .btn-left').css({
				'left':  '0px',
			});
			$('.switchBox .btn-left').css({
				'width': '0px',
			});
			_this.setState({authData:response, showImg: true})
		});
	}
	postData(data,fn){
		let settings = {
			"async": true,
			"crossDomain": true,
			"url": "/edusoho/api/drag_captcha/"+data,
			"method": "GET",
			"headers": {
			  "Accept": "application/vnd.edusoho.v2+json",
			  "cache-control": "no-cache",
			  "Postman-Token": "0dd3abca-f423-472e-852f-88bb39f7ee74"
			}
		}
		  
		$.ajax(settings)
		.done(function (response) {
			console.log(response, '成功');
			fn && fn('success');
		})
		.fail(function(err){
			console.log(err,'失败');
			fn && fn('err');
		});
	}
	render() {
		const loadingStyle = {
			"background": "url('../images/loading-bg.png)no-repeat",
			"background-color": "#f7f9fa",
			"background-position": "50%",
			"background-size": 'cover',
			// "background": "url('../images/qm.log.jpg')no-repeat",
			// "background-size": "45%",
        	// "background-position": "50% 0px"
		}
		return (
			<div className={["App",this.state.showImg ? 'showImg' :'showLoading'].join(' ')}>
				<div className="top">
					<div className="dragImg">
						<img src={this.state.authData.url} alt="大图"/>
					</div>
					<div className="dragBtn">
						<img src={this.state.authData.jigsaw} alt="小图"/>
					</div>
				</div>
				<div className="loading-box" style={loadingStyle}>
					<div className="loading">
						<img src="../images/loading.gif" />
					</div>
					<p>加载中...</p>
				</div>
				<div className="switchBox">
					<div className="btn-left"></div>
					<div className="bg"><p>向右滑动完成拼图</p></div>
					<div className="btn"><p></p></div>
				</div>
			</div>
		);
	}
}

export default App;
