const router = require("express").Router();
const fetch = require("node-fetch");

const Categories = require("../models/categorias");
const Puntajes = require("../models/puntajes");

router.get("/", async (req, res) => {
  const categorias = await Categories.find();
  res.render("index", { categorias });
});

router.post("/startQuiz", async (req, res) => {
  // Get data from the just registered player
  const playerData = new Puntajes(req.body);
  const category = req.body.category;

  // Question are obtained from Open Trivia Database (https://opentdb.com/api_config.php)
  var resAPIQuiz = await fetch(
    `https://opentdb.com/api.php?amount=20&type=multiple&category=${category}`
  )
    .then((res) => res.json())
    .catch((e) => console.error(e));

  const jsonRes = resAPIQuiz.results;

  // Set question and alternatives all together
  const questionsSet = [];
  jsonRes.forEach((elem) =>
    questionsSet.push({
      question: elem.question,
      alternatives: elem.incorrect_answers
        .concat(elem.correct_answer)
        .map((value) => {
          return { order: Math.random(), value: value };
        }),
    })
  );

  // Sort randomly alternatives
  questionsSet.map((set) => {
    set.alternatives.sort((a, b) => b.order - a.order);
  });

  // Save the question an correct answer for comparision
  const questionsRef = [];
  jsonRes.forEach((elem) =>
    questionsRef.push({
      question: elem.question,
      correct_answer: elem.correct_answer,
    })
  );

  // Get pass players records and rank these by score
  var rankList = await Puntajes.find();
  rankList.sort((a, b) => b.score - a.score);

  // Render quiz page, pass player data and questions
  res.render("quiz", { playerData, questionsSet, questionsRef, rankList });
});

router.post("/checkQuiz", async (req, res) => {
  // Recieve data from quiz page
  var gameRecords = Object.assign({}, []);
  gameRecords.name = req.body.playerName;
  gameRecords.time = req.body.quizTime;
  gameRecords.score = req.body.quizScore;

  // Save current run records in database
  try {
    const newRecord = new Puntajes(gameRecords);
    await newRecord.save();

    // Send back to results page, pass player data and answers
    res.send({ message: "Record was saved" });
  } catch (err) {
    // If error report to client
    res.status(500).send(err);
  }
});

module.exports = router;
