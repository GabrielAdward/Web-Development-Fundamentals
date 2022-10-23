
const sqlite3 = require('sqlite3')
const { search } = require('./routers/posts-Routers')
const db = new sqlite3.Database("blog-database.db")

db.run(`
	CREATE TABLE IF NOT EXISTS posts(
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		title TEXT,
		message TEXT,
		date TEXT
	)
`)

db.run(`

	CREATE TABLE IF NOT EXISTS comments(
		commentid INTEGER PRIMARY KEY AUTOINCREMENT,
		comment TEXT,
		id INTEGER,
		FOREIGN KEY(id) REFERENCES posts(id)

	)

`)

db.run(`
	CREATE TABLE IF NOT EXISTS questions(
		questionid INTEGER PRIMARY KEY AUTOINCREMENT,
		name TEXT,
		email TEXT,
		websiteGRADE INTEGER,
		questionTITLE TEXT

	)
`)

db.run(`

	CREATE TABLE IF NOT EXISTS answers(
		answerid INTEGER PRIMARY KEY AUTOINCREMENT,
		answer TEXT,
		questionid INTEGER,
		FOREIGN KEY(questionid) REFERENCES questions(questionid)

	) 

`)

exports.getAllPosts = function(callback){
  const query = "SELECT * FROM posts"
	db.all(query,function(error, posts){
        callback(error, posts)
    })
}


exports.getSpecificPost = function(callback){
    const query = "SELECT * FROM posts WHERE id = ?"
    const values = [id]
    db.get(query, values, function(error, posts){
        callback(error, posts)
    })
}

exports.createPost = function(posttitle, postmessage, theDate , callback){
  const query = "INSERT INTO posts (title, message, date) VALUES (?, ?,?)" 
	const values = [posttitle, postmessage, theDate]
	db.run(query, values, function(error){
        callback(error)
    })
}


exports.getPostById = function(id, callback){
	const query = "SELECT * FROM posts WHERE id=?"
	const value =[id]
	db.get(query, value, function(error, post){
    callback(error , post)
  })
}

exports.getCommentById = function(id, callback){
  const query = "SELECT * FROM comments WHERE id = ?"
	const values = [id]
	db.all(query, values, function(error, post){
      callback(error, post)
  })
}

exports.getCommentById2 = function(id, callback){
  const query = "SELECT * FROM comments WHERE id = ?"
	const values = [id]
	db.all(query, values, function(error, post){
    callback(error, post)
  })
}

exports.deleteSpecificPost = function(id,callback){

	const query = 'DELETE FROM posts WHERE id = ?'
	const values = [id]
	db.run(query, values, function(error){
		callback(error)
	})
}

exports.getPostsByPage = function(callback){
	const query = "SELECT COUNT(*) AS nb FROM posts" 
	db.get(query, function(error,post){
		callback(error, post)
	})
}

exports.getAmountOfPages = function(numberPerPage,offset,callback){
	const query2 = "SELECT * FROM posts ORDER BY title DESC  LIMIT " + numberPerPage + " OFFSET " + offset 
	db.all(query2,function(error,post){
		callback(error,post)
	})
}


exports.updateTheSpecifPost = function(newTitle, newMessage,id, callback){
	const query = "Update posts SET title=?, message=? WHERE id=?";
  const values = [newTitle, newMessage, id];
  db.run(query, values,function(error,post){
	callback(error, post)
  })
}

exports.getCommentForSpecificPost = function(id, callback){
	const query = "SELECT * FROM posts WHERE id=?";
  const value = [id];
  db.get(query, value, function(error,post){
		callback(error,post)
	})
}


exports.updateTheComment = function(newComment, id, callback){
	const query = "INSERT INTO comments (comment, id) VALUES (?,?)";
	const values = [newComment, id];
	db.run(query, values, function(error,post){
		callback(error,post)
	})
}



exports.getAllQuestions = function(callback){
	const query = "SELECT * FROM questions";
	db.all(query, function(error, questions){
		callback(error,questions)
	})
}

exports.getQuestionById = function(id, callback){
	const query = `SELECT * FROM questions WHERE questionid = ?`;
	const values = [id];
	db.get(query, values, function(error,questions){
		callback(error,questions)
	})
}

exports.getQuestionById2 = function(id, callback){
	const query = "SELECT * FROM questions WHERE questionid = ?";
  const values = [id];
  db.get(query, values, function(error,question){
		callback(error, question)
	})
}

exports.getAnswersById = function(id, callback){
	const query = "SELECT * FROM answers WHERE questionid = ?";
  const values = [id];
  db.all(query, values, function(error,question){
		callback(error,question)
	})
}


exports.getAnswersByQuestionId = function(id,callback){
	const query = "SELECT * FROM answers WHERE questionid = ?";
  const values = [id];
  db.all(query, values, function(error,answer){
		callback(error,answer)
	})
}

exports.createQuestion = function (qNAME,qEMAIL,qGRADE,qTITLE,callback){
	const query = "INSERT INTO questions (name, email, websiteGRADE,questionTitle) VALUES (?, ?,?,?)";
	const values = [qNAME, qEMAIL, qGRADE, qTITLE];
	db.run(query, values, function(error){
		callback(error)
	})
}


exports.deleteSpecificQuestion = function (id, callback){
	const query = "DELETE FROM questions WHERE questionid = ?";
	const values = [id];
	db.run(query, values, function(error){
		callback(error)
	})
}

exports.updateQuestionByNewAnswer = function(newAnswer, id, callback){
	const query = "INSERT INTO answers (answer, questionid) VALUES (?,?)";
	const values = [newAnswer, id];
	db.run(query, values, function(error, question){
		callback(error, question)
	})
}