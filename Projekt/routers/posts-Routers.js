const express = require("express");
const db = require("../db");
const POST_TITLE_MAX_LENGTH = 30;
const POST_MESSAGE_MAX_LENGTH = 100;
const POST_COMMENT_MAX_LENGTH = 30;


const router = express.Router();

const numberPerPage = 1;



router.get("/create", function (request, response) {
  console.log("get /create");
  if (request.session.isLoggedIn) {
    response.render("create-post.hbs");
  } else {
    response.redirect("/login");
  }
});

router.get("/", function (request, response) {
  let page = parseInt(request.query.page);
  if (!request.query.page) {
    page = 1;
  }

  const offset = (page - 1) * numberPerPage;

  // number of posts in the table
  var numberOfPosts = 0;
  db.getPostsByPage(function (error, objectNumber) {
    if (error) {
      console.log(error);
      //send back  error page
    } else {
      //console.log("object: ")
      //console.log(objectNumber)
      numberOfPosts = objectNumber.nb;
      console.log(numberOfPosts);
      numberOfPages = Math.ceil(numberOfPosts / numberPerPage);

      arrayofPages = [];
      for (var i = 1; i <= numberOfPages; i++) {
        arrayofPages.push({ p: i });
      }

      db.getAmountOfPages(numberPerPage, offset, function (error, posts) {
        if (error) {
          console.log(error);
          //send back  error page
        } else {
          posts.forEach(function (p) {
            //console.log(p)
            /*const query = "SELECT * FROM comments WHERE id = ?"
                            const values = [p.id]
                            db.all(query, values, function(error, comments){
                                p.comments=comments
                            })*/
            db.getCommentById2(p.id, function (error, comments) {
              p.comments = comments;
            });
          });
          if (page == 1) {
            prevPage = 1;
          } else {
            prevPage = page - 1;
          }
          if (page == numberOfPages) {
            nextPage = numberOfPages;
          } else {
            nextPage = page + 1;
          }
          const model = {
            posts,
            numberOfPosts,
            numberOfPages,
            arrayofPages,
            page,
            nextPage,
            prevPage,
          };
          // console.log(model);
          response.render("posts.hbs", model);
        }
      });
    }
  });
});

router.post("/create", function (request, response) {
  const posttitle = request.body.title;
  const postmessage = request.body.message;
  const newdate = new Date();
  const theDate = newdate.toString();
  const errorMessages = [];

  if (posttitle == "") {
    errorMessages.push("Title can't be empty");


  }else if(POST_TITLE_MAX_LENGTH < posttitle.length){
    errorMessages.push("Title may be at most "+POST_TITLE_MAX_LENGTH+" characters long")
  }

 if (postmessage == "") {
    errorMessages.push("Message can't be empty");
  }else if(POST_MESSAGE_MAX_LENGTH < postmessage.length){
    errorMessages.push("Message may be at most "+POST_MESSAGE_MAX_LENGTH+" characters long")
  }


  if (errorMessages.length == 0) {
    db.createPost(posttitle, postmessage, theDate, function (error) {
      if (error) {
        console.log(error);
      } else {
        console.log("it worked");
        //response.redirect("/posts/" + this.lastID)
        response.redirect("/posts?page=1");
      }
    });
  } else {
    const model = {
      errorMessages, posttitle, postmessage
    };
    response.render("create-post.hbs", model);
  }
});

router.post("/delete/:id", function (request, response) {
  if (request.session.isLoggedIn) {
    const id = request.params.id;

    db.deleteSpecificPost(id, function (error) {
      if (error) {
        console.log(error);
        console.log("error");
      } else {
        response.redirect("/posts");
      }
    });
  } else {
    response.redirect("/login");
  }
});

router.get("/update/:id", function (request, response) {
  if (request.session.isLoggedIn) {
    const id = request.params.id;
    
    db.getPostById(id, function (error, post) {
      if (error) {
      } else {
        const model = {
          post,
        };
        response.render("update-post.hbs", model);
      }
    });
  } else {
    response.redirect("/login");
  }
});

router.post("/update/:id", function (request, response) {
  const id = request.params.id;
  const newTitle = request.body.title;
  const newMessage = request.body.message;
  const errorMessages = [];



  if (newTitle == "") {
    errorMessages.push("New Title can't be empty");
  
  }else if(POST_TITLE_MAX_LENGTH < newTitle.length){
    errorMessages.push("Title may be at most "+POST_TITLE_MAX_LENGTH+" characters long")
  }

 if (newMessage == "") {
    errorMessages.push("New Message can't be empty");
  }else if(POST_MESSAGE_MAX_LENGTH < newMessage.length){
    errorMessages.push(" New Message may be at most "+POST_MESSAGE_MAX_LENGTH+" characters long")
  }

  if (errorMessages.length == 0) {
  db.updateTheSpecifPost(newTitle, newMessage, id, function (error) {
    if (error) {
      console.log(error);
      console.log(" error ");
    } else {
      response.redirect("/posts/" + id);
    }
  });
} else {
  const model = {
    post:{
      id,
      title: newTitle,
      message: newMessage

    },
    errorMessages
  };
  response.render("update-post.hbs", model);
}
});











//ta bort
router.get("/search", (request, response) => {
  console.log(request.query);
  const searchTitle = request.query.title;
  db.searchSpecificPost(searchTitle, function (error, post) {
    if (error) {
      console.log(error);
      console.log("error");
    } else {
      const model = {
        post,
        searchTitle,
      };
      response.render("search.hbs", model);
    }
  });
});

router.get("/:id", function (request, response) {
  const id = request.params.id;

  db.getPostById(id, function (error, post) {
    db.getCommentById(id, function (error, comments) {
      if (error) {
        console.log(error);
      } else {
        const model = {
          post,
          comments,
        };

        response.render("post.hbs", model);
      }
    });
  });
});

router.get("/add-comments/:id/:page", function (request, response) {
  if (request.session.isLoggedIn) {
    const id = request.params.id;
    const page = request.params.page;

    db.getCommentForSpecificPost(id, function (error, post) {
      if (error) {
        console.log(error);
      } else {
        const model = {
          post,
          page,
        };
        response.render("add-comments.hbs", model);
      }
    });
  } else {
    response.redirect("/login");
  }
});

router.post("/add-comments/:id/:page", function (request, response) {
  const id = request.params.id;
  const page = request.params.page;
  const newComment = request.body.comment;
  const errorMessages = [];

	if(newComment == ""){
		errorMessages.push("Title can't be empty");
	}else if(POST_COMMENT_MAX_LENGTH < newComment.length){
    errorMessages.push("Title may be at most "+POST_COMMENT_MAX_LENGTH+" characters long")

	}

  if(errorMessages.length == 0){
		db.updateTheComment(newComment, id, function (error) {
			if (error) {
				console.log(error);
				console.log(" error ");
			} else {
				
				response.redirect("/posts/" + id);
			}
		});
}else{
	const model = {
		errorMessages, newComment
	};
	response.render("add-comments.hbs", model);

}
});

module.exports = router;
