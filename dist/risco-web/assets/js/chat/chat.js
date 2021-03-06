(function ($) {
    $.fn.IngicChatInit = function (options) {
        $("title").text(options.user.name + options.user.id);
        IngicChat.InitChat(options);
    };
    $.fn.IngicChatDestroy = function () {
        IngicChat.DestroyChat();
    };

    $.fn.setImage = function (src, isBackground, defaultSrc) {
        debugger
        if (isBackground) {
            debugger
            if (defaultSrc) this.css("background-image", "url(" + src + "), url(" + defaultSrc + ")");
            else {
                getBase64(src , (res) => {
                    this.css("background-image", "url(" + res + ")")    
                })
            };
        }
        else {
            this.attr("src", src);
            this.on("error", () => {
                this.attr("src", defaultSrc);
            });
        }

        return this.prevObject;
    };
    $.fn.setText = function (text) {
        this.text(text);
        return this.prevObject;
    };
    $.fn.setDatetime = function (date, fromNow) {
        if (date) {
            var newDate;
            if (fromNow) {
                newDate = moment(date).fromNow();
            }
            else {
                newDate = moment(date).format('Do MMM YYYY - hh:mm a');
            }
            this.text(newDate);
        }
        return this.prevObject;
    };
    $.fn.setAttribute = function (attributeName, attributeValue) {
        this.attr(attributeName, attributeValue);
        return this.prevObject;
    };

    $.fn.setAttributeIf = function (attributeName, attributeValue, condition) {
        if (condition) {
            this.attr(attributeName, attributeValue);
        }
        return this.prevObject;
    };
}(jQuery));


class IngicChat {
    static InitChat(options) {
        IngicChat.InitOptionsAndVars();

        _user = options.user;
        _appName = options.appName;
        _options = options;
        PushNotification.RequestNotificationPermission();

        new SocketHelper(options.socketBaseUrl, options.socketPath, options.user.id);
        SocketHelper.SubscribeSocket_OnConnectDisconnect();
        SocketHelper.SubscribeSocket_OnRequest(options);
        SocketHelper.SubscribeSocket_OnOnlineStatusUpdate(options);

        Helper.SetFriendListDateRefreshSetting(options);
    }

    static LoadChatPage(callback) {
        if (_options) {
            FriendRequest.LoadExistingAcceptedRequests((requestList) => {
                if (requestList && requestList.length > 0) {
                    var acceptedRequestList = Helper.ParseRequestsAndSave(_options, requestList);
                    var friendId = acceptedRequestList[0].request.sender_id;
                    var friendUsername = acceptedRequestList[0].request.sender_username;
                    if (callback) {
                        callback();
                    }
                    else {
                        IngicChat.InitChatWithFriend(friendId, friendUsername); //step 2
                    }
                    SocketHelper.Socket.emit("userstatus", "");
                }
            });
        }
    }

    static InitChatWithFriend(friendId, friendUsername) {
        _hasPreviousMessages = false;
        _totalRecords = 0;
        _pageNo = 0;

        _friendId = friendId;
        _friendUsername = friendUsername;
        _currentChannel = SocketHelper.CreateChannelName(_options.appName, _options.user.id, friendId);

        Helper.ShowSelectedFriend(_options);
        Message.LoadExistingMessages(_options, false);
        Helper.InitJquery(_options);
    }

    static DestroyChat() {
        SocketHelper.Socket.disconnect();
        IngicChat.InitOptionsAndVars();
    }

    static InitOptionsAndVars() {
        _hasPreviousMessages = false;
        _totalRecords = 0;
        _pageNo = 0;
        _pageRecordCount = 10;
        _user = null;
        _appName = "";

        _friendId = 0;
        _friendUsername = "";
        _currentChannel = "";
        _options = null;
    }
}

class SocketHelper {

    constructor(socketBaseUrl, socketPath, userId) {
        var socketOptions = {
            path: socketPath,
            query: {
                user_id: userId
            }
        }
        SocketHelper.Socket = io(socketBaseUrl, socketOptions);
    }

    static SubscribeSocket_OnConnectDisconnect() {
        SocketHelper.Socket.on('connect', () => {
            console.log("Chat is Connected: " + SocketHelper.Socket.connected + "\n");

        });

        SocketHelper.Socket.on('disconnect', () => {
            console.log("Chat is Disconnected: " + SocketHelper.Socket.connected + "\n");
        });
    }

    static SubscribeSocket_OnMessage(options, friendId) {
        var channel = SocketHelper.CreateChannelName(options.appName, options.user.id, friendId);
        SocketHelper.Socket.removeAllListeners(channel);
        SocketHelper.Socket.on(channel, (messageObjString) => { // on new message
            var message = Message.CreateMessageFromStringObj(messageObjString);
            if (message.messageType == _MessageSendingType.TEXT) {
                if (message.channel === _currentChannel) {
                    Message.RenderMessage(message, options, false);

                    $(options.messageListContainerSelector).animate({ scrollTop: $(options.messageListContainerSelector).prop("scrollHeight") }, 1000);
                }
                else {
                    //unread count
                }
                if (message.senderUserId == friendId) {
                    PushNotification.ShowPushNotification(options, message.senderUserName, message.message);
                }

                Message.RenderLastMessageInFriendList(options, message);
            }
            else if (message.messageType == _MessageSendingType.TYPING && _currentChannel == message.channel) {
                if (options.user.id == message.senderUserId) {
                    setTimeout(() => {
                        Message.SendMessage(_MessageSendingType.STOP_TYPING, options);
                    }, 2000);
                }
                else {
                    $(options.userTypingSelector)
                        .text(message.senderUserName + " is typing...")
                        .show();
                }
            }
            else if (message.messageType == _MessageSendingType.STOP_TYPING && _currentChannel == message.channel) {
                $(options.userTypingSelector)
                    .empty()
                    .hide();
            }
        });

    }

    static SubscribeSocket_OnRequest(options) {
        var channel = options.appName + _acceptedRequestChannelPart + options.user.id;
        SocketHelper.Socket.emit("subscribe:channel", channel);
        SocketHelper.Socket.on(channel, (request) => {
            if (request) {
                var reqObj = {
                    request: JSON.parse(request)
                };
                SocketHelper.SubscribeAndShowOneFriend(options, reqObj);

                if ($(options.friendListContainerSelector).children().length === 1) {
                    IngicChat.InitChatWithFriend(reqObj.request.sender_id, reqObj.request.sender_username);
                }
                SocketHelper.Socket.emit("userstatus", "");
            }
        });
    }

    static SubscribeSocket_OnOnlineStatusUpdate(options) {
        var channel = "HeartBeat:" + options.appName;

        SocketHelper.Socket.emit("subscribe:channel", channel);
        SocketHelper.Socket.on(channel, (onlineList) => {
            $(options.friendListContainerSelector).find(options.friendOnlineSelector).hide();
            $(options.friendListContainerSelector).children().each(function () {
                var userId = $(this).data(_friendUserIdDataAttrName);
                var isOnline = onlineList.find(x => x.onlineStatus && x.userId == userId)
                if (isOnline) {
                    $(this).find(options.friendOnlineSelector).show();
                }
            });
        });
    }

    static CreateChannelName(appName, id1, id2) {
        if (id1 > id2) return id1 + ":" + appName + "121:" + id2;
        else return id2 + ":" + appName + "121:" + id1;
    }

    static SubscribeAndShowAllFriends(options, acceptedRequestList) {
        acceptedRequestList.forEach(function (item) {
            SocketHelper.SubscribeAndShowOneFriend(options, item);
        });
    }

    static SubscribeAndShowOneFriend(options, friendRequest) {
        var channel = SocketHelper.CreateChannelName(options.appName, options.user.id, friendRequest.request.sender_id);
        SocketHelper.Socket.emit("subscribe:channel", channel);
        SocketHelper.SubscribeSocket_OnMessage(options, friendRequest.request.sender_id);
        FriendRequest.RenderRequest(friendRequest, options, true);
    }
}
SocketHelper.Socket = null;


class Message {
    constructor(channel, user, messageDeliveryStatus = 1, messageText = "", messageType = _MessageSendingType.TEXT, mediaList = []) {
        this.channel = channel;
        this.messageDeliveryStatus = messageDeliveryStatus;
        this.messageType = messageType;
        this.messageStatusType = 0;

        this.senderUserId = user ? user.id : -1;
        this.senderUserName = user ? user.name : "user";
        this.senderUserImage = user ? user.image : "";

        this.message = messageText;

        this.isMedia = mediaList && mediaList.length > 0;
        this.mediaURL = mediaList;
    }

    static CreateMessageFromStringObj(messageObjString) {
        var tempMessage = new Message();
        var messageObj = JSON.parse(messageObjString);
        tempMessage.channel = messageObj.channel;
        tempMessage.date = messageObj.date;
        tempMessage.id = messageObj.id;
        tempMessage.isMedia = messageObj.isMedia;
        tempMessage.mediaURL = messageObj.mediaURL;
        tempMessage.message = messageObj.message;
        tempMessage.messageDeliveryStatus = messageObj.messageDeliveryStatus;
        tempMessage.messageStatusType = messageObj.messageStatusType;
        tempMessage.messageType = messageObj.messageType;
        tempMessage.senderUserId = messageObj.senderUserId;
        tempMessage.senderUserName = messageObj.senderUserName;
        tempMessage.senderUserImage = messageObj.senderUserImage;
        return tempMessage;
    }

    static RenderMessageList(messageList, options, loadChatOfExistingChannel) {
        var topMessage = $(options.messageListContainerSelector).children().first();

        $.each(messageList, function () {
            Message.RenderMessage(this, options, loadChatOfExistingChannel);
        });
        if (loadChatOfExistingChannel) {
            var childPos = topMessage.offset();
            var parentPos = topMessage.parent().offset();
            $(options.messageListContainerSelector).scrollTop(childPos.top - parentPos.top);
        }
        else $(options.messageListContainerSelector).animate({ scrollTop: $(options.messageListContainerSelector).prop("scrollHeight") }, 1000);
    }

    static RenderMessage(message, options, isPrepend) {

        var gallaryId = $("." + _attachmentGroupClass).length + 1;
        var attachmentHtml = [];
        var isAttachThumbBackground = $(options.viewAttachmentHtml).find(options.attachmentImageSelector).hasClass(_backgroundImageClass);
        message.mediaURL.forEach((attachment) => {
            debugger
            if (attachment) {
                attachmentHtml.push(
                    $(options.viewAttachmentHtml)
                        .find(options.attachmentImageSelector).setImage(attachment.fileThumbnailPath, isAttachThumbBackground)//, options.defaultAttachmentImage
                        .find(options.attachmentUrlSelector).setAttribute("href", attachment.filePath)
                        .find(options.attachmentUrlSelector).setAttributeIf("data-fancybox", "gallery" + gallaryId, attachment.fileType.indexOf("image") > -1)
                        .find(options.attachmentUrlSelector).setAttributeIf("target", "_blank", attachment.fileType.indexOf("image") === -1)
                );
            }
        });

        var actionName = isPrepend ? "prepend" : "append";
        var messageHtml = (message.senderUserId == options.user.id) ? options.sentMessageHtml : options.receivedMessageHtml
        var isBackground = $(options.sentMessageHtml).find(options.messageUserImageSelector).hasClass(_backgroundImageClass);
        $(options.messageListContainerSelector)[actionName](
            $(messageHtml)
                .find(options.messageUserImageSelector).setImage(message.senderUserImage, isBackground, options.defaultUserImage)
                .find(options.messageUsernameSelector).setText(message.senderUserName)
                .find(options.messageTextSelector).setText(message.message)
                .find(options.messageTimeSelector).setDatetime(message.date, false)
                .find(options.viewAttachmentContainerSelector).addClass(_attachmentGroupClass).prevObject
                .find(options.viewAttachmentContainerSelector).append(attachmentHtml).prevObject
        );

        Helper.InitializeFancybox();
    }

    static SendMessage(messageType, options) {
        
        if (_friendId) {
            var messageText = $(options.messageTextInputSelector).val();
            if (SocketHelper.Socket) {
                var fileList = Attachment.GetAttachedFileList(options);
                var messageObj = new Message(_currentChannel, options.user, undefined, messageText, messageType, fileList);
                if (messageType == _MessageSendingType.TEXT && ((messageText && messageText.length > 0) || fileList.length > 0)) {
                    
                    SocketHelper.Socket.emit(_sendMessageChannel, messageObj); // we send message in both scenarios (request accepted or not)
                    $(options.messageTextInputSelector).val("");
                    localStorage.setItem('_m_s_' , true );
                    $(options.uploadAttachmentContainerSelector).empty();
                    
                }
                else if (messageType == _MessageSendingType.TYPING || messageType == _MessageSendingType.STOP_TYPING) {
                    SocketHelper.Socket.emit(_sendMessageChannel, messageObj);
                }
            }
        }
    }

    static LoadExistingMessages(options, loadChatOfExistingChannel = false) {
        if (_friendId) {
            var url = options.apiUrl + 'LoadMessage/' + _currentChannel + '/' + _pageNo + '/' + _pageRecordCount;
            $(options.loaderSelector).show();

            if (!loadChatOfExistingChannel) {
                $(options.messageListContainerSelector).empty();
                //$(options.messageTextInputSelector).val("");
            }

            Helper.GetRequest(url, (response) => {
                try {

                    $(options.loaderSelector).hide();
                    if (response) {//&& response.data.MessageList.length > 0
                        var newMessagesList = [];
                        response.data.MessageList.forEach((element) => {
                            var msg = Message.CreateMessageFromStringObj(element);
                            newMessagesList.push(msg);
                        });
                        if (loadChatOfExistingChannel) newMessagesList.reverse();
                        Message.RenderMessageList(newMessagesList, options, loadChatOfExistingChannel);

                        _hasPreviousMessages = response.data.hasPreviousMessages;
                        _totalRecords = response.data.totalrecords;
                    }

                } catch (ex) {
                    console.log(ex);
                }
            });
        }
    }

    static RenderLastMessageInFriendList(options, message) {
        $(options.friendListContainerSelector)
            .find("[data-" + _friendChannelDataAttrName + "='" + message.channel + "']")
            .attr("data-" + _friendDateDataAttrName + "", message.date)
            .find(options.friendLastMsgTextSelector).setText(message.senderUserName + ": " + message.message)
            .find(options.friendLastMsgDateTimeSelector).setDatetime(message.date, true);
    }
}

class Attachment {
    constructor(fileExtension, filePath, fileThumbnailPath, fileType) {
        this.fileExtension = fileExtension;
        this.filePath = filePath;
        this.fileThumbnailPath = fileThumbnailPath;
        this.fileType = fileType;
    }

    static AddAttachent(options, event) {
       
        var checkSizeLimitPicture = true;
        var checkuploadLimitPicture = true;
        var checkSizeLimitVideo = true;
        var checkuploadLimitVideo = true;
        var files = event.target.files;
        var that = this;
        if (files && files.length > 0) {
            var fromData = new FormData();
            var fileAllowed = true;
            var picCount = 1;
            var vidCount = 1;
            
            if(files && files.length > 0){
                $.each(files, (index, file) => {
                    if (!file) {
                        return;
                    }
            
                    // Valdation For Pictures & Documents
                    if (file.type.indexOf('image/') > -1  || file.type.match('application/pdf') ) {
                        if(picCount <= 5){
                            if(file.size/1024/1024 <= 2){
                                fromData.append("FileList", file);
                                picCount++;
                            } else {
                                checkSizeLimitPicture = false;
                                return;
                            }
                            
                        } else{
                            checkuploadLimitPicture = false;
                            return;
                        }
                    }

                    // Validation for Videos
                    if (file.type.indexOf('audio/') > -1 || file.type.indexOf('video/') > -1 ) {
                        if(vidCount == 1){
                            if(file.size/1024/1024 <= 10){
                                fromData.append("FileList", file);
                                vidCount++;
                            }else {
                                checkSizeLimitVideo = false;
                                return;
                            }
                            
                        } else{
                            checkuploadLimitVideo = false;
                            return;
                        }
                    }
                });
            }
            
            if(!checkSizeLimitPicture){
                $('.alert-danger').remove();
                $.notify(
                    { message: 'File size should be less than 2mb.' },
                    { type: 'danger' }
                );
                return;
            } else if (!checkuploadLimitPicture){
                $('.alert-danger').remove();
                $.notify(
                    { message: 'Maximum 5 pictures can be upload at a time.' },
                    { type: 'danger' }
                );
                return;
            } else if (!checkSizeLimitVideo){
                $('.alert-danger').remove();
                $.notify(
                    { message: 'File size should be less than 10mb.' },
                    { type: 'danger' }
                );
                return;
            } else if (!checkuploadLimitVideo){
                $('.alert-danger').remove();
                $.notify(
                    { message: 'Video file can not upload more than 1' },
                    { type: 'danger' }
                );
                return;
            } else if( !fileAllowed){
                $('.alert-danger').remove();
                $.notify(
                    { message: 'We allowed only jpeg, png, gif ,pdf extensions.' },
                    { type: 'danger' }
                );
                return;
            } else{ 
                $(options.loaderSelector).show();
                Helper.PostRequest(options.apiUrl + 'UploadMedia', fromData, function (data) {//
                    $(options.loaderSelector).hide();
                    if (data.statusCode == 200) {
                        Attachment.RenderUploadAttachmentList(options, data.Attachments);
                    }
                },
                    () => {
                        $(options.loaderSelector).hide();
                    }
                );
            }
        }
    }

    static RenderUploadAttachmentList(options, attachmentList) {
        attachmentList.forEach((attachment) => {
            Attachment.RenderUploadAttachment(options, attachment);
        });

        $(options.attachmentCloseBtnSelector).unbind();
        $(options.attachmentCloseBtnSelector).on('click', function () {
            $(this).closest("." + _uploadAttachmentClass).remove();
        });
    }

    static RenderUploadAttachment(options, attachment) {
        var isBackground = $(options.uploadAttachmentHtml).find(options.attachmentImageSelector).hasClass(_backgroundImageClass);

        $(options.uploadAttachmentContainerSelector).append(
            $(options.uploadAttachmentHtml)
                .attr("data-" + _uploadAttachmentFileExtension, attachment.fileExtension)
                .attr("data-" + _uploadAttachmentFilePath, options.apiUrl + attachment.filePath)
                .attr("data-" + _uploadAttachmentFileThumbnailPath, options.apiUrl + attachment.fileThumbnailPath)
                .attr("data-" + _uploadAttachmentFileType, attachment.fileType)
                .addClass(_uploadAttachmentClass)
                .find(options.attachmentImageSelector).setImage(options.apiUrl + attachment.fileThumbnailPath, isBackground)//, options.defaultAttachmentImage
                .find(options.attachmentUrlSelector).setAttribute("href", options.apiUrl + attachment.filePath)
                .find(options.attachmentUrlSelector).setAttribute("target", "_blank")
        );
    }

    static GetAttachedFileList(options) {
        var attachmentList = [];
        $(options.uploadAttachmentContainerSelector).children().each(function () {
            var fileExtension = $(this).data(_uploadAttachmentFileExtension);
            var filePath = $(this).data(_uploadAttachmentFilePath);
            var fileThumbnailPath = $(this).data(_uploadAttachmentFileThumbnailPath);
            var fileType = $(this).data(_uploadAttachmentFileType);
            var attachment = new Attachment(fileExtension, filePath, fileThumbnailPath, fileType);
            attachmentList.push(attachment);
        });
        return attachmentList;
    }
}

class FriendRequest {

    static SendRequest(receiverId, receiverUsername) {
        if (receiverId && receiverUsername && _user && _appName) {
            var channel = SocketHelper.CreateChannelName(_appName, _user.id, receiverId);
            let request = {
                reciever_username: receiverUsername,
                receiver_id: receiverId,
                sender_username: _user.name,
                sender_id: _user.id,
                Channel: channel
            };
            SocketHelper.Socket.emit(_requestChannel, request);
        }
        //if (_acceptedRequest == null) {
        //}
    }

    static LoadExistingAcceptedRequests(callback) {
        if (_options) {
            const url = _options.apiUrl + 'LoadChannel/' + _options.appName + _acceptedRequestChannelPart + _options.user.id;
            Helper.GetRequest(url, (resp) => {
                try {
                    if (resp && resp.status === 200) {
                        if (resp.data && resp.data.RequestList && resp.data.RequestList.length > 0) {
                            callback(resp.data.RequestList);
                        }
                    }
                }
                catch (ex) {
                    console.log(ex);
                }
                callback([]);
            });
        }
        else {
            console.log("Please initialize chat first");
        }
    }

    static RenderRequest(request, options, isPrepend = true) {
        var actionName = isPrepend ? "prepend" : "append";
        var lastMessage = request.message ? request.message.senderUserName + ": " + request.message.message : "";
        var lastMessageDate = request.message ? request.message.date : "";
        var isBackground = $(options.friendlistItemHtml).find(options.friendImageSelector).hasClass(_backgroundImageClass);
        var channel = SocketHelper.CreateChannelName(options.appName, request.request.sender_id, request.request.receiver_id);

        var notExists = $(options.friendListContainerSelector).find("[data-" + _friendUserIdDataAttrName + "=" + request.request.sender_id + "]").length == 0;
        if (notExists) {

            $(options.friendListContainerSelector)[actionName](
                $(options.friendlistItemHtml)
                    .attr("data-" + _friendUserIdDataAttrName, request.request.sender_id)
                    .attr("data-" + _friendUsernameDataAttrName, request.request.sender_username)
                    .attr("data-" + _friendChannelDataAttrName, channel)
                    .attr("data-" + _friendDateDataAttrName, lastMessageDate)
                    .find(options.friendImageSelector).setImage(options.defaultUserImage, isBackground, options.defaultUserImage)
                    .find(options.friendNameSelector).setText(request.request.sender_username)
                    .find(options.friendLastMsgTextSelector).setText(lastMessage)
                    .find(options.friendLastMsgDateTimeSelector).setDatetime(lastMessageDate, true)
                    .on("click", function () {
                        var userId = $(this).data(_friendUserIdDataAttrName);
                        var userName = $(this).data(_friendUsernameDataAttrName);
                        IngicChat.InitChatWithFriend(userId, userName);
                    })
            );
        }

    }
}


class Helper {
    static InitJquery(options) {
        $(options.sendMessageBtnSelector).on('click', function () {
            
            Message.SendMessage(_MessageSendingType.TEXT, options);
        });

        $(options.messageTextInputSelector).on('keypress', function (event) {
            debugger
            console.log('event ==> ',event);
            if (event.keyCode == 13 && !event.shiftKey) {
                Message.SendMessage(_MessageSendingType.TEXT, options);
                event.preventDefault();
            }
            else {
                Message.SendMessage(_MessageSendingType.TYPING, options);
            }
        });

        $(options.messageListContainerSelector).on('scroll', function () {
            clearTimeout($.data(this, 'scrollTimer'));
            $.data(this, 'scrollTimer', setTimeout(function () {
                if ($(options.messageListContainerSelector).scrollTop() === 0) {
                    if (_hasPreviousMessages) {
                        _pageNo++;
                        Message.LoadExistingMessages(options, true);
                    }
                }
            }, 250));
        });

        $(options.uploadAttachmentBtnSelector).on('change', function () {
            debugger
            Attachment.AddAttachent(options, event);
            $(options.uploadAttachmentBtnSelector).val('');
        });

        setTimeout(() => {
            
            $(options.messageTextInputSelector).emojiPicker({
                height: '350px',
                width: '450px',
                button: false
            });

            $(options.messageEmojiPopupBtnSelector).on('click', function () {
               
                $(options.messageTextInputSelector).emojiPicker("toggle");
            });
        }, 300);
    }

    static GetRequest(url, callback, auth) {
        if (auth) axios.defaults.headers.common['Authorization'] = 'Bearer ' + auth;

        axios.get(url)
            .then(callback)
            .catch(function (error) {
                callback(error.response);
            });
    }

    static PostRequest(url, fromData, successCallback, errorCallback) {
        $.ajax({
            url: url,
            type: "POST",
            data: fromData,
            processData: false,
            contentType: false,
            beforeSend: function () {
            },
            success: successCallback,
            error: function (xhr, textStatus, errorThrown) {
                console.log('error');
                errorCallback();
            },
            complete: function () {
            }
        });
    }

    static ParseRequestsAndSave(options, requestList) {
        var acceptedRequestList = [];
        requestList.forEach(function (item) {
            var obj = {
                request: JSON.parse(item.request),
                message: JSON.parse(item.message)
            };

            acceptedRequestList.push(obj);
        });
        SocketHelper.SubscribeAndShowAllFriends(options, acceptedRequestList);
        return acceptedRequestList;
    }

    static ShowSelectedFriend(options) {
        $(options.friendListContainerSelector).children().removeClass(options.friendSelectedClassName);
        $(options.friendListContainerSelector)
            .find("[data-" + _friendUserIdDataAttrName + "=" + _friendId + "]")
            .addClass(options.friendSelectedClassName);

        $(options.selectedUsernameSelector).text(_friendUsername);
        if (options.selectedUsernameClickCallback) $(options.selectedUsernameSelector).on("click", () => options.selectedUsernameClickCallback(_friendId));

        var isBackground = $(options.selectedUserImageSelector).hasClass(_backgroundImageClass)
        $(options.selectedUserImageSelector).setImage(options.defaultUserImage, isBackground, options.defaultUserImage);
        if (options.selectedImageClickCallback) $(options.selectedUserImageSelector).on("click", () => options.selectedImageClickCallback(_friendId));
    }

    static SetFriendListDateRefreshSetting(options) {
        setInterval(() => {
            $(options.friendListContainerSelector).children().each(function () {
                var lastMessageDate = this.dataset.msgdate;
                $(this).find(options.friendLastMsgDateTimeSelector).setDatetime(lastMessageDate, true);
            });

        }, 5000)
    }

    static InitializeFancybox() {
        $("[data-fancybox]").fancybox({
            buttons: [
                "zoom",
                "fullScreen",
                "download",
                "thumbs",
                "close"
            ]
        });
    }
}

function getBase64(url ,callback){
  
    let data = url.split('/');
    if(data[0] == "https:"){
       
        var img = new Image();
        img.crossOrigin = 'Anonymous';
        img.src = url;
        img.onload = function() {
            var canvas = document.createElement('CANVAS');
            var ctx = canvas.getContext('2d');
            var dataURL;
            canvas.height = this.height;
            canvas.width = this.width;
            ctx.drawImage(this, 0, 0);
            dataURL = canvas.toDataURL();
            callback(dataURL)
        };
        
    }else callback(url);

}

class PushNotification {

    static RequestNotificationPermission() {
        if (Notification.permission !== "granted")
            Notification.requestPermission();
    }

    static ShowPushNotification(options, title, body, onClickUrl) {
        if ($(options.messageListContainerSelector).length == 0) {
            if (Notification.permission == "granted" || Notification.permission == "default") {
                var notification = new Notification(title, {
                    icon: options.appIconPath,
                    body: body,
                });
                if (onClickUrl) {
                    notification.onclick = function () {
                        window.open(onClickUrl);
                    };
                }
            }
        }
    }

}

const _MessageSendingType = {
    TEXT: 0,
    IMAGE: 1,
    TYPING: 2,
    STOP_TYPING: 3,
    AUDIO: 4,
    VIDEO: 5,
};
const _friendUserIdDataAttrName = "userid";
const _friendUsernameDataAttrName = "username";
const _friendChannelDataAttrName = "channel";
const _friendDateDataAttrName = "msgdate";

const _uploadAttachmentFileExtension = "fileextension";
const _uploadAttachmentFilePath = "filepath";
const _uploadAttachmentFileThumbnailPath = "filethumbnailpath";
const _uploadAttachmentFileType = "filetype";
const _attachmentGroupClass = "attachmentGroup";

const _backgroundImageClass = "backgroundImg";
const _uploadAttachmentClass = "uploadedAttachment";

const _acceptedRequestChannelPart = ":Chat:Listing:Subscribe:Channel:User:";
const _requestChannel = "requestaccepted:channel";
const _sendMessageChannel = "io:sendmessageagent";

var _hasPreviousMessages;
var _totalRecords;
var _pageNo;
var _pageRecordCount;
var _user;
var _appName;

var _friendId;
var _friendUsername;
var _currentChannel;
var _options;
