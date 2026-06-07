import { ClipLoader } from "react-spinners";

function Loader() {
  return (
    <div className="flex justify-center mt-5">
      <ClipLoader size={40} />
    </div>
  );
}

export default Loader;