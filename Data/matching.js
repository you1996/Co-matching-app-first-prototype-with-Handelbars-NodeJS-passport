var scoring = function scoring(mainUser, user) {
  let scoreIntersts = CalculSectionScore(
    mainUser.intersts,
    user.informations.intersts,
    3
  );
  let scoreLanguage = CalculSectionScore(
    mainUser.languages,
    user.informations.languages,
    1
  );
  let scoreUniversity = CalculSectionScore(
    mainUser.university,
    user.informations.university,
    1
  );
  let Calcul_Percent = CalculPercent(
    mainUser.intersts,
    mainUser.languages,
    mainUser.university
  );
  return (
    ((scoreIntersts + scoreUniversity + scoreLanguage) / Calcul_Percent) * 100
  );
};
function CalculPercent(intersts, languages, university) {
  let length_intersts = 0;
  let length_languages = 0;
  let length_university = 0;
  length_intersts = intersts.length * 3;
  length_languages = languages.length;
  length_university = university.length;
  return length_intersts + length_languages + length_university;
}
function ContributeData(user, DataDocument) {
  var contributedData = {};
  try {
    DataDocument.forEach((UserData) => {
      if (UserData.name.toUpperCase() === user.toUpperCase()) {
        contributedData = UserData;
        console.log(contributedData);
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
