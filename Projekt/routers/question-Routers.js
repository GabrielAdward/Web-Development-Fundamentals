const express = require("express");
const db = require("../db");

const QUESTION_NAME_MAX_LENGTH = 12;
const QUESTION_EMAIL_MAX_LENGTH = 30;
const QUESTION_TITLE_MAX_LENGTH = 30;
const POST_ANSWER_MAX_LENGTH = 30;

const router = express.Router();

router.get("/", (request, response) => {
  db.getAllQuestions(function (error, questions) {
    const model = {
      questions,
    };

    response.render("questions.hbs", model);
  });
});

router.get("/create-question", function (request, response) {
  if (request.session.isLoggedIn) {
    response.render("create-question.hbs");
  } else {
    response.redirect("/login");
  }
});

router.post("/create-question", function (request, response) {
  const qName = request.body.name;
  const qemail = request.body.email;
  const qgrade = parseInt(request.body.websiteGRADE, 10);
  const qtitle = request.body.questionTITLE;
  const errorMessages = [];



if(qName == ""){
  errorMessages.push("Name can't be empty");
}else if(QUESTION_NAME_MAX_LENGTH < qName.length){
  errorMessages.push("Name may be at most "+ QUESTION_NAME_MAX_LENGTH +" characters long")
}

if(qemail == ""){
  errorMessages.push("Name can't be empty");
}else if(QUESTION_EMAIL_MAX_LENGTH < qemail.length){
  errorMessages.push("Email may be at most "+ QUESTION_EMAIL_MAX_LENGTH +" characters long")
}

if(qtitle == ""){
  errorMessages.push("Name can't be empty");
}else if(QUESTION_TITLE_MAX_LENGTH < qtitle.length){
  errorMessages.push("Title may be at most "+ QUESTION_TITLE_MAX_LENGTH +" characters long")

}

if(isNaN(qgrade)){
  errorMessages.push("You did not enter a number for the grade")
}else if(qgrade < 0){
  errorMessages.push("Grade may not be negative")
}else if(10 < qgrade){
  errorMessages.push("Grade may at most be 10")
}


  if(errorMessages.length == 0){
    db.createQuestion(qName, qemail, qgrade, qtitle, function (error) {
      if (error) {
        console.log(error);
      } else {
        console.log("it worked");
        //response.redirect("/posts/" + this.lastID)
        response.redirect("/questions");
      }
    });
  }else{
    const model = {
      errorMessages, qName, qemail, qgrade, qtitle
    };
    response.render("create-question.hbs", model);
  }
  
});


router.post("/delete-questions/:questionid", function (request, response) {
    if (request.session.isLoggedIn) {
      //
      const id = request.params.questionid;
  
    db.deleteSpecificQuestion(id, function (error) {
        if (error) {
          console.log(error);
          console.log("error");
        } else {
          response.redirect("/questions");
        }
      });
    } else {
      response.redirect("/login");
    }
  });

router.get("/question/:questionid", function (request, response) {
  const id = request.params.questionid;

  db.getQuestionById2(function (id, error, question) {
    db.getAnswersByQuestionId(function (id, error, answers) {
      const model = {
        question,
        answers,
      };

      response.render("question.hbs", model);
    });
  });
});

router.get("/:questionid", function (request, response) {
  const id = request.params.questionid;

  db.getQuestionById2(id, function (error, question) {
    console.log(error);

    db.getAnswersById(id, function (error, answers) {
      const model = {
        question,
        answers,
      };

      response.render("question.hbs", model);
    });
  });
});


router.get("/add-answer/:questionid", function (request, response) {
    if (request.session.isLoggedIn) {
      //
      const id = request.params.questionid;

  
      db.getQuestionById2(id, function (error, question) {
        if (error) {
          console.log(error);
        } else {
          const model = {
            question,
          };
          response.render("add-answers.hbs", model);
        }
      });
    } else {
      response.redirect("/login");
    }
  });

  router.post("/add-answer/:questionid", function (request, response) {
    const id = request.params.questionid;
    const newAnswer = request.body.answer;
    const errorMessages = [];
    if(newAnswer == ""){
      errorMessages.push("Answer can't be empty");
    }else if(POST_ANSWER_MAX_LENGTH < newAnswer.length){
      errorMessages.push("Answer may be at most "+POST_ANSWER_MAX_LENGTH+" characters long")
  
    }



    if(errorMessages.length == 0){
      db.updateQuestionByNewAnswer(newAnswer,id, function (error) {
          if (error) {
            console.log(error);
            console.log(" error ");
          } else {
            response.redirect("/questions/" + id);
          }
        });
  }else{
        const model = {
          errorMessages, newAnswer
        };
        response.render("add-answers.hbs", model);
      
      }
      
  });

router.get("/:questionid", function (request, response) {
  const id = request.params.questionid;

  db.getQuestionById(id, function (error, question) {
    if (error) {
      console.log(error);
    } else {
      const model = {
        question,
      };
      response.render("question.hbs", model);
    }
  });
});

module.exports = router;
