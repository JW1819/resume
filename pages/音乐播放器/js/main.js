var app = new   Vue({
    el:"#player",
    data:{
        query:"",
        musicList:[],
        //歌曲地址
        musicUrl:"",
        //歌曲封面
        musicCover:"",
        //评论列表
        hotComments:[],
        //动画播放状态
        isPlaying:false,
        //遮罩层的显示状态
        isShow:false,
        //mv地址
        mvUrl:""
    },
    methods:{
        //歌曲搜索
        searchMusic:function(){
            var that = this;
            axios.get("https://autumnfish.cn/search?keywords=this.query"+this.query)
            .then(function(response){
                //console.log(response);
                that.musicList = response.data.result.songs;
            },function(err){});
        },
        //播放歌曲
        playMusic:function(musicId){
           // console.log(musicId);
           var that=this;
            axios.get("https://autumnfish.cn/song/url?id="+musicId)
            .then(function(response){
                //console.log(response.data.data[0].url);
                that.musicUrl = response.data.data[0].url;
            },function(err){ })

            //更换封面
            axios.get("https://autumnfish.cn/song/detail?ids="+musicId)
            .then(function(response){
                //console.log(response.data.songs[0].al.picUrl);
                that.musicCover=response.data.songs[0].al.picUrl;
            },function(err){})
            //评论
            axios.get("https://autumnfish.cn/comment/hot?type=0&id="+musicId)
            .then(function(response){
                //console.log(response.data.hotComments);
                that.hotComments=response.data.hotComments;
            },function(err){})
        }, 
        play:function(){
            this.isPlaying =true;
        },
        pause:function(){
            this.isPlaying=false;
        },
        //mv
        playMv:function(mvid){
            var that=this;
            axios.get("https://autumnfish.cn/mv/url?id="+mvid)
            .then(function(response){
                console.log(response.data.data.url);
                that.isShow=true;
                that.mvUrl=response.data.data.url;
            },function(err){})

        },
        
        hide:function(){
            this.isShow = false;
        }

    }
})