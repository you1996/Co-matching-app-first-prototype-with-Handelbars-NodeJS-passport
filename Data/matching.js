var scoring = function scoring(mainUser, user) {
  let scoreIntersts = CalculSectionScore(
    mainUser.intersts,
    user.informations.intersts,
    3
  );
  let scoreLanguage = CalculSectionScore(
    mainUser.language,
    user.informations.language,
    1
  );
  let scoreUniversity = CalculSectionScore(
    mainUser.university,
    user.informations.university,
    1
  );
  return scoreIntersts + scoreUniversity + scoreLanguage;
};
function ContributeData(user, DataDocument) {
  var contributedData = {};
  try {
    DataDocument.forEach((UserData) => {
      if (UserData.name.toUpperCase() === user.toUpperCase()) {
        contributedData = UserData;
      }
    });
  } catch (error) {
    console.log(error);
  }
  return contributedData;
}
function CalculSectionScore(table1, table2, poids) {
  let sectionScore = 0;
  table1.forEach((element1) => {
    table2.forEach((element2) => {
      if (element1.toUpperCase() === element2.toUpperCase()) {
        sectionScore = sectionScore + 1 * poids;
      }
    });
  });
  return sectionScore;
}
//console.log(ContributeData("youssri", DataDocument));
module.exports = { scoring, ContributeData };
