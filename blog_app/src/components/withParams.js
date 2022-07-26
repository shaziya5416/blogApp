import { useParams, useNavigate } from "react-router-dom";

const withParams = (WrappedComponent) => (props) => {
  const params = useParams();
  // etc... other react-router-dom v6 hooks
  const navigate = useNavigate();
  return (
    <WrappedComponent
      {...props}
      params={params}
      navigate={navigate}
      // etc...
    />
  );
};
export default withParams;