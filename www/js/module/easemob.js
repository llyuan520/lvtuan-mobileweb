var easemobModule = angular.module('easemobModule', ['ionic']);

function easemobService($ionicLoading) {
	var self = this;
	var conn;
    var textSending = false;
    var talkInputId = "talkInputId";
    var curUserId = null;
    var curChatUserId = null;
    var msgCardDivId = "chat01";
    var groupFlagMark = "group--";

    self.msgType = null;

	//加载在控制器里面的 微信签权登录
	self.init = function(userId,msgType) {
		curChatUserId = userId.toString();

		self.handleConfig();
        self.msgType = msgType;

        conn = new Easemob.im.Connection();
        //初始化连接
        conn.init({
            https : AppSettings.easemobHttps,
            url: AppSettings.easemobXmppURL,
            //当连接成功时的回调方法
            onOpened : function() {
                self.handleOpen(conn);
            },
            //当连接关闭时的回调方法
            onClosed : function() {
                self.handleClosed();
            },
            //收到文本消息时的回调方法
            onTextMessage : function(message) {
                console.info('onTextMessage');
                self.handleTextMessage(message);
            },
            //异常时的回调方法
            onError : function(message) {
                conn.stopHeartBeat(conn);
            }
        });
	}

	self.handleConfig = function() {
        if(Easemob.im.Helper.getIEVersion() < 10) {
            AppSettings.easemobHttps = location.protocol == 'https:' ? true : false;
            if(!AppSettings.easemobHttps) {
                if(AppSettings.easemobXmppURL.indexOf('https') == 0) {
                    AppSettings.easemobXmppURL = AppSettings.easemobXmppURL.replace(/^https/, 'http');
                }
                if(AppSettings.easemobApiURL.indexOf('https') == 0) {
                    AppSettings.easemobApiURL = AppSettings.easemobApiURL.replace(/^https/, 'http');
                }
            } else {
                if(AppSettings.easemobXmppURL.indexOf('https') != 0) {
                    AppSettings.easemobXmppURL = AppSettings.easemobXmppURL.replace(/^http/, 'https');
                }
                if(AppSettings.easemobApiURL.indexOf('https') != 0) {
                    AppSettings.easemobApiURL = AppSettings.easemobApiURL.replace(/^http/, 'https');
                }
            }
        }
	}

	self.login = function(user, pwd) {
        //启动心跳
        if (!conn.isOpened()) {
            $ionicLoading.show();
            conn.open({
                apiUrl : AppSettings.easemobApiURL,
                user : user,
                pwd : pwd,
                //连接时提供appkey
                appKey : AppSettings.easemobAppKey
            });
        }
	}

    //处理连接时函数,主要是登录成功后对页面元素做处理
    self.handleOpen = function(conn) {
        //从连接中获取到当前的登录人注册帐号名
        curUserId = conn.context.userId;
        conn.setPresence();//设置用户上线状态，必须调用
        //获取当前登录人的联系人列表
        conn.getRoster({
            success : function(roster) {
                // 页面处理
                $ionicLoading.hide();
                self.showChatUI();
            }
        });
        //启动心跳
        if (conn.isOpened()) {
            conn.heartBeat(conn);
        }
    };

    //连接中断时的处理，主要是对页面进行处理
    self.handleClosed = function() {
        curUserId = null;
        curChatUserId = null;
        curRoomId = null;
        bothRoster = [];
        toRoster = [];
        for(var i=0,l=audioDom.length;i<l;i++) {
            if(audioDom[i].jPlayer) audioDom[i].jPlayer('destroy');
        }
        clearContactUI("contactlistUL", "contactgrouplistUL",
                "momogrouplistUL", msgCardDivId);
        groupQuering = false;
        textSending = false;
    };

    //easemobwebim-sdk收到文本消息的回调方法的实现
    self.handleTextMessage = function(message) {
        console.info(message, self.msgType);
        var from = message.from;//消息的发送者
        var mestype = message.type;//消息发送的类型是群组消息还是个人消息
        var messageContent = message.data;//文本消息体
        //TODO  根据消息体的to值去定位那个群组的聊天记录
        if (self.msgType == mestype) {
            var room = message.to;
            if (from != curUserId && from == curChatUserId) {
                if (mestype == 'groupchat') {
                    var msgtext = messageContent.replace(/\n/g, '<br>');
                    self.appendMsg(message.from, message.to, messageContent, mestype, message.ext.realname, message.ext.avatar);
                } else {
                    self.appendMsg(message.from, message.from, messageContent, mestype, message.ext.realname, message.ext.avatar);
                }
            }
        }
    };

    //设置当前显示的聊天窗口div，如果有联系人则默认选中联系人中的第一个联系人，如没有联系人则当前div为null-nouser
    self.setCurrentContact = function(defaultUserId) {
        self.showContactChatDiv(defaultUserId);
        curChatUserId = defaultUserId;
    };

    //构造当前聊天记录的窗口div
    self.getContactChatDiv = function(chatUserId) {
        return document.getElementById(curUserId + "-" + chatUserId);
    };

    //如果当前没有某一个联系人的聊天窗口div就新建一个
    self.createContactChatDiv = function(chatUserId) {
        var msgContentDivId = curUserId + "-" + chatUserId;
        var newContent = document.createElement("div");
        $(newContent).attr({
            "id" : msgContentDivId,
            "class" : "chat01_content",
            "className" : "chat01_content",
            "style" : "display:block"
        });
        $('#null-nouser').css({
            "display" : "none"
        });
        return newContent;
    };

    //显示当前选中联系人的聊天窗口div，并将该联系人在联系人列表中背景色置为蓝色
    self.showContactChatDiv = function(chatUserId) {
        var contentDiv = self.getContactChatDiv(chatUserId);
        if (contentDiv == null) {
            contentDiv = self.createContactChatDiv(chatUserId);
            document.getElementById(msgCardDivId).appendChild(contentDiv);
        }
        contentDiv.style.display = "block";
        var contactLi = document.getElementById(chatUserId);
        if (contactLi == null) {
            return;
        }
        contactLi.style.backgroundColor = "#33CCFF";
        var dispalyTitle = null;//聊天窗口显示当前对话人名称
        if (chatUserId.indexOf(groupFlagMark) >= 0) {
            dispalyTitle = "群组" + $(contactLi).attr('displayname') + "聊天中";
            curRoomId = $(contactLi).attr('roomid');
            $("#roomMemberImg").css('display', 'block');
        } else {
            dispalyTitle = "与" + chatUserId + "聊天中";
            $("#roomMemberImg").css('display', 'none');
        }
        document.getElementById(talkToDivId).children[0].innerHTML = dispalyTitle;
    };

    self.clearContactUI = function(contactlistUL, contactgrouplistUL, momogrouplistUL, contactChatDiv) {
        //清除左侧联系人内容
        $('#contactlistUL').empty();
        $('#contactgrouplistUL').empty();
        $('#momogrouplistUL').empty();
        //处理联系人分组的未读消息处理
        var accordionChild = $('#accordionDiv').children();
        for (var i = 1; i <= accordionChild.length; i++) {
            var badgegroup = $('#accordion' + i).find(".badgegroup");
            if (badgegroup && badgegroup.length > 0) {
                $('#accordion' + i).children().remove();
            }
        }
        ;
        //清除右侧对话框内容
        document.getElementById(talkToDivId).children[0].innerHTML = "";
        var chatRootDiv = document.getElementById(contactChatDiv);
        var children = chatRootDiv.children;
        for (var i = children.length - 1; i > 1; i--) {
            chatRootDiv.removeChild(children[i]);
        }
        $('#null-nouser').css({
            "display" : "block"
        });
    };

    self.showChatUI = function() {
        $('#content').css({
            "display" : "block"
        });
    };

    self.sendText = function(chattype) {
        if (textSending) {
            return false;
        }
        textSending = true;
        var msgInput = document.getElementById(talkInputId);
        var msg = msgInput.value;
        if (msg == null || msg.length == 0) {
            textSending = false;
            return false;
        }
        var to = curChatUserId;

        if (to == null) {
            textSending = false;
            return false;
        }
        var ext = {
            realname: currentUser.realname,
            avatar: currentUser.avatar
        }
        var options = {
            to : to,
            msg : msg,
            type : chattype,
            ext : ext
        };
        // 群组消息和个人消息的判断分支
        //easemobwebim-sdk发送文本消息的方法 to为发送给谁，meg为文本消息对象
        conn.sendTextMessage(options);
        console.info("sent text options", options);

        var msgtext = msg.replace(/\n/g, '<br>');
        self.appendMsg(curUserId, to, msgtext,chattype,currentUser.realname,currentUser.avatar);
        msgInput.value = "";
        msgInput.focus();
        setTimeout(function() {
            textSending = false;
        }, 2000);
        return true;
    };

    //显示聊天记录的统一处理方法
    self.appendMsg = function(who, contact, message, chattype, realname, avatar) {
        var contactDivId = contact;
        if (chattype && chattype == 'groupchat') {
            contactDivId = groupFlagMark + contact;
        }
        var contactLi = document.getElementById(contactDivId);
        var localMsg = null;
        if (typeof message == 'string') {
            localMsg = Easemob.im.Helper.parseTextMessage(message);
            localMsg = localMsg.body;
        } else {
            localMsg = message.data;
        }
        var headstr = [ "<p1>" + self.getLoacalTimeString() + "   <span></span>" + "   </p1>",
                "<p2>" + realname + "<b></b><br/></p2><img src=" + avatar + "><br>" ];
        var header = $(headstr.join(''))
        var lineDiv = document.createElement("div");
        for (var i = 0; i < header.length; i++) {
            var ele = header[i];
            lineDiv.appendChild(ele);
        }
        var messageContent = localMsg;
        for (var i = 0; i < messageContent.length; i++) {
            var msg = messageContent[i];
            var type = msg.type;
            var data = msg.data;

            var eletext = "<p3>" + data + "</p3>";
            var ele = $(eletext);
            ele[0].setAttribute("class", "chat-content-p3");
            ele[0].setAttribute("className", "chat-content-p3");
            for (var j = 0; j < ele.length; j++) {
                lineDiv.appendChild(ele[j]);
            }
        }
        if (curChatUserId == null && chattype == null) {
            self.setCurrentContact(contact);
            if (time < 1) {
                $('#accordion3').click();
                time++;
            }
        }

        var msgContentDiv = document.getElementById(curUserId + "-" + contactDivId);
        if (curUserId == who) {
            lineDiv.style.textAlign = "right";
            lineDiv.className = "immediate-information easemobmain-record img-right";
        } else {
            lineDiv.style.textAlign = "left";
            lineDiv.className = "immediate-information easemobmain-record img-left";
        }
        if (msgContentDiv == null && chattype && chattype == 'groupchat') {
            msgContentDiv = self.createContactChatDiv(contactDivId);
            document.getElementById(msgCardDivId).appendChild(msgContentDiv);
        }
        msgContentDiv.appendChild(lineDiv);
        msgContentDiv.scrollTop = msgContentDiv.scrollHeight;
        return lineDiv;
    };

    self.getLoacalTimeString = function() {
        var date = new Date();
        var time = date.getHours() + ":" + date.getMinutes() + ":"
                + date.getSeconds();
        return time;
    };
}
					
easemobModule.service('easemobService', easemobService);