import QuestionName from "../../Components/QuestionComponents/QuestionName";
import QuestionSalary from "../../Components/QuestionComponents/QuestionSalary";
import QuestionType from "../../Components/QuestionComponents/QuestionType";
import QuestionDay from "../../Components/QuestionComponents/QuestionDay";

const QuestionsScreen = () => {
  const name = localStorage.getItem("name");
  const salary = localStorage.getItem("salary");
  const type = localStorage.getItem("type");

  return (
    <div>
      {name && salary && type ? <QuestionDay /> : null}
      {name && salary ? <QuestionType /> : null}
      {name ? <QuestionSalary /> : <QuestionName />}
    </div>
  )
}

export default QuestionsScreen;