const api = require('../../api/index.js');
const emitter = require('../../common/index.js').emitter;

Page({
    data: {
    	tag : [],
    	tagFocus: 0,
    	movieList: [],
    	liveList: [],
        blackHoleShow:false
    },
    onLoad: function(){
		let _this = this;        
        // 加载电影分类
        wx.request({
            url: api.getMainContentUrl(), //仅为示例，并非真实的接口地址
            method:'POST',
            data: {
                'action': 'getMovieTag',
                'projectID': 'demo'
            },
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function(res) {
            	_this.setData({
            		tag:res.data.data
            	})

                console.log(res.data.data)
                //第一次加载电影列表
                // console.log(_this.data.tagFocus)
                _this.getMovieList(_this.data.tagFocus);
                // _this.getLiveList();

            }
        })

    },
    //加载电影列表
    getMovieList: function(tagID){
    	let _this = this;    
        wx.request({
            url: api.getMainContentUrl(), //仅为示例，并非真实的接口地址
            method:'POST',
            data: {
                'action': 'getMovieListByTag',
                'projectID': 'demo',
                'data':{
                	'tagid':tagID
                }
            },
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function(res) {
            	_this.setData({
            		movieList:res.data.data
            	});

                _this.setData({blackHoleShow:true});

                console.log(res.data.data);
            }
        })    	
    },
    //加载直播列表
    getLiveList: function(){
    	let _this = this;    
        wx.request({
            url: api.getMainContentUrl(), //仅为示例，并非真实的接口地址
            method:'POST',
            data: {
                'action': 'getLiveList',
                'projectID': 'demo'
            },
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function(res) {
            	_this.setData({
            		liveList:res.data.data
            	});
                console.log(res.data.data);
            }
        }) 
    },
    // 切换分类
    changeTagFocus: function(e){
    	// this.setData({tagFocus:tagID})
    	let tagID = e.target.dataset.id;
    	this.setData({tagFocus: tagID});
    	if(tagID != -1){
    		this.getMovieList(tagID);
    	} else {
    		this.getLiveList();
    	}
    },
    // 换台
    changeChannel(e){
    	let channelIndex = e.currentTarget.dataset.idx;
    	console.log(channelIndex)
    	emitter('playLive',{'channelIndex': channelIndex});
    },
    // 点播
    playMovie(e){
    	let movieID = e.currentTarget.dataset.id;
    	console.log(movieID)
    	emitter('playMovie',{'movieID': movieID});
    },
});


