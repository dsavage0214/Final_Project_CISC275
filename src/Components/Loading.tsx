import Spinner from "react-bootstrap/Spinner";
import "../CSS/Loading.css";

function Loading() {
  return (
    <div className="text-center">
      <h1>Loading</h1>
      <Spinner
        animation="border"
        role="status"
        style={{ width: "5em", height: "5em" }}
      >
      </Spinner>
    </div>
  );
}

export default Loading;
