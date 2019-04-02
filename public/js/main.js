$(document).ready(function(){
    // $('.delete-feed').on('click', function(e){
    //     $target = $(e.target);
    //     const id = $target.attr('data-id');
    //     $.ajax({
    //         type:'DELETE',
    //         url:'/feedbacks/'+id,
    //         success: function(response){
    //             alert('Deleting Feedback');
    //             window.location.href = '/';
    //         },
    //         error: function(err){
    //             console.log(err);
    //         }
    //     })
    // });
    $('.delete-job').on('click', function(e){
        $target = $(e.target);
        const id = $target.attr('data-id');
        $.ajax({
            type:'DELETE',
            url:'/jobs/'+id,
            success: function(response){
                alert('Deleting Job');
                window.location.href = '/';
            },
            error: function(err){
                console.log(err);
            }
        })
    });
    $('.delete-dept').on('click', function(e){
        $target = $(e.target);
        const id = $target.attr('data-id');
        $.ajax({
            type:'DELETE',
            url:'/departments/'+id,
            success: function(response){
                alert('Deleting Department');
                window.location.href = '/';
            },
            error: function(err){
                console.log(err);
            }
        })
    });
});