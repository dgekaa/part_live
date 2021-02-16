import { queryPath } from "./constants";

const QUERY = (body, origin_data) => {
  return Promise.resolve(
    fetch(`${queryPath}/graphql`, {
      method: "POST",
      mode: "cors",
      body: JSON.stringify(body),
      headers: {
        "Access-Control-Allow-Origin": "https://backend.partylive.by",
        "Content-Type": "application/json",
        Authorization: origin_data ? "Bearer " + origin_data : "",
      },
    })
  );
};

export default QUERY;
