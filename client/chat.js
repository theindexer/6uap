Template.chat.helpers({
  messages: function() {
    return Chats.find({},{sort:{timestamp:-1}})
  },
  chat_style: function() {
    return "height:" + (8 * (tile_height - 7) * scale.get() + 7) + "px"
  },
  who_said: function() {
    if (Meteor.userId()==this.user) {
      return "Me";
    } else {
      return "Others";
    }
  },
  msg_class: function() {
    return Meteor.userId() == this.user ? "self-said" : "other-said";
  }
})

Template.chat.events({
  'keypress .msgtext' : function(evt, template) {
    if(evt.which !=13) { return }
      var msg = template.find(".msgtext").value;
      msg = msg.trim()
      if(msg == "") { return }
      template.find(".msgtext").value = ''
      var chatObj = {
        content:msg,
        timestamp: Date.now(),
        user:Meteor.userId(),
        game:Session.get("gameId")
      }
      Chats.insert(chatObj)
    
  }
}) 
