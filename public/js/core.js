$(function() {
    
    function toWords() {
        var dt = new Date($(this).attr("datetime"));
        $(this).text($.timeago(dt));
    }
      
    $("time.timeago").each(toWords);
    
    var hideDeleteModal = function() {
        $("#delete-modal").modal('hide');
    };
    
    var deleteDoc = function(id) {
        $.ajax({
            url: '/jsondb/'+id,
            type: 'DELETE',
            success: function(data) {
                console.debug("response", data);
                hideDeleteModal();
                location.reload();
            },
            error: function() {
                console.debug("error");
                hideDeleteModal();
            }
        });
    };

    
    // #delete Modal
    $("a.delete").click(function(){
        console.debug("bloop!", this.id);
        $("#delete-modal .record-field").text(this.id);
        $("#delete-modal").data("delete-id", this.id);
        $("#delete-modal").modal('show');
    });


    $("#delete-ok").click(function(){
        var id = $("#delete-modal").data("delete-id");
        id = id.replace("id-","");
        if (id) {
            console.debug("data", id);
            deleteDoc(id);            
        }
    });

    $("#delete-cancel").click(function(){
        hideDeleteModal();
    });
    
    
});