const router = require("express").Router();
const fetch = require("node-fetch");

const Scores = require("../models/scores");

router.get("/", async (req, res) => {
  res.render("index");
});


router.post("/startQuiz", async (req,res) => {

  // Get data from the just registered player
  const playerData = new Scores(req.body);
  const category = req.body.category;
  const picturesToAsk=category*category/2

  // Pictures are obtained from TheCatApi Database (https://docs.thecatapi.com)
  var jsonRes = await fetch(`https://api.thecatapi.com/v1/images/search?mime_types=jpg,png&limit=${picturesToAsk}&size=medium`)
    .then((res) => res.json())
    .catch((e) => console.error(e));
  
  // Generate image array, looping twice to create pairs
  const pictureSet = [];
  jsonRes.forEach((elem) =>
    pictureSet.push({order:Math.random(),urlPicture: elem.url})
  );
  jsonRes.forEach((elem) =>
  pictureSet.push({order:Math.random(),urlPicture: elem.url})
);

  // Apply random sorting for pictures
  pictureSet.sort((a,b)=>b.order-a.order)

  // Get pass other players records and rank these by score
  // Sorting criteria: first come category (desc) and after amount of mistakes (asc)
  var rankList = await Scores.find();
  rankList.sort((a, b) => {
    if(a.category == b.category){
      return a.score - b.score;
    }
    return b.category - a.category;
  });

  res.render("quiz",{playerData,pictureSet,category,rankList})
})



router.post("/checkQuiz", async (req, res) => {

  // Recieve data from quiz page
  var gameRecords = Object.assign({}, []);
  gameRecords.name = req.body.playerName;
  gameRecords.time = req.body.quizTime;
  gameRecords.score = req.body.quizScore;
  gameRecords.category = req.body.category;

  // Save current run records in database
  try {
    const newRecord = new Scores(gameRecords);
    await newRecord.save();

    // Send back to results page, pass player data and answers
    res.send({ message: "Record was saved" });
  } catch (err) {
    // If error report to client
    res.status(500).send(err);
  }
});

module.exports = router;